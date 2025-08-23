import { useEffect, useState } from 'react';
import type { Device } from '@/components/device/types';
import { type AuthState, supabase } from '@/lib/supabase';
import type { User } from '../types';

interface Child {
  id: string;
  name: string;
  birthDate: string;
  gender: 'boy' | 'girl';
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    needsOnboarding: false,
  });

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user?.email) {
          const user: User = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            onboardingCompleted: session.user.user_metadata?.onboardingCompleted || false,
          };

          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            needsOnboarding: !user.onboardingCompleted,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            needsOnboarding: false,
          });
        }
      } catch (_error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          needsOnboarding: false,
        });
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user && session.user.email) {
        const user: User = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          onboardingCompleted: session.user.user_metadata?.onboardingCompleted || false,
        };

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          needsOnboarding: !user.onboardingCompleted,
        });
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          needsOnboarding: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const register = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  };

  const completeOnboarding = async (
    childData: Omit<Child, 'id'>,
    deviceData: Omit<Device, 'id'>
  ) => {
    if (!authState.user) return { success: false, error: 'No user found' };

    // Update user metadata to mark onboarding as completed
    const { error: updateError } = await supabase.auth.updateUser({
      data: { onboardingCompleted: true },
    });

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Create child and device with IDs
    const child: Child = {
      id: `child_${Date.now()}`,
      ...childData,
    };

    const device: Device = {
      id: `device_${Date.now()}`,
      ...deviceData,
    };

    localStorage.setItem('voicecare_child', JSON.stringify(child));
    localStorage.setItem('voicecare_devices', JSON.stringify([device]));

    // Update local state
    const updatedUser: User = {
      ...authState.user,
      onboardingCompleted: true,
    };

    setAuthState({
      ...authState,
      user: updatedUser,
      needsOnboarding: false,
    });

    return { success: true };
  };

  const skipOnboarding = () => {
    if (!authState.user) return;

    // Update user metadata to mark onboarding as completed
    supabase.auth.updateUser({
      data: { onboardingCompleted: true },
    });

    const updatedUser: User = {
      ...authState.user,
      onboardingCompleted: true,
    };

    setAuthState({
      ...authState,
      user: updatedUser,
      needsOnboarding: false,
    });
  };

  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  return {
    ...authState,
    login,
    register,
    logout,
    completeOnboarding,
    skipOnboarding,
    getSession,
    resetPassword,
    updatePassword,
  };
}
