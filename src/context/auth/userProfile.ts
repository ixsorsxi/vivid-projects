
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from '@/components/ui/toast-wrapper';

export const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    } 
    
    if (data) {
      // Create a merged user object with both Supabase user and profile data
      const userWithProfile: User = {
        ...supabaseUser, // Include all Supabase user properties
        name: data.full_name || supabaseUser.email?.split('@')[0] || 'User',
        role: data.role as 'user' | 'admin',
        avatar: data.avatar_url,
      };
      
      return userWithProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
