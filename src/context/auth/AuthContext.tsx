
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User, AuthContextType } from './types';
import { fetchUserProfile } from './userProfile';
import { loginUser, logoutUser, createNewUser } from './authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Initialize user on mount or when auth state changes
  useEffect(() => {
    setIsLoading(true);

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user).then(userProfile => {
          setUser(userProfile);
          setIsLoading(false);
        });
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user).then(userProfile => {
          setUser(userProfile);
          setIsLoading(false);
        });
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const success = await loginUser(email, password);
    setIsLoading(false);
    return success;
  };

  const createUser = async (email: string, password: string, name: string, role: 'user' | 'admin'): Promise<boolean> => {
    if (!user || user.role !== 'admin') {
      return false;
    }

    setIsLoading(true);
    const success = await createNewUser(email, password, name, role);
    setIsLoading(false);
    return success;
  };

  const logout = async () => {
    await logoutUser();
    // User state is updated by the auth state change listener
  };

  const updateUserSettings = async (settings: Partial<User['settings']>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      settings: {
        ...user.settings,
        ...settings
      }
    };
    
    setUser(updatedUser);
    // In a real implementation, we would update these settings in the database
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login, 
        createUser,
        logout,
        updateUserSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
