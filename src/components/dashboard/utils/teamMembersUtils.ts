
import { Project } from '@/lib/types/project';

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
