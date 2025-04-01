
// Export all project API functions for easy imports
export { createProject } from './projectCreate';
export { 
  fetchProjectById, 
  fetchUserProjects,
  fetchProjectMilestones,
  fetchProjectRisks,
  fetchProjectFinancials
} from './projectFetch';
export type { ProjectCreateData, ProjectApiError } from './types';
