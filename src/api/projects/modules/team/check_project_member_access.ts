
import { supabase } from '@/integrations/supabase/client';

export const checkProjectMemberAccess = async (projectId: string): Promise<boolean> => {
  try {
    // Try to check if the current user has access to the project
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    if (!userId) {
      return false;
    }
    
    // Check if the user is the project owner
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();
    
    if (!projectError && projectData && projectData.user_id === userId) {
      return true;
    }
    
    // Check if the user is an admin
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (!profileError && profileData && profileData.role === 'admin') {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking project member access:', error);
    return false;
  }
};
