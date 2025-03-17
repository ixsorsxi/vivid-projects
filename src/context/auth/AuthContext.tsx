
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, User, CustomRole } from './types';
import { signInUser, signUpUser, signOutUser, createNewUser } from './authService';
import { fetchUserProfile, updateUserSettings as updateSettings } from './profileService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [customRole, setCustomRole] = useState<CustomRole | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserCustomRole = async (profileData: any) => {
    if (!profileData?.custom_role_id) return null;
    
    try {
      // Fetch the custom role
      const { data: roleData, error: roleError } = await supabase
        .from('custom_roles')
        .select('*')
        .eq('id', profileData.custom_role_id)
        .single();
      
      if (roleError || !roleData) {
        console.error("Error fetching custom role:", roleError);
        return null;
      }
      
      // Fetch the role permissions
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('role_permissions')
        .select('permission')
        .eq('role_id', roleData.id)
        .eq('enabled', true);
      
      if (permissionsError) {
        console.error("Error fetching role permissions:", permissionsError);
      }
      
      const customRole: CustomRole = {
        id: roleData.id,
        name: roleData.name,
        base_type: roleData.base_type,
        permissions: permissionsData?.map(p => p.permission) || []
      };
      
      setCustomRole(customRole);
      setRolePermissions(customRole.permissions || []);
      
      return customRole;
    } catch (error) {
      console.error("Error in fetchUserCustomRole:", error);
      return null;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      try {
        // Get session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setIsLoading(false);
          return;
        }
        
        if (data.session) {
          // Get user profile
          if (data.session.user) {
            try {
              const profileData = await fetchUserProfile(data.session.user.id);
              if (profileData) {
                setProfile(profileData);
                
                // Fetch custom role information
                const userCustomRole = await fetchUserCustomRole(profileData);
                
                // Set user with extended properties from profile
                setUser({
                  ...data.session.user,
                  name: profileData.full_name || profileData.username || data.session.user.email?.split('@')[0] || 'User',
                  avatar: profileData.avatar_url,
                  role: profileData.role as 'user' | 'admin' | 'manager',
                  customRole: userCustomRole || undefined
                });
              } else {
                // If no profile, set basic user info
                setUser({
                  ...data.session.user,
                  name: data.session.user.email?.split('@')[0] || 'User',
                  role: 'user' // Default role if no profile exists
                });
              }
            } catch (profileError) {
              console.error("Profile error:", profileError);
              // Still set the user with basic info if profile fetch fails
              setUser({
                ...data.session.user,
                role: 'user' // Default role if profile fetch fails
              });
            }
          }
        }
      } catch (e) {
        console.error("Auth initialization error:", e);
      } finally {
        setIsLoading(false);
      }

      // Set up auth change listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Auth state change:", event, session?.user?.id);
          
          if (session?.user) {
            try {
              const profileData = await fetchUserProfile(session.user.id);
              if (profileData) {
                setProfile(profileData);
                
                // Fetch custom role information
                const userCustomRole = await fetchUserCustomRole(profileData);
                
                // Set user with extended properties from profile
                setUser({
                  ...session.user,
                  name: profileData.full_name || profileData.username || session.user.email?.split('@')[0] || 'User',
                  avatar: profileData.avatar_url,
                  role: profileData.role as 'user' | 'admin' | 'manager',
                  customRole: userCustomRole || undefined
                });
              } else {
                // If no profile, set basic user info
                setUser({
                  ...session.user,
                  name: session.user.email?.split('@')[0] || 'User',
                  role: 'user' // Default role if no profile exists
                });
              }
            } catch (profileError) {
              console.error("Profile error on auth change:", profileError);
              // Still set the user with basic info if profile fetch fails
              setUser({
                ...session.user,
                name: session.user.email?.split('@')[0] || 'User',
                role: 'user' // Default role if profile fetch fails
              });
            }
          } else {
            setUser(null);
            setProfile(null);
            setCustomRole(null);
            setRolePermissions([]);
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
    // Clear any local state
    setUser(null);
    setProfile(null);
    setCustomRole(null);
    setRolePermissions([]);
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
