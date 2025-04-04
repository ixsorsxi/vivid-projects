
import { useState, useEffect } from 'react';
import { TeamMember } from '../types';
import { fetchTeamManagerName } from '@/api/projects/modules/team';
import { checkProjectMemberAccess } from '@/api/projects/modules/team/fixRlsPolicy';
import { toast } from '@/components/ui/toast-wrapper';

export const useProjectTeam = (team: TeamMember[] = [], projectId?: string) => {
  const [localTeam, setLocalTeam] = useState<TeamMember[]>(team || []);
  const [projectManagerName, setProjectManagerName] = useState<string | null>(null);
  const [hasAccessChecked, setHasAccessChecked] = useState(false);
  
  // Update local team when the prop changes
  useEffect(() => {
    if (team) {
      console.log('ProjectTeam received new team data:', team);
      setLocalTeam(team);
    }
  }, [team]);

  // Check project member access for RLS policy issues
  useEffect(() => {
    if (projectId && !hasAccessChecked) {
      const checkAccess = async () => {
        try {
          console.log("Checking project member access for RLS policy issues...");
          const hasAccess = await checkProjectMemberAccess(projectId);
          
          if (!hasAccess) {
            console.warn("Potential RLS policy issue detected with project_members table");
            toast.error("Access issue detected", {
              description: "There might be an issue with database permissions. Please contact support."
            });
          }
          
          setHasAccessChecked(true);
        } catch (error) {
          console.error("Error checking access:", error);
        }
      };
      
      checkAccess();
    }
  }, [projectId, hasAccessChecked]);
  
  // Fetch project manager name
  useEffect(() => {
    if (projectId) {
      const getProjectManager = async () => {
        try {
          const managerName = await fetchTeamManagerName(projectId);
          console.log("Fetched project manager name:", managerName);
          if (managerName) {
            setProjectManagerName(managerName);
          }
        } catch (error) {
          console.error('Error fetching project manager:', error);
        }
      };
      
      getProjectManager();
    }
  }, [projectId, localTeam]);

  return {
    localTeam,
    projectManagerName
  };
};
