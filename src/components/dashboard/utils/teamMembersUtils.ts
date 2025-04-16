
import { Project } from '@/lib/types/project';
import { TeamMember, ProjectStatus } from '@/lib/types/common';

/**
 * Extract team members from projects and remove duplicates
 */
export function extractTeamMembers(projects: Project[]): TeamMember[] {
  // Set to track unique member IDs
  const uniqueMembers = new Map<string, TeamMember>();
  
  projects.forEach(project => {
    if (project.members && Array.isArray(project.members)) {
      project.members.forEach(member => {
        if (member.id && !uniqueMembers.has(member.id)) {
          uniqueMembers.set(member.id, {
            id: member.id,
            name: member.name,
            role: member.role,
            avatar: member.avatar
          });
        }
      });
    }
  });
  
  return Array.from(uniqueMembers.values());
}

/**
 * Ensure that a project status is valid, providing a fallback if not
 */
export function ensureProjectStatus(status: string | undefined): ProjectStatus {
  if (!status) return 'in-progress';
  
  // Check if status is a valid ProjectStatus
  const validStatuses: ProjectStatus[] = ['not-started', 'in-progress', 'on-hold', 'completed'];
  return validStatuses.includes(status as ProjectStatus) 
    ? (status as ProjectStatus) 
    : 'in-progress';
}
