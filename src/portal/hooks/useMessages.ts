import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Message, Profile } from '../lib/types';

let channelCounter = 0;

export function useMessages(clientId: string | undefined, limit?: number) {
  const instanceId = useRef(++channelCounter);
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = useCallback(async () => {
    if (!clientId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    if (limit) {
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(id, full_name, role, avatar_url)')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(limit);

      setMessages(((data as unknown as Message[]) || []).reverse());
    } else {
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(id, full_name, role, avatar_url)')
        .eq('client_id', clientId)
        .order('created_at', { ascending: true });

      setMessages((data as unknown as Message[]) || []);
    }

    setLoading(false);
  }, [clientId, limit]);

  const fetchUnreadCount = useCallback(async () => {
    if (!clientId || !profile) {
      setUnreadCount(0);
      return;
    }

    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)
      .eq('is_read', false)
      .neq('sender_id', profile.id);

    setUnreadCount(count || 0);
  }, [clientId, profile]);

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, [fetchMessages, fetchUnreadCount]);

  useEffect(() => {
    if (!clientId) return;

    const channel = supabase
      .channel(`messages:${clientId}:${instanceId.current}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `client_id=eq.${clientId}`,
      }, () => {
        fetchUnreadCount();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `client_id=eq.${clientId}`,
      }, async (payload) => {
        const { data: senderData } = await supabase
          .from('profiles')
          .select('id, full_name, role, avatar_url')
          .eq('id', (payload.new as Message).sender_id)
          .single();

        const newMsg = {
          ...payload.new,
          sender: senderData as Profile,
        } as Message;

        setMessages(prev => {
          const withoutOptimistic = prev.filter(m =>
            !(m._pending && m.sender_id === newMsg.sender_id && m.body === newMsg.body)
          );
          if (withoutOptimistic.some(m => m.id === newMsg.id)) return withoutOptimistic;
          return [...withoutOptimistic, newMsg];
        });

        if (profile && newMsg.sender_id !== profile.id) {
          setUnreadCount(prev => prev + 1);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId, profile]);

  const sendMessage = useCallback(async (body: string, attachment?: File) => {
    if (!clientId || !profile) return;

    const tempId = `pending-${Date.now()}`;
    const optimistic: Message = {
      id: tempId,
      client_id: clientId,
      project_id: null,
      sender_id: profile.id,
      body,
      is_read: false,
      created_at: new Date().toISOString(),
      sender: profile as Profile,
      _pending: true,
    };
    setMessages(prev => [...prev, optimistic]);

    let attachmentData: {
      attachment_url?: string;
      attachment_name?: string;
      attachment_type?: string;
      attachment_size?: number;
    } = {};

    if (attachment) {
      const ext = attachment.name.split('.').pop()?.toLowerCase() || '';
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
      const isPdf = ext === 'pdf';
      const safeName = `${Date.now()}_${attachment.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const path = `${clientId}/chat/${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(path, attachment);

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('project-files')
          .getPublicUrl(path);

        attachmentData = {
          attachment_url: urlData.publicUrl,
          attachment_name: attachment.name,
          attachment_type: isImage ? 'image' : isPdf ? 'pdf' : 'document',
          attachment_size: attachment.size,
        };
      }
    }

    const { error } = await supabase.from('messages').insert({
      client_id: clientId,
      sender_id: profile.id,
      body,
      ...attachmentData,
    } as any);

    if (error) {
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  }, [clientId, profile]);

  const markAsRead = useCallback(async () => {
    if (!clientId || !profile) return;

    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('client_id', clientId)
      .eq('is_read', false)
      .neq('sender_id', profile.id);

    setUnreadCount(0);
  }, [clientId, profile]);

  return {
    messages,
    loading,
    unreadCount,
    sendMessage,
    markAsRead,
    refetch: fetchMessages,
  };
}
