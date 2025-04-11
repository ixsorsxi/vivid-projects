
import { supabase } from '@/integrations/supabase/client';

export const fixRlsPolicy = async (projectId: string): Promise<boolean> => {
  try {
    console.log('Fixing RLS policy for project:', projectId);
    
    // Attempt to call a database function that uses a security definer approach
    // This bypasses RLS policies and prevents recursion
    const { data, error } = await supabase.rpc(
      'direct_project_access',
      { p_project_id: projectId }
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
    // Try with a security definer function call first - most reliable approach
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'check_project_membership',
      { p_project_id: projectId }
    );
    
    if (!rpcError && rpcData === true) {
      console.log('Access confirmed via RPC function');
      return true;
    }
    
    console.log('RPC check failed or returned false, attempting direct checks');
    
    // If the RPC fails, try direct checks
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No authenticated user found');
      return false;
    }
    
    // Check each access path separately to avoid causing recursion
    
    // 1. Check direct project owner access - most reliable
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .maybeSingle();
    
    if (!projectError && projectData?.user_id === user.id) {
      console.log('User is project owner');
      return true;
    }
    
    // 2. Check admin status - also reliable
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    
    if (!profileError && profileData?.role === 'admin') {
      console.log('User is system admin');
      return true;
    }
    
    // 3. Check team membership - potential recursion point, use cautiously
    // Instead of querying project_members directly, use a dedicated RPC function
    try {
      const { data: membershipData, error: membershipError } = await supabase.rpc(
        'is_member_of_project',
        { p_project_id: projectId }
      );
      
      if (!membershipError && membershipData) {
        console.log('User is team member via RPC check');
        return true;
      }
    } catch (error) {
      console.error('Error in is_member_of_project check:', error);
    }
    
    console.log('Access denied: User has no relation to this project');
    return false;
  } catch (error) {
    console.error('Error in checkProjectMemberAccess:', error);
    return false;
  }
};
