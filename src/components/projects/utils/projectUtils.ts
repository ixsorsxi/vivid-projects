
import { Project } from '@/lib/types/project';
import { ProjectType } from '@/types/project';
import { PriorityLevel, ProjectStatus } from '@/lib/types/common';
import { ensureProjectStatus } from '@/components/dashboard/utils/teamMembersUtils';

/**
 * Convert demo projects to the correct ProjectType with proper typing
 */
export const convertToProjectType = (projects: any[]): ProjectType[] => {
  if (!projects || !Array.isArray(projects)) {
    console.warn('Invalid projects data received:', projects);
    return [];
  }
  
  return projects.map(project => ({
    ...project,
    // Ensure priority exists with a fallback
    priority: (('priority' in project) ? project.priority : 'medium') as PriorityLevel,
    // Ensure status is a valid ProjectStatus
    status: ensureProjectStatus(project.status),
    // Ensure members exists by mapping from team if needed
    members: ('members' in project && Array.isArray(project.members)) ? project.members : 
              (Array.isArray(project.team) ? project.team.map(member => ({
                id: String(member.id),
                name: member.name
              })) : [])
  }));
};

export const filterProjects = (
  projects: ProjectType[], 
  searchQuery: string, 
  filterStatus: string | null
): ProjectType[] => {
  if (!projects || !Array.isArray(projects)) {
    return [];
  }
  
  return projects.filter(project => {
    // Apply search filter
    const matchesSearch = !searchQuery || 
      (project.name && project.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply status filter
    const matchesStatus = !filterStatus || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
};
