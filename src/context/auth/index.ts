
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User, AuthContextType } from './types';

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  profile: null,
  isAdmin: false,
  isManager: false,
  hasPermission: () => false,
  isLoading: true,
  signIn: async () => false,
  signUp: async () => false,
  signOut: async () => {},
  refreshUser: async () => {},
  login: async () => false,
  logout: async () => {},
  createUser: async () => false,
  updateUserSettings: () => {}
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user as User || null);
      setIsLoading(false);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
    });
    
    // Initialize session on first load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user as User || null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setIsLoading(false);
    });
    
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);
  
  // Fetch user profile data from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      setProfile(data);
      
      if (user) {
        setUser({
          ...user,
          name: data?.full_name,
          avatar: data?.avatar_url,
          role: determineUserRole(data)
        });
      }
    } catch (error) {
      console.error('Exception in fetchUserProfile:', error);
    }
  };
  
  // Determine user role based on profile data
  const determineUserRole = (profile: any): 'user' | 'admin' | 'manager' => {
    // This is a placeholder - in a real app, you'd get the role from your database
    if (profile?.is_admin) return 'admin';
    if (profile?.is_manager) return 'manager';
    return 'user';
  };
  
  // Check if user has admin role
  const isAdmin = !!user?.role && user.role === 'admin';
  
  // Check if user has manager role
  const isManager = !!user?.role && (user.role === 'manager' || user.role === 'admin');
  
  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    // This is a placeholder - in a real app, you'd check against stored permissions
    if (isAdmin) return true; // Admins have all permissions
    
    // Check user's custom role permissions
    const userPermissions = user?.customRole?.permissions || [];
    return userPermissions.includes(permission);
  };
  
  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return !!data.session;
    } catch (error) {
      console.error('Error signing in:', error);
      return false;
    }
  };
  
  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata?: any): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      
      return !!data.user;
    } catch (error) {
      console.error('Error signing up:', error);
      return false;
    }
  };
  
  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };
  
  // Create a new user (admin function)
  const createUser = async (
    email: string,
    password: string,
    name: string,
    role: 'user' | 'admin' | 'manager'
  ): Promise<boolean> => {
    try {
      // Only admins can create users
      if (!isAdmin) {
        console.error('Only admins can create users');
        return false;
      }
      
      // Create the user in Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create profile for the user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: name,
            role: role
          });
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }
      
      return !!data.user;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  };
  
  // Update user settings
  const updateUserSettings = async (settings: any) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(settings)
        .eq('id', user.id);
      
      if (error) throw error;
      
      await refreshUser();
    } catch (error) {
      console.error('Error updating user settings:', error);
    }
  };
  
  // Auth context value
  const value = {
    isAuthenticated: !!session,
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
    login: signIn, // Alias for signIn
    logout: signOut, // Alias for signOut
    createUser,
    updateUserSettings
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => useContext(AuthContext);
