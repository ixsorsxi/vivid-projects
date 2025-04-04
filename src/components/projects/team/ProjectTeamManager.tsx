
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { TeamMember } from './types';
import { useTeamOperations } from './hooks/team-operations/useTeamOperations';
import { useTeamMembers } from './hooks/useTeamMembers';
import TeamGrid from './components/TeamGrid';
import AddMemberDialog from './add-member/AddMemberDialog';
import { toast } from '@/components/ui/toast-wrapper';
import { fetchTeamManagerName } from '@/api/projects/modules/team';
import { useQueryClient } from '@tanstack/react-query';

interface ProjectTeamManagerProps {
  projectId: string;
}

const ProjectTeamManager: React.FC<ProjectTeamManagerProps> = ({ projectId }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [projectManagerName, setProjectManagerName] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  // Use the team members hook to fetch and manage team data
  const {
    teamMembers,
    isRefreshing,
    isAdding,
    isRemoving,
    isUpdating,
    refreshTeamMembers,
    handleAddMember,
    handleRemoveMember,
    assignProjectManager
  } = useTeamMembers([], projectId);
  
  // Fetch the project manager name
  useEffect(() => {
    const getManagerName = async () => {
      if (projectId) {
        try {
          const managerName = await fetchTeamManagerName(projectId);
          setProjectManagerName(managerName);
        } catch (error) {
          console.error('Failed to fetch project manager name:', error);
        }
      }
    };
    
    getManagerName();
  }, [projectId, teamMembers]); // Re-fetch when team members change
  
  const openAddDialog = () => {
    console.log('Opening add member dialog for project:', projectId);
    setIsAddDialogOpen(true);
  };

  const onAddMember = async (member: { 
    id?: string; 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }): Promise<boolean> => {
    console.log('ProjectTeamManager - Adding member:', member);
    try {
      // Ensure we're passing the user_id correctly and using role as project role (not system role)
      const memberData = {
        name: member.name,
        role: member.role, // This is the project role, not system role
        email: member.email,
        user_id: member.user_id ? String(member.user_id) : undefined
      };
      
      console.log('ProjectTeamManager - Processed member data:', memberData);
      
      // Explicit check to ensure projectId is defined and valid
      if (!projectId) {
        console.error('ProjectTeamManager - Project ID is undefined');
        toast.error('Cannot add member', {
          description: 'Project ID is missing. Please try again.'
        });
        return false;
      }
      
      // Force a specific project ID string to ensure it's being passed correctly
      console.log('ProjectTeamManager - Using project ID:', projectId);
      
      const success = await handleAddMember(memberData);
      
      if (success) {
        toast.success('Team member added', {
          description: `${member.name} has been added to the project team.`,
        });
        
        // Force refresh to ensure we get the latest data
        await refreshTeamMembers();
        
        // Also invalidate any React Query cache for this project
        queryClient.invalidateQueries({ queryKey: ['project', projectId] });
        
        return true;
      } else {
        toast.error('Failed to add team member', {
          description: 'There was an issue adding the team member to the database.',
        });
        return false;
      }
    } catch (error) {
      console.error('Error in onAddMember:', error);
      toast.error('Error adding team member', {
        description: 'An unexpected error occurred.',
      });
      return false;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Project Team Members</h3>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Team Member
        </Button>
      </div>
      
      {isRefreshing ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading team members...</p>
        </div>
      ) : (
        <TeamGrid
          teamMembers={teamMembers}
          projectManagerName={projectManagerName}
          isRemoving={isRemoving}
          isUpdating={isUpdating}
          onRemove={handleRemoveMember}
          onMakeManager={assignProjectManager}
        />
      )}
      
      {/* Dialog for adding team members */}
      <AddMemberDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        projectId={projectId}
        onAddMember={onAddMember}
        isSubmitting={isAdding}
      />
    </div>
  );
};

export default ProjectTeamManager;
