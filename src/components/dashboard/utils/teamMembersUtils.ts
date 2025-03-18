
import { Project } from '@/lib/types/project';
import { ProjectStatus } from '@/lib/types/common';

export const extractTeamMembers = (projects: Project[]): string[] => {
  return Array.from(
    new Set(
      projects.flatMap(project => {
        const members: string[] = [];
        
        // Check for team property
        if ('team' in project && project.team) {
          members.push(...project.team.map(member => member.name));
        }
        
        // Check for members property
        if ('members' in project && project.members) {
          members.push(...project.members.map(member => member.name));
        }
        
        return members;
      })
    )
  );
};

// Type guard to ensure project status is compatible with ProjectStatus
export const ensureProjectStatus = (status: string): ProjectStatus => {
  const validStatuses: ProjectStatus[] = ['not-started', 'in-progress', 'on-hold', 'completed'];
  return validStatuses.includes(status as ProjectStatus) 
    ? (status as ProjectStatus) 
    : 'not-started';
};
