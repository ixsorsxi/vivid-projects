
// Export functions from fetchTeamMembers
export { fetchProjectTeamMembers } from './fetchTeamMembers';

// Export projectManager functions explicitly
export { findProjectManager, fetchProjectManagerName, isUserProjectManager } from './projectManager';

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
  updateProjectTeamMember, 
} from './operations';

// Export types
export * from './types';

// Export functions for fixing RLS policy
export { fixRlsPolicy } from './fixRlsPolicy';

// Explicitly export checkProjectMemberAccess from team-permissions
export { checkProjectMemberAccess } from './team-permissions';

// Export other functions from team-permissions
export * from './team-permissions';
