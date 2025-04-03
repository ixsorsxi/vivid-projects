
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
      
      // First approach: Direct insert into project_members table
      const { error: insertError } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          project_member_name: member.name,
          role: member.role,
          user_id: member.user_id || currentUser.id // Use provided user_id or fall back to current user
        });
      
      if (insertError) {
        console.error('Error adding team member (direct insert):', insertError);
        
        // Second approach: Try using the add_project_members RPC function
        console.log('Attempting to add member via RPC function');
        
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
          const errorMsg = `Failed to add team member: ${rpcError.message}`;
          setError(errorMsg);
          console.error('Error adding team member (RPC fallback):', rpcError);
          toast.error('Operation failed', {
            description: 'Could not add team member to the project. Database error.'
          });
          return false;
        }
      }
      
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
