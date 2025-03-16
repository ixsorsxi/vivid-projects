
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from '@/components/ui/toast-wrapper';

// Extended user type with profile information
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  settings?: {
    language?: string;
    theme?: string;
    notifications?: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUserSettings: (settings: Partial<User['settings']>) => void;
}

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
        fetchUserProfile(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile data from profiles table
  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      } else if (data) {
        setUser({
          id: supabaseUser.id,
          name: data.full_name || supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email || '',
          role: data.role as 'user' | 'admin',
          avatar: data.avatar_url,
          settings: {
            language: 'en',
            theme: 'light',
            notifications: true,
          }
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Login failed", {
          description: error.message,
        });
        return false;
      }

      // User profile fetching is handled by the auth state change listener
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An error occurred", {
        description: "Please try again later",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        toast.error("Signup failed", {
          description: error.message,
        });
        return false;
      }

      toast("Signup successful", {
        description: "Please check your email to confirm your account",
      });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error("An error occurred", {
        description: "Please try again later",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // User state is updated by the auth state change listener
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Error signing out", {
        description: "Please try again",
      });
    }
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
        signup,
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
