
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, User } from './types';
import { signInUser, signUpUser, signOutUser, createNewUser } from './authService';
import { fetchUserProfile, updateUserSettings as updateSettings } from './profileService';
import { useCustomRole } from './useCustomRole';
import { getInitialSession, setupAuthListener, createUserWithProfile } from './authState';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { customRole, rolePermissions, fetchUserCustomRole } = useCustomRole();

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      const { session } = await getInitialSession();
      
      if (session?.user) {
        try {
          const profileData = await fetchUserProfile(session.user.id);
          
          if (profileData) {
            setProfile(profileData);
            
            // Create user with extended profile data
            const userWithProfile = await createUserWithProfile(session, fetchUserCustomRole);
            if (userWithProfile) {
              setUser(userWithProfile);
            }
          } else {
            // If no profile, set basic user info
            setUser({
              ...session.user,
              name: session.user.email?.split('@')[0] || 'User',
              role: 'user' // Default role if no profile exists
            });
          }
        } catch (error) {
          console.error("Error during initialization:", error);
          setUser({
            ...session.user,
            role: 'user' // Default role on error
          });
        }
      }
      
      setIsLoading(false);
    };

    initialize();

    // Set up auth state change listener
    const cleanupListener = setupAuthListener(async (session) => {
      if (session?.user) {
        try {
          const profileData = await fetchUserProfile(session.user.id);
          if (profileData) {
            setProfile(profileData);
            
            // Create user with profile data
            const userWithProfile = await createUserWithProfile(session, fetchUserCustomRole);
            if (userWithProfile) {
              setUser(userWithProfile);
            }
          } else {
            // Basic user info if no profile
            setUser({
              ...session.user,
              name: session.user.email?.split('@')[0] || 'User',
              role: 'user'
            });
          }
        } catch (error) {
          console.error("Error on auth state change:", error);
          setUser({
            ...session.user,
            name: session.user.email?.split('@')[0] || 'User',
            role: 'user'
          });
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    return cleanupListener;
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
    // Clear any local state
    setUser(null);
    setProfile(null);
  };

  const refreshUser = async () => {
    if (!user) return;
    
    const profileData = await fetchUserProfile(user.id);
    if (profileData) {
      setProfile(profileData);
      
      // Refresh custom role information
      const userCustomRole = await fetchUserCustomRole(profileData);
      
      // Update user with refreshed profile data
      setUser({
        ...user,
        name: profileData.full_name || profileData.username || user.email?.split('@')[0] || 'User',
        avatar: profileData.avatar_url,
        role: profileData.role as 'user' | 'admin' | 'manager',
        customRole: userCustomRole || undefined
      });
    }
  };

  const createUser = async (email: string, password: string, name: string, role: 'user' | 'admin' | 'manager'): Promise<boolean> => {
    return await createNewUser(email, password, name, role);
  };

  const updateUserSettings = (settings: any) => {
    if (user) {
      updateSettings(user.id, settings);
    }
  };

  const hasPermission = (permission: string): boolean => {
    // Admins have all permissions
    if (profile?.role === 'admin' || customRole?.base_type === 'admin') {
      return true;
    }
    
    // Check if the user has the specific permission
    return rolePermissions.includes(permission);
  };

  // Add aliases for compatibility with both naming conventions
  const login = signIn;
  const logout = signOut;

  // Check if user is admin based on their role or custom role base_type
  const isAdmin = profile?.role === 'admin' || customRole?.base_type === 'admin';
  
  // Check if user is manager based on their role or custom role base_type
  const isManager = profile?.role === 'manager' || customRole?.base_type === 'manager';

  const value = {
    isAuthenticated: !!user,
    user,
    profile,
    isAdmin,
    isManager,
    hasPermission,
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
