import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';
import type { Session } from '@supabase/supabase-js';

type AuthContextValue = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isClient: boolean;
  signOut: () => Promise<void>;
};

const PortalAuthContext = createContext<AuthContextValue | null>(null);

export function PortalAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!mountedRef.current) return;

    if (error) {
      if (import.meta.env.DEV && error.code !== 'PGRST116') {
        console.error('[portal] profiles fetch:', error.message, error);
      }
      setProfile(null);
      return;
    }

    setProfile(data as Profile | null);
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const bootstrap = async () => {
      try {
        const { data: { session: next } } = await supabase.auth.getSession();
        if (!mountedRef.current) return;
        setSession(next);
        if (next?.user) {
          await fetchProfile(next.user.id);
        } else {
          setProfile(null);
        }
      } catch (e) {
        console.error('[portal] auth bootstrap:', e);
        if (mountedRef.current) {
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    void bootstrap();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      // Avoid Supabase deadlock: never call supabase from this callback synchronously
      queueMicrotask(() => {
        void (async () => {
          if (!mountedRef.current) return;
          setLoading(true);
          setSession(nextSession);
          if (nextSession?.user) {
            await fetchProfile(nextSession.user.id);
          } else {
            setProfile(null);
          }
          if (mountedRef.current) {
            setLoading(false);
          }
        })();
      });
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      profile,
      loading,
      isAdmin: profile?.role === 'admin',
      isClient: profile?.role === 'client',
      signOut,
    }),
    [session, profile, loading, signOut]
  );

  return (
    <PortalAuthContext.Provider value={value}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) {
    throw new Error('useAuth mora biti unutar <PortalAuthProvider> (rute ispod /portal).');
  }
  return ctx;
}
