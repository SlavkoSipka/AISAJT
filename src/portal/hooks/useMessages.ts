import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Message, Profile } from '../lib/types';

let channelCounter = 0;

export function useMessages(projectId: string | undefined, limit?: number) {
  const instanceId = useRef(++channelCounter);
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);

    let query = supabase
      .from('messages')
      .select('*, sender:profiles!sender_id(id, full_name, role, avatar_url)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (limit) {
      query = query.limit(limit);

      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(id, full_name, role, avatar_url)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(limit);

      setMessages(((data as unknown as Message[]) || []).reverse());
    } else {
      const { data } = await query;
      setMessages((data as unknown as Message[]) || []);
    }

    setLoading(false);
  }, [projectId, limit]);

  const fetchUnreadCount = useCallback(async () => {
    if (!projectId || !profile) return;

    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .eq('is_read', false)
      .neq('sender_id', profile.id);

    setUnreadCount(count || 0);
  }, [projectId, profile]);

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, [fetchMessages, fetchUnreadCount]);

  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel(`messages:${projectId}:${instanceId.current}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `project_id=eq.${projectId}`,
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

        setMessages(prev => [...prev, newMsg]);

        if (profile && newMsg.sender_id !== profile.id) {
          setUnreadCount(prev => prev + 1);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, profile]);

  const sendMessage = useCallback(async (body: string) => {
    if (!projectId || !profile) return;

    await supabase.from('messages').insert({
      project_id: projectId,
      sender_id: profile.id,
      body,
    });
  }, [projectId, profile]);

  const markAsRead = useCallback(async () => {
    if (!projectId || !profile) return;

    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('project_id', projectId)
      .eq('is_read', false)
      .neq('sender_id', profile.id);

    setUnreadCount(0);
  }, [projectId, profile]);

  return {
    messages,
    loading,
    unreadCount,
    sendMessage,
    markAsRead,
    refetch: fetchMessages,
  };
}
