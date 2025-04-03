
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { supabase } from '@/integrations/supabase/client';
import { SystemUser } from '../types';

export const useTeamMemberAddition = (projectId?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTeamMember = async (member: { 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }): Promise<boolean> => {
    if (!projectId) {
      console.error('No project ID provided for adding team member');
      toast.error('Operation failed', {
        description: 'Missing project ID'
      });
      return false;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Adding team member to project:', projectId, member);
      
      // Get current user for context
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;
      
      if (!currentUser) {
        const errorMsg = 'User authentication required';
        setError(errorMsg);
        toast.error('Authentication Error', {
          description: errorMsg
        });
        return false;
      }
      
      // Try a simpler approach first - direct insert without any extra fields
      const memberData = {
        project_id: projectId,
        project_member_name: member.name,
        role: member.role,
        user_id: member.user_id || currentUser.id
      };
      
      console.log('Inserting team member with data:', memberData);
      
      const { error: insertError } = await supabase
        .from('project_members')
        .insert(memberData);
      
      if (insertError) {
        console.error('Direct insert error:', insertError);
        
        // Try the security definer function approach
        try {
          console.log('Trying security definer function approach');
          const { error: rpcError } = await supabase.rpc('add_project_members', {
            p_project_id: projectId,
            p_user_id: currentUser.id,
            p_team_members: JSON.stringify([{
              name: member.name,
              role: member.role,
              user_id: member.user_id || null
            }])
          });
          
          if (rpcError) {
            console.error('RPC function error:', rpcError);
            
            // Try a third approach - API module
            try {
              const teamApi = await import('@/api/projects/modules/team');
              
              console.log('Trying API module approach');
              const success = await teamApi.addProjectTeamMember(projectId, {
                name: member.name,
                role: member.role,
                email: member.email,
                user_id: member.user_id
              });
              
              if (!success) {
                const errorMsg = 'All approaches failed to add team member';
                setError(errorMsg);
                toast.error('Operation failed', {
                  description: 'Could not add team member to the project after multiple attempts.'
                });
                return false;
              }
              
              toast.success('Team member added', {
                description: `${member.name} has been added to the project`
              });
              return true;
            } catch (apiError) {
              console.error('API module error:', apiError);
              const errorMsg = 'All approaches failed';
              setError(errorMsg);
              toast.error('Operation failed', {
                description: 'Could not add team member to the project. Please contact support.'
              });
              return false;
            }
          }
          
          // RPC function succeeded
          toast.success('Team member added', {
            description: `${member.name} has been added to the project`
          });
          return true;
        } catch (rpcError) {
          console.error('RPC approach error:', rpcError);
          const errorMsg = 'Database operation failed';
          setError(errorMsg);
          toast.error('Operation failed', {
            description: 'Could not add team member to the project. Please try again later.'
          });
          return false;
        }
      }
      
      // Direct insert succeeded
      toast.success('Team member added', {
        description: `${member.name} has been added to the project`
      });
      return true;
    } catch (err: any) {
      const errorMsg = err.message || 'Unknown error occurred';
      setError(errorMsg);
      console.error('Unexpected error in addTeamMember:', err);
      toast.error('Operation failed', {
        description: 'An unexpected error occurred while adding the team member'
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExistingUser = async (user: SystemUser): Promise<boolean> => {
    return addTeamMember({
      name: user.name,
      role: user.role || 'Team Member',
      email: user.email,
      user_id: String(user.id)
    });
  };

  const addExternalMember = async (email: string, role: string): Promise<boolean> => {
    if (!email || !role) {
      toast.error('Invalid input', {
        description: 'Both email and role are required'
      });
      return false;
    }
    
    return addTeamMember({
      name: email.split('@')[0], // Use first part of email as name
      role: role,
      email: email
    });
  };

  return {
    isSubmitting,
    error,
    addExistingUser,
    addExternalMember,
    addTeamMember
  };
};
