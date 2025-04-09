import React, { useState, useEffect } from 'react';
import { useTeamDataFetch } from './hooks/useTeamDataFetch';
import { useTeamMemberOperations } from './hooks/useTeamMemberOperations';
import { useTeamMemberRemove } from './hooks/useTeamMemberRemove';
import { useTeamManagerAssignment } from './hooks/useTeamManagerAssignment';
import TeamContent from './components/TeamContent';
import AddMemberDialog from './add-member/AddMemberDialog';
import { toast } from '@/components/ui/toast-wrapper';
import { fetchTeamManagerName } from '@/api/projects/modules/team';
import { useQueryClient } from '@tanstack/react-query';
import { checkUserProjectAccess } from '@/utils/projectAccessChecker';
import { debugLog, debugError } from '@/utils/debugLogger';
import TeamHeader from './components/TeamHeader';

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
  const { isSubmitting, lastError, addTeamMember } = useTeamMemberOperations(projectId);
  const { isRemoving, handleRemoveMember } = useTeamMemberRemove(projectId);
  const { isUpdating, assignProjectManager } = useTeamManagerAssignment(projectId);
  
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
    name: string; 
    role: string; 
    email?: string; 
    user_id?: string 
  }): Promise<boolean> => {
    debugLog("ProjectTeamManager", "Adding member:", member);
    try {
      if (!projectId) {
        debugError('ProjectTeamManager', 'Project ID is undefined');
        toast.error('Cannot add member', {
          description: 'Project ID is missing. Please try again.'
        });
        return false;
      }
      
      // Create a clean member object with only needed fields
      const memberData = {
        name: member.name,
        role: member.role || 'team_member',
        email: member.email,
        user_id: member.user_id
      };
      
      debugLog('ProjectTeamManager', 'Processed member data:', memberData);
      
      // Use the updated addTeamMember hook function
      const success = await addTeamMember(memberData);
      
      if (success) {
        // Force refresh to ensure we get the latest data
        await refreshTeamMembers();
        
        // Also invalidate any React Query cache for this project
        queryClient.invalidateQueries({ queryKey: ['project', projectId] });
        
        toast.success('Team member added', {
          description: `${member.name} has been added to the project team`
        });
        return true;
      } else {
        debugError('ProjectTeamManager', 'handleAddMember returned false');
        // Display the last error if available
        const errorMsg = lastError?.message || 'The database operation was unsuccessful. Please check your connection and try again.';
        toast.error('Failed to add team member', {
          description: errorMsg
        });
        return false;
      }
    } catch (error) {
      debugError('ProjectTeamManager', 'Error in onAddMember:', error);
      toast.error('Failed to add team member', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
      return false;
    }
  };
  
  return (
    <div className="space-y-4">
      <TeamHeader 
        membersCount={teamMembers.length} 
        isRefreshing={isRefreshing}
        onRefresh={refreshTeamMembers}
        onAddMember={openAddDialog}
      />
      
      {/* Add debug access info - keep this as requested by the user */}
      <div className="text-xs text-muted-foreground bg-slate-50 p-2 rounded-sm mb-2">
        Access status: {accessStatus}
      </div>
      
      {isRefreshing ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading team members...</p>
        </div>
      ) : (
        <TeamContent
          teamMembers={teamMembers}
          projectManagerName={projectManagerName}
          isRefreshing={isRefreshing}
          isRemoving={isRemoving}
          isUpdating={isUpdating}
          refreshTeamMembers={refreshTeamMembers}
          onAddMember={openAddDialog}
          onRemove={handleRemoveMember}
          onMakeManager={assignProjectManager}
        />
      )}
      
      <AddMemberDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        projectId={projectId}
        onAddMember={onAddMember}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ProjectTeamManager;
