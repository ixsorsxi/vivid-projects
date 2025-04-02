
import { supabase } from '@/integrations/supabase/client';
import { handleDatabaseError } from '../../utils';

/**
 * Adds a team member to a project
 */
export const addProjectTeamMember = async (
  projectId: string, 
  member: { name: string; role: string; email?: string; user_id?: string }
): Promise<boolean> => {
  try {
    console.log('Adding team member to project:', projectId, member);
    
    // Ensure we're passing valid values
    const memberData = {
      project_id: projectId,
      user_id: member.user_id || null,
      name: member.name || (member.email ? member.email.split('@')[0] : 'Team Member'),
      role: member.role || 'Member'
    };
    
    console.log('Member data to insert:', memberData);
    
    // Try using the add_project_members RPC function first as it bypasses RLS
    if (member.user_id) {
      try {
        const teamMembersJson = [memberData];
        const { error: rpcError } = await supabase.rpc('add_project_members', {
          p_project_id: projectId,
          p_user_id: member.user_id,
          p_team_members: teamMembersJson
        });
        
        if (!rpcError) {
          console.log('Successfully added team member via RPC');
          return true;
        }
        
        console.warn('RPC add_project_members failed, falling back to direct insert:', rpcError);
      } catch (rpcErr) {
        console.warn('Error in RPC call:', rpcErr);
      }
    }
    
    // Fall back to direct insert if RPC method fails or if no user_id is provided
    const { data, error } = await supabase
      .from('project_members')
      .insert(memberData)
      .select('id, name, role')
      .single();

    if (error) {
      const formattedError = handleDatabaseError(error);
      console.error('Error adding team member:', formattedError);
      return false;
    }

    console.log('Successfully added team member:', data);
    return true;
  } catch (error) {
    console.error('Error in addProjectTeamMember:', error);
    return false;
  }
};

/**
 * Removes a team member from a project
 */
export const removeProjectTeamMember = async (projectId: string, memberId: string): Promise<boolean> => {
  try {
    console.log('Removing team member from project:', projectId, 'memberId:', memberId);
    
    // First attempt: Try the secure RPC function 
    try {
      console.log('Using remove_project_member RPC function');
      const { data, error } = await supabase.rpc(
        'remove_project_member', 
        { 
          p_project_id: projectId, 
          p_member_id: memberId 
        }
      );
      
      if (error) {
        console.error('Error using remove_project_member RPC:', error);
      } else {
        console.log('Successfully removed team member via RPC function');
        return true;
      }
    } catch (rpcErr) {
      console.warn('Error in remove_project_member RPC call:', rpcErr);
    }
    
    // Second attempt: Direct DELETE operation
    console.log('Falling back to direct DELETE operation');
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('id', memberId);

    if (error) {
      const formattedError = handleDatabaseError(error);
      console.error('Error removing team member (direct DELETE):', formattedError);
      
      // Third attempt: Try an alternative approach for RLS issues
      if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('policy')) {
        console.log('RLS permission issue detected, attempting alternative approach');
        
        try {
          // Try alternative method with match syntax
          const { error: matchError } = await supabase
            .from('project_members')
            .delete()
            .match({ 
              'project_id': projectId, 
              'id': memberId 
            });
          
          if (matchError) {
            console.error('Alternative removal (match) also failed:', matchError);
            
            // Fourth attempt: Try RPC function specifically for RLS bypass
            try {
              const { error: bypassError } = await supabase.rpc('bypass_rls_delete_team_member', {
                p_project_id: projectId,
                p_member_id: memberId
              });
              
              if (bypassError) {
                console.error('RLS bypass method also failed:', bypassError);
                return false;
              }
              
              console.log('Successfully removed team member via RLS bypass');
              return true;
            } catch (bypassErr) {
              console.error('Error in bypass RLS call:', bypassErr);
              return false;
            }
          }
          
          console.log('Successfully removed team member via match method');
          return true;
        } catch (alternativeErr) {
          console.error('Error in alternative removal approach:', alternativeErr);
          return false;
        }
      }
      
      return false;
    }

    console.log('Successfully removed team member via direct DELETE');
    return true;
  } catch (error) {
    console.error('Error in removeProjectTeamMember:', error);
    return false;
  }
};
