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
        } else if (event === 'SIGNED_UP') {
          console.log('🎉 User signed up successfully');
        } else if (event === 'SIGNED_IN') {
          console.log('✅ User signed in successfully');
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Enhanced signIn with better error handling
  const handleSignIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign in for:', email);
      const result = await signIn(email, password);
      
      // Provide more specific error messages
      if (result.error) {
        console.error('❌ Sign in error:', result.error.message);
        let errorMessage = result.error.message;
        
        if (result.error.message === 'Invalid login credentials') {
          errorMessage = 'The email or password you entered is incorrect. Please check your credentials and try again.';
        } else if (result.error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (result.error.message.includes('Too many requests')) {
          errorMessage = 'Too many sign-in attempts. Please wait a few minutes before trying again.';
        }
        
        return { data: result.data, error: { ...result.error, message: errorMessage } };
      }
      
      console.log('✅ Sign in successful');
      return result;
    } catch (err) {
      console.error('Sign in error:', err);
      return { 
        data: null, 
        error: { message: 'An unexpected error occurred during sign in. Please try again.' } 
      };
    }
  };

  // Enhanced signUp with better error handling and debugging
  const handleSignUp = async (email: string, password: string) => {
    try {
      console.log('📝 Attempting sign up for:', email);
      
      // Check if email confirmation is disabled in Supabase
      const result = await signUp(email, password);
      
      console.log('📝 Sign up result:', result);
      
      // Provide more specific error messages
      if (result.error) {
        console.error('❌ Sign up error:', result.error.message);
        let errorMessage = result.error.message;
        
        if (result.error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (result.error.message.includes('Password should be at least')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (result.error.message.includes('Unable to validate email address')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (result.error.message.includes('Signups not allowed')) {
          errorMessage = 'New account registration is currently disabled. Please contact support.';
        } else if (result.error.message.includes('Database error')) {
          errorMessage = 'Database connection error. Please check your Supabase configuration.';
        } else if (result.error.message.includes('Invalid API key')) {
          errorMessage = 'Invalid Supabase configuration. Please check your API keys.';
        }
        
        return { data: result.data, error: { ...result.error, message: errorMessage } };
      }
      
      // Check if user was created successfully
      if (result.data?.user) {
        console.log('✅ Sign up successful - User created:', result.data.user.id);
        
        // Check if email confirmation is required
        if (!result.data.user.email_confirmed_at && result.data.user.confirmation_sent_at) {
          console.log('📧 Email confirmation required');
          return { 
            data: result.data, 
            error: null,
            message: 'Please check your email and click the confirmation link to complete your registration.'
          };
        } else {
          console.log('✅ User automatically confirmed');
          return result;
        }
      } else {
        console.warn('⚠️ Sign up completed but no user data returned');
        return result;
      }
      
    } catch (err: any) {
      console.error('Sign up error:', err);
      
      // Handle specific error types
      if (err.message?.includes('fetch')) {
        return { 
          data: null, 
          error: { message: 'Network error: Unable to connect to Supabase. Please check your internet connection.' } 
        };
      } else if (err.message?.includes('Invalid API key')) {
        return { 
          data: null, 
          error: { message: 'Invalid Supabase configuration. Please check your API keys in .env file.' } 
        };
      }
      
      return { 
        data: null, 
        error: { message: err.message || 'An unexpected error occurred during account creation. Please try again.' } 
      };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
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