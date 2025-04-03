
import { supabase } from '@/integrations/supabase/client';

/**
 * Attempts to fix RLS policy issues for project members - for admin/developer use
 */
export const checkProjectMemberAccess = async (projectId: string): Promise<boolean> => {
  try {
    console.log('Checking project member access for project:', projectId);
    
    // Try to directly query the project_members table
    const { data, error } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .limit(1);
    
    if (error) {
      console.error('Error accessing project_members:', error);
      
      if (error.message.includes('recursion') || error.code === '42P01') {
        console.warn('Detected potential RLS recursion issue, trying RPC function instead');
        
        // Try using the check_project_member_access RPC function as a workaround
        try {
          const { data: rpcResult, error: rpcError } = await supabase.rpc(
            'check_project_member_access',
            { p_project_id: projectId }
          );
          
          if (rpcError) {
            console.error('RPC fallback also failed:', rpcError);
            return false;
          }
          
          return rpcResult === true;
        } catch (rpcErr) {
          console.error('Exception in RPC call:', rpcErr);
          return false;
        }
      }
      
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in checkProjectMemberAccess:', error);
    return false;
  }
};

export default checkProjectMemberAccess;
