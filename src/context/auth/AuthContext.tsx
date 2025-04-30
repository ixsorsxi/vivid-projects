import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

export type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  isAdmin: boolean;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  createUser: (email: string, password: string, name: string, role: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const setupAuth = async () => {
      setIsLoading(true);
      
      // Get session data if exists
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
      }
      
      if (session) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          setUser(userData.user);
          setIsAuthenticated(true);
          
          // Check if user is admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userData.user.id)
            .single();
          
          setIsAdmin(profile?.role === 'admin');
        }
      }
      
      // Set up auth change listener
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            setUser(session.user);
            setIsAuthenticated(true);
            
            // Check if user is admin
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            setIsAdmin(profile?.role === 'admin');
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
        }
      );
      
      setIsLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    setupAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Error logging in:', error);
        toast.error("Login failed", {
          description: error.message,
        });
        return false;
      }
      
      toast({
        title: "Login successful",
        description: "You are now signed in",
      });
      
      return true;
    } catch (error: any) {
      console.error('Exception during login:', error);
      toast.error("Login failed", {
        description: error.message,
      });
      return false;
    }
  };

  const signup = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: userData.name,
            avatar_url: null,
          },
        },
      });
      
      if (error) {
        console.error('Error signing up:', error);
        toast.error("Signup failed", {
          description: error.message,
        });
        return false;
      }
      
      toast({
        title: "Sign up successful",
        description: "Please check your email for verification",
      });
      
      return true;
    } catch (error: any) {
      console.error('Exception during signup:', error);
      toast.error("Signup failed", {
        description: error.message,
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error logging out:', error);
        toast.error("Logout failed", {
          description: error.message,
        });
        return;
      }
      
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      
      toast({
        title: "Logout successful",
        description: "You have been signed out",
      });
    } catch (error: any) {
      console.error('Exception during logout:', error);
      toast.error("Logout failed", {
        description: error.message,
      });
    }
  };

  const createUser = async (email: string, password: string, name: string, role: string) => {
    if (!isAdmin) {
      toast.error("Permission denied", {
        description: "Only administrators can create users",
      });
      return false;
    }
    
    try {
      // For demo purposes, we'll use the sign up method
      // In a real application with admin-created users, you'd use admin APIs
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role
          }
        }
      });
      
      if (error) {
        console.error('Error creating user:', error);
        toast.error("Failed to create user", {
          description: error.message,
        });
        return false;
      }
      
      toast({
        title: "User created",
        description: `${name} has been added as a ${role}`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Exception during user creation:', error);
      toast.error("Failed to create user", {
        description: error.message,
      });
      return false;
    }
  };

  const hasPermission = (permission: string) => {
    // Basic implementation - in a real app, you would check the user's permissions
    if (isAdmin) return true;
    
    // For demo purposes, assume regular users have basic permissions
    const basicPermissions = ['view:tasks', 'create:task', 'edit:own-task'];
    return basicPermissions.includes(permission);
  };

  const authValue: AuthContextType = {
    isAuthenticated,
    user,
    isAdmin,
    isLoading,
    hasPermission,
    login,
    signup,
    logout,
    createUser
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};
