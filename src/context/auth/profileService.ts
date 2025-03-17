
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';
import { toast } from '@/components/ui/toast-wrapper';

export const fetchUserProfile = async (userId: string): Promise<any> => {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
};

export const updateUserSettings = async (userId: string, settings: any): Promise<boolean> => {
  if (!userId) {
    console.error('No user ID provided for settings update');
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update(settings)
      .eq('id', userId);
      
    if (error) {
      console.error('Error updating user settings:', error);
      toast.error('Failed to save settings');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error updating settings:', error);
    return false;
  }
};

export const updateUserProfile = async (userId: string, profileData: Partial<User>): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Convert profile data to format expected by the profiles table
    const profileUpdate = {
      full_name: profileData.name,
      avatar_url: profileData.avatar,
      role: profileData.role,
      // Add other fields as needed
    };
    
    const { error } = await supabase
      .from('profiles')
      .update(profileUpdate)
      .eq('id', userId);
      
    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update profile:', error);
    return false;
  }
};
