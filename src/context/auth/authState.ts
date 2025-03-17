
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { fetchUserProfile } from './profileService';
import { User } from './types';

export const getInitialSession = async (): Promise<{
  session: Session | null;
  error: Error | null;
}> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Session error:", error);
      return { session: null, error };
    }
    
    return { session: data.session, error: null };
  } catch (e) {
    console.error("Auth initialization error:", e);
    return { session: null, error: e as Error };
  }
};

export const setupAuthListener = (callback: (session: Session | null) => void) => {
  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log("Auth state change:", event, session?.user?.id);
      callback(session);
    }
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
};

export const createUserWithProfile = async (
  session: Session, 
  fetchCustomRole: (profileData: any) => Promise<any>
): Promise<User | null> => {
  if (!session?.user) return null;
  
  try {
    const profileData = await fetchUserProfile(session.user.id);
    
    if (profileData) {
      // Fetch custom role information
      const userCustomRole = await fetchCustomRole(profileData);
      
      // Return user with extended properties from profile
      return {
        ...session.user,
        name: profileData.full_name || profileData.username || session.user.email?.split('@')[0] || 'User',
        avatar: profileData.avatar_url,
        role: profileData.role as 'user' | 'admin' | 'manager',
        customRole: userCustomRole || undefined
      };
    } else {
      // If no profile, return basic user info
      return {
        ...session.user,
        name: session.user.email?.split('@')[0] || 'User',
        role: 'user' // Default role if no profile exists
      };
    }
  } catch (profileError) {
    console.error("Profile error:", profileError);
    // Still return the user with basic info if profile fetch fails
    return {
      ...session.user,
      name: session.user.email?.split('@')[0] || 'User',
      role: 'user' // Default role if profile fetch fails
    };
  }
};
