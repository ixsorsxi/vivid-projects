
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

export const useTeamOperations = (projectId: string, fetchTeamMembers: () => Promise<void>) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRemoveMember = async (memberId: string) => {
    try {
      setIsProcessing(true);
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Team member removed');
      await fetchTeamMembers();
    } catch (error) {
      console.error('Error removing team member:', error);
      toast.error('Failed to remove team member', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMakeManager = async (memberId: string) => {
    try {
      setIsProcessing(true);
      
      // Find member in the DB to promote
      const { data: memberData, error: memberError } = await supabase
        .from('project_members')
        .select('user_id, project_member_name')
        .eq('id', memberId)
        .single();

      if (memberError || !memberData) {
        throw memberError || new Error('Member not found');
      }

      // Get the project_manager role ID
      const { data: roleData, error: roleError } = await supabase
        .from('project_roles')
        .select('id')
        .eq('role_key', 'project_manager')
        .single();
      
      if (roleError || !roleData) {
        throw roleError || new Error('Project manager role not found');
      }

      // Assign the project_manager role to the user
      const { error: assignError } = await supabase
        .from('user_project_roles')
        .upsert({
          user_id: memberData.user_id,
          project_id: projectId,
          project_role_id: roleData.id
        }, {
          onConflict: 'user_id, project_id',
          ignoreDuplicates: false
        });

      if (assignError) throw assignError;

      // Update project manager in projects table
      const { error: projectError } = await supabase
        .from('projects')
        .update({ 
          project_manager_id: memberData.user_id,
          project_manager_name: memberData.project_member_name
        })
        .eq('id', projectId);

      if (projectError) throw projectError;

      toast.success(`Member is now the project manager`);
      await fetchTeamMembers();
    } catch (error) {
      console.error('Error updating project manager:', error);
      toast.error('Failed to update project manager', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleRemoveMember,
    handleMakeManager
  };
};

export default useTeamOperations;
