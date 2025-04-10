
import { supabase } from '@/integrations/supabase/client';

export const fixRlsPolicy = async (projectId: string): Promise<boolean> => {
  try {
    console.log('Fixing RLS policy for project:', projectId);
    
    // Attempt to call a database function that bypasses RLS
    const { data, error } = await supabase.rpc(
      'bypass_rls_for_development'
    );
    
    if (error) {
      console.error('Error fixing RLS policy:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error fixing RLS policy:', error);
    return false;
  }
};

export const checkProjectMemberAccess = async (projectId: string): Promise<boolean> => {
  try {
    // Try with a security definer function call first
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'check_project_membership',
      { p_project_id: projectId }
    );
    
    if (!rpcError && rpcData === true) {
      return true;
    }
    
    // If the RPC fails, try the direct check
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    // Check direct project owner access
    const { data: projectData } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .maybeSingle();
    
    if (projectData?.user_id === user.id) {
      return true;
    }
    
    // Check admin status
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    
    if (profileData?.role === 'admin') {
      return true;
    }
    
    // Check team membership
    const { data: memberData } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .is('left_at', null)
      .maybeSingle();
    
    return !!memberData;
  } catch (error) {
    console.error('Error in checkProjectMemberAccess:', error);
    return false;
  }
};
