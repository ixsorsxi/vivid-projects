import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { supabase } from '@/integrations/supabase/client';

export const useProjectTeam = (projectData: any, setProjectData: any) => {
  // Format role string to ensure consistent formatting
  const formatRoleString = (role: string): string => {
    // First, ensure we have a valid string
    if (!role) return 'team-member';
    
    // If the role already looks like a database format (kebab-case), keep it
    if (role.includes('-')) return role;
    
    // Otherwise, convert to kebab-case for consistent storage
    return role.trim()
              .toLowerCase()
              .replace(/\s+/g, '-')    // Replace spaces with hyphens
              .replace(/[^a-z0-9-]/g, ''); // Remove any other special characters
  };

  // Handler to add a new team member
  const handleAddMember = useCallback((member: { id?: string; name: string; role: string; email?: string; user_id?: string }) => {
    // Ensure member has required properties
    if (!member || !member.name) {
      console.error('Invalid member data provided to handleAddMember:', member);
      return;
    }
    
    // Create new member with correct data format
    const newMemberId = member.id || String(Date.now()); // Ensure ID is string
    const formattedRole = formatRoleString(member.role || "Team Member");
    
    const newMember = {
      id: newMemberId,
      name: member.name, // Prioritize using the name field
      role: formattedRole,
      user_id: member.user_id
    };
    
    console.log('Adding new team member:', newMember);
    
    setProjectData((prev: any) => ({
      ...prev,
      team: [...(prev.team || []), newMember],
      // Also update the members array to ensure compatibility with components
      members: [...(prev.members || []), { id: newMemberId, name: newMember.name }]
    }));

    toast(`Team member added`, {
      description: `${member.name} has been added to the project`,
    });
  }, [setProjectData]);

  // Handler to remove a team member
  const handleRemoveMember = useCallback((memberId: number | string) => {
    const stringMemberId = String(memberId); // Convert to string to ensure consistent comparison
    
    console.log('Removing team member with ID:', stringMemberId);
    
    setProjectData((prev: any) => {
      // Find the member being removed for better user feedback
      const memberToRemove = (prev.team || []).find((m: any) => String(m.id) === stringMemberId);
      const memberName = memberToRemove?.name || 'Team member';
      
      // Remove from both team and members arrays
      const updatedData = {
        ...prev,
        team: (prev.team || []).filter((m: any) => String(m.id) !== stringMemberId),
        members: (prev.members || []).filter((m: any) => String(m.id) !== stringMemberId)
      };
      
      // Show toast with the actual member name
      toast(`Team member removed`, {
        description: `${memberName} has been removed from the project`,
      });
      
      return updatedData;
    });
  }, [setProjectData]);

  // Update the handleMakeManager function
  const handleMakeManager = useCallback(async (memberId: number | string, projectId?: string) => {
    if (!projectId) {
      console.error('No project ID provided for assigning project manager');
      return;
    }
    
    const stringMemberId = String(memberId);
    
    setProjectData((prev: any) => {
      // Find the member to promote
      const memberToPromote = (prev.team || []).find((m: any) => String(m.id) === stringMemberId);
      
      if (!memberToPromote) {
        console.error('Member not found with ID:', stringMemberId);
        return prev;
      }
      
      console.log('Assigning project manager:', memberToPromote.name);
      
      // Update the team array to reflect the new role
      const updatedTeam = (prev.team || []).map((m: any) => {
        if (String(m.id) === stringMemberId) {
          return { ...m, role: 'project_manager' };
        }
        // Change any existing project managers to regular team members
        if (m.role === 'project_manager' || m.role === 'project-manager') {
          return { ...m, role: 'team_member' };
        }
        return m;
      });
      
      // Show toast
      toast(`Project manager assigned`, {
        description: `${memberToPromote.name} has been assigned as the project manager`,
      });
      
      // Update the project data with the new team and project manager
      return {
        ...prev,
        team: updatedTeam,
        project_manager_name: memberToPromote.name,
        project_manager_id: memberToPromote.user_id
      };
    });
    
    // Also update in the database if we have a project ID
    try {
      if (projectId) {
        // First get the member details
        const { data: memberData, error: memberError } = await supabase
          .from('project_members')
          .select('user_id, project_member_name')
          .eq('id', stringMemberId)
          .single();
        
        if (memberError) {
          console.error('Error fetching project member:', memberError);
          return;
        }
        
        if (memberData) {
          // Get the project_manager role ID
          const { data: roleData, error: roleError } = await supabase
            .from('project_roles')
            .select('id')
            .eq('role_key', 'project_manager')
            .single();
            
          if (roleError || !roleData) {
            console.error('Error getting project manager role:', roleError);
            return;
          }
          
          // Assign the role to the user in user_project_roles
          if (memberData.user_id) {
            const { error: roleAssignError } = await supabase
              .from('user_project_roles')
              .upsert({
                user_id: memberData.user_id,
                project_id: projectId,
                project_role_id: roleData.id
              }, {
                onConflict: 'user_id, project_id',
                ignoreDuplicates: false
              });
            
            if (roleAssignError) {
              console.error('Error updating member role:', roleAssignError);
              return;
            }
          }
          
          // If user_id is available, update the project's project_manager_id
          if (memberData.user_id) {
            await supabase
              .from('projects')
              .update({ 
                project_manager_id: memberData.user_id,
                project_manager_name: memberData.project_member_name 
              })
              .eq('id', projectId);
          }
        }
      }
    } catch (error) {
      console.error('Error updating project manager in database:', error);
    }
  }, [setProjectData]);

  return {
    handleAddMember,
    handleRemoveMember,
    handleMakeManager
  };
};
