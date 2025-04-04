
// Export functions from fetchTeamMembers
export { fetchProjectTeamMembers } from './fetchTeamMembers';
// Export projectManager functions explicitly
export { findProjectManager, fetchProjectManagerName, isUserProjectManager } from './projectManager';
// Export role and permission functions
export { 
  fetchProjectRoles, 
  fetchProjectPermissions, 
  fetchPermissionsForRole,
  checkUserProjectPermission,
  fetchUserProjectPermissions,
  getRoleDescription,
  mapLegacyRole
} from './rolePermissions';
// Export other existing functions
export * from './teamOperations';
export * from './types';
export * from './fixRlsPolicy';
// Explicitly export only once
export { fetchTeamMembersWithPermissions } from './fixTeamExports';
