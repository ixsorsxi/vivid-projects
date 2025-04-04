
import { supabase } from '@/integrations/supabase/client';

// Function to check if the user has access to project members
export const checkProjectMemberAccess = async (projectId: string): Promise<boolean> => {
  try {
    // First try to use the RPC function to check access
    const { data: rpcData, error: rpcError } = await supabase.rpc('check_project_member_access', { p_project_id: projectId });
    
    if (rpcError) {
      console.error('Error checking project member access via RPC:', rpcError);
      
      // Fallback: Try direct query if the RPC function fails
      // Check if user is project owner
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .single();
      
      if (projectError) {
        console.error('Error checking project owner:', projectError);
        return false;
      }
      
      // Get current user ID
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting current user:', userError);
        return false;
      }
      
      // Check if current user is project owner
      if (userData?.user && projectData?.user_id === userData.user.id) {
        return true;
      }
      
      // Check if user is a project manager
      const { data: memberData, error: memberError } = await supabase
        .from('project_members')
        .select('role')
        .eq('project_id', projectId)
        .eq('user_id', userData?.user?.id)
        .single();
      
      if (memberError) {
        console.error('Error checking project membership:', memberError);
        return false;
      }
      
      // User is a project manager
      if (memberData?.role === 'Project Manager') {
        return true;
      }
      
      // Check if user is an admin
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userData?.user?.id)
        .single();
      
      if (profileError) {
        console.error('Error checking user role:', profileError);
        return false;
      }
      
      // User is an admin
      if (profileData?.role === 'admin') {
        return true;
      }
      
      return false;
    }
    
    return !!rpcData;
  } catch (error) {
    console.error('Exception in checkProjectMemberAccess:', error);
    return false;
  }
};
