
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { useTeamDataFetch } from './hooks/useTeamDataFetch';
import { useTeamMemberAdd } from './hooks/useTeamMemberAdd';
import { useTeamMemberRemove } from './hooks/useTeamMemberRemove';
import { useTeamManagerAssignment } from './hooks/useTeamManagerAssignment';
import TeamGrid from './components/TeamGrid';
import AddMemberDialog from './add-member/AddMemberDialog';
import { toast } from '@/components/ui/toast-wrapper';
import { fetchTeamManagerName } from '@/api/projects/modules/team';
import { useQueryClient } from '@tanstack/react-query';
import { checkUserProjectAccess } from '@/utils/projectAccessChecker';
import { debugLog, debugError } from '@/utils/debugLogger';

interface ProjectTeamManagerProps {
  projectId: string;
}

const ProjectTeamManager: React.FC<ProjectTeamManagerProps> = ({ projectId }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [projectManagerName, setProjectManagerName] = useState<string | null>(null);
  const [accessStatus, setAccessStatus] = useState<string>('checking');
  const queryClient = useQueryClient();
  
  // Use the separate hooks for better organization
  const { teamMembers, isRefreshing, refreshTeamMembers } = useTeamDataFetch(projectId);
  const { isAdding, handleAddMember } = useTeamMemberAdd(projectId, refreshTeamMembers);
  const { isRemoving, handleRemoveMember } = useTeamMemberRemove(teamMembers, projectId, refreshTeamMembers);
  const { isUpdating, assignProjectManager } = useTeamManagerAssignment(teamMembers, projectId, refreshTeamMembers);
  
  // Check user access to the project
  useEffect(() => {
    const verifyAccess = async () => {
      if (projectId) {
        try {
          const access = await checkUserProjectAccess(projectId);
          debugLog('TEAM', 'Access check result:', access);
          
          setAccessStatus(
            access.hasAccess 
              ? `granted (${access.isProjectOwner ? 'project owner' : access.isAdmin ? 'admin' : 'team member'})` 
              : `denied (${access.reason || 'unknown reason'})`
          );
        } catch (error) {
          debugError('TEAM', 'Error checking project access:', error);
          setAccessStatus('error checking access');
        }
      }
    };
    
    verifyAccess();
  }, [projectId]);
  
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
    debugLog('TEAM', 'Opening add member dialog for project:', projectId);
    setIsAddDialogOpen(true);
  };

  const onAddMember = async (member: { 
    id?: string; 
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }): Promise<boolean> => {
    debugLog("ProjectTeamManager", "Adding member:", member);
    try {
      // Make sure to normalize the role as a project role
      const projectRole = member.role || 'Team Member';
      
      // Create a clean member object with only needed fields
      const memberData = {
        name: member.name,
        role: projectRole, // Use the normalized project role
        email: member.email,
        user_id: member.user_id // Ensure this is already a string
      };
      
      debugLog('ProjectTeamManager', 'Processed member data:', memberData);
      
      if (!projectId) {
        debugError('ProjectTeamManager', 'Project ID is undefined');
        toast.error('Cannot add member', {
          description: 'Project ID is missing. Please try again.'
        });
        return false;
      }
      
      const success = await handleAddMember(memberData);
      
      if (success) {
        // Force refresh to ensure we get the latest data
        await refreshTeamMembers();
        
        // Also invalidate any React Query cache for this project
        queryClient.invalidateQueries({ queryKey: ['project', projectId] });
        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      debugError('ProjectTeamManager', 'Error in onAddMember:', error);
      return false;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Project Team Members</h3>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Project Team Member
        </Button>
      </div>
      
      {/* Add debug access info - keep this as requested by the user */}
      <div className="text-xs text-muted-foreground bg-slate-50 p-2 rounded-sm mb-2">
        Access status: {accessStatus}
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
