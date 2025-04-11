
import { supabase } from '@/integrations/supabase/client';

/**
 * Fixes RLS policy recursion issues by using a security definer approach
 * This bypasses RLS policies and prevents recursion
 */
export const fixRlsPolicy = async (projectId: string): Promise<boolean> => {
  try {
    console.log('Fixing RLS policy for project:', projectId);
    
    // Try multiple approaches to bypass RLS recursion
    // 1. First try: Use a dedicated RPC function with SECURITY DEFINER 
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'direct_project_access',
      { p_project_id: projectId }
    );
    
    if (!rpcError && rpcData) {
      console.log('Successfully fixed RLS policy via RPC function');
      return true;
    }
    
    if (rpcError) {
      console.error('Error with RPC approach:', rpcError);
    }
    
    // 2. Second try: Check direct project ownership
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }
    
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .maybeSingle();
    
    if (!projectError && projectData?.user_id === user.id) {
      console.log('User is project owner, RLS bypass not needed');
      return true;
    }
    
    // 3. Third try: Check if user is admin
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    
    if (!profileError && profileData?.role === 'admin') {
      console.log('User is system admin, RLS bypass not needed');
      return true;
    }
    
    console.log('Could not fix RLS policy, user lacks necessary permissions');
    return false;
  } catch (error) {
    console.error('Error fixing RLS policy:', error);
    return false;
  }
};

/**
 * Checks if the user has access to the project through multiple reliable methods
 * This avoids RLS recursion by using multiple non-recursive checks
 */
export const checkProjectMemberAccess = async (projectId: string): Promise<boolean> => {
  try {
    // Get current user first
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No authenticated user found');
      return false;
    }
    
    console.log('Checking project access for user:', user.id, 'and project:', projectId);
    
    // 1. Check if user is project owner - most reliable and no RLS issues
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .maybeSingle();
    
    if (projectError) {
      console.error('Error checking project ownership:', projectError);
    } else if (projectData && projectData.user_id === user.id) {
      console.log('Access granted: User is project owner');
      return true;
    }
    
    // 2. Check if user is system admin - also reliable and no RLS issues
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error('Error checking user role:', profileError);
    } else if (profileData && profileData.role === 'admin') {
      console.log('Access granted: User is system admin');
      return true;
    }
    
    // 3. Check if user is a team member via RPC function - avoids recursion
    const { data: memberAccessData, error: memberAccessError } = await supabase.rpc(
      'check_project_membership',
      { p_project_id: projectId }
    );
    
    if (memberAccessError) {
      console.error('Error checking project membership via RPC:', memberAccessError);
    } else if (memberAccessData === true) {
      console.log('Access granted: User is a team member (via RPC)');
      return true;
    }
    
    // 4. Direct query as a last resort - potential recursion point, but isolated
    try {
      const { data: membershipData, error: membershipError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .is('left_at', null)
        .maybeSingle();
      
      if (membershipError) {
        console.error('Error with direct membership check:', membershipError);
      } else if (membershipData) {
        console.log('Access granted: User is a team member (via direct query)');
        return true;
      }
    } catch (error) {
      console.error('Exception in project membership check:', error);
    }
    
    console.log('Access denied: User has no relation to this project');
    return false;
  } catch (error) {
    console.error('Error in checkProjectMemberAccess:', error);
    return false;
  }
};
