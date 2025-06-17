import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, signIn, signUp, signOut, getCurrentUser, clearInvalidSession } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session with error handling
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Error getting initial session:', error.message);
          
          // If it's a refresh token error, clear the invalid session
          if (error.message?.includes('refresh_token_not_found') || 
              error.message?.includes('Invalid Refresh Token')) {
            console.log('🔄 Clearing invalid session data...');
            await clearInvalidSession();
          }
          
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (err) {
        console.error('Unexpected error during session initialization:', err);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('✅ Token refreshed successfully');
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};