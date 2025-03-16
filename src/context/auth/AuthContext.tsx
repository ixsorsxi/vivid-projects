
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, User } from './types';
import { signInUser, signUpUser, signOutUser, createNewUser } from './authService';
import { fetchUserProfile, updateUserSettings as updateSettings } from './profileService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      // Get session
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        // Get user profile
        if (data.session.user) {
          const profileData = await fetchUserProfile(data.session.user.id);
          if (profileData) {
            setProfile(profileData);
            
            // Set user with extended properties from profile
            setUser({
              ...data.session.user,
              name: profileData.full_name || profileData.username || data.session.user.email?.split('@')[0] || 'User',
              avatar: profileData.avatar_url,
              role: profileData.role
            });
          } else {
            // If no profile, set basic user info
            setUser(data.session.user);
          }
        }
      }
      
      setIsLoading(false);

      // Set up auth change listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            const profileData = await fetchUserProfile(session.user.id);
            if (profileData) {
              setProfile(profileData);
              
              // Set user with extended properties from profile
              setUser({
                ...session.user,
                name: profileData.full_name || profileData.username || session.user.email?.split('@')[0] || 'User',
                avatar: profileData.avatar_url,
                role: profileData.role
              });
            } else {
              // If no profile, set basic user info
              setUser(session.user);
            }
          } else {
            setUser(null);
            setProfile(null);
          }
          
          setIsLoading(false);
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    initialize();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { success } = await signInUser(email, password);
    return success;
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { success } = await signUpUser(email, password, metadata);
    return success;
  };

  const signOut = async () => {
    await signOutUser();
  };

  const refreshUser = async () => {
    if (!user) return;
    
    const profileData = await fetchUserProfile(user.id);
    if (profileData) {
      setProfile(profileData);
    }
  };

  const createUser = async (email: string, password: string, name: string, role: 'user' | 'admin'): Promise<boolean> => {
    return await createNewUser(email, password, name, role);
  };

  const updateUserSettings = (settings: any) => {
    if (user) {
      updateSettings(user.id, settings);
    }
  };

  // Add aliases for compatibility with both naming conventions
  const login = signIn;
  const logout = signOut;

  const value = {
    isAuthenticated: !!user,
    user,
    profile,
    isAdmin: profile?.role === 'admin',
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshUser,
    login,
    logout,
    createUser,
    updateUserSettings
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
