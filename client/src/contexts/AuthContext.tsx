import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getUser, updateUser } from '@/lib/api/user';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  needsOnboarding: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth and listen for changes
  useEffect(() => {
    let mounted = true;
    let initialized = false;

    // Set up auth state listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      // Handle initial session on first load
      if (!initialized) {
        initialized = true;
        if (session) {
          try {
            // Fetch user data directly with the session token
            const response = await fetch('/api/user', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            });

            if (response.ok) {
              const result = await response.json();
              if (mounted) {
                setUser(result.data);
              }
            } else {
              const error = await response.json();
              console.error('Failed to fetch user:', error);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
        if (mounted) {
          setIsLoading(false);
        }
        return;
      }

      // Handle subsequent auth state changes
      if (event === 'SIGNED_IN' && session) {
        const userData = await getUser().catch((err) => {
          console.error('Error fetching user on sign in:', err);
          return null;
        });
        if (mounted && userData) {
          setUser(userData);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Optionally refresh user data on token refresh
        const userData = await getUser().catch(() => null);
        if (mounted && userData) {
          setUser(userData);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { success: false, error: error.message } : { success: true };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    return error ? { success: false, error: error.message } : { success: true };
  }, []);

  const logout = useCallback(async () => {
    try {
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Sign out timeout')), 5000)
      );

      await Promise.race([signOutPromise, timeoutPromise]);
    } catch (error) {
      console.error('Logout error:', error);
      await supabase.auth.signOut({ scope: 'local' });
    }
  }, []);

  const completeOnboarding = useCallback(async () => {
    if (!user) return { success: false, error: 'No user found' };

    try {
      await updateUser({ onboarding: true });
      setUser({ ...user, onboarding: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to complete onboarding' };
    }
  }, [user]);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return error ? { success: false, error: error.message } : { success: true };
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return error ? { success: false, error: error.message } : { success: true };
  }, []);

  // needsOnboarding is TRUE when onboarding is FALSE (user hasn't completed onboarding)
  const needsOnboarding = user ? user.onboarding === false : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        needsOnboarding,
        login,
        register,
        logout,
        completeOnboarding,
        refreshUser,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
