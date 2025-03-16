
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  profile: any;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, metadata?: any) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  createUser: (email: string, password: string, name: string, role: 'user' | 'admin') => Promise<boolean>;
  updateUserSettings: (settings: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      // Get session
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        setUser(data.session.user);
        
        // Get user profile
        if (data.session.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          if (profileData) {
            setProfile(profileData);
          }
        }
      }
      
      setIsLoading(false);

      // Set up auth change listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (profileData) {
              setProfile(profileData);
            }
          } else {
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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return !!data.user;
    } catch (error: any) {
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials',
      });
      return false;
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      toast("Account created", {
        description: "Please check your email to confirm your account",
      });
      
      return !!data.user;
    } catch (error: any) {
      toast.error('Registration failed', {
        description: error.message || 'Please try again',
      });
      return false;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast("Signed out", {
        description: "You have been signed out successfully",
      });
    } catch (error: any) {
      toast.error('Sign out failed', {
        description: error.message || 'Please try again',
      });
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (data) {
      setProfile(data);
    }
  };

  // Add aliases for compatibility with both naming conventions
  const login = signIn;
  const logout = signOut;
  
  const createUser = async (email: string, password: string, name: string, role: 'user' | 'admin'): Promise<boolean> => {
    try {
      // This is a placeholder since regular users can't create other users
      // In a real app, this would be handled by an admin function
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: name,
        },
      });

      if (error) {
        toast.error("User creation failed", {
          description: error.message,
        });
        return false;
      }

      toast.success("User created successfully", {
        description: `${name} has been added as a ${role}`,
      });
      return true;
    } catch (error: any) {
      toast.error("An error occurred", {
        description: "Please try again later",
      });
      return false;
    }
  };

  const updateUserSettings = (settings: any) => {
    // Placeholder for user settings update
    console.log("Updating user settings:", settings);
  };

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
