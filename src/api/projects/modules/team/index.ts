
// Export functions from fetchTeamMembers
export { fetchProjectTeamMembers } from './fetchTeamMembers';

// Export projectManager functions explicitly
export {
  assignProjectManager,
  getProjectManager,
  fetchProjectManagerName,
  isUserProjectManager,
  findProjectManager
} from './projectManager';

// Export role and permission functions
export { 
  getUserProjectRole,
  hasProjectPermission,
  assignProjectRole,
  fetchProjectRoles,
  fetchProjectPermissions,
  fetchPermissionsForRole,
  checkUserProjectPermission,
  fetchUserProjectPermissions,
  getUserProjectPermissions,
  getRoleDescription,
  mapLegacyRole
} from './permissions';

// Export team operations
export { 
  addProjectTeamMember, 
  removeProjectTeamMember,
  addTeamMemberToProject,
  updateProjectTeamMember 
} from './operations';

// Export types
export * from './types';

// Export functions for fixing RLS policy from fixRlsPolicy
export { checkProjectMemberAccess as fixRlsPolicy } from './fixRlsPolicy';

// Export team-permissions functions
export * from './team-permissions';
