
// Export functions from individual files
export { getUserProjectRole } from './getUserRole';
export { 
  getUserProjectPermissions,
  fetchUserProjectPermissions 
} from './getUserPermissions';
export { 
  hasProjectPermission,
  checkUserProjectPermission 
} from './permissionCheck';
export { assignProjectRole } from './roleAssignment';
export { 
  fetchProjectRoles,
  fetchProjectPermissions,
  fetchPermissionsForRole,
  getRoleDescription 
} from './fetchRolesAndPermissions';
export { mapLegacyRole } from './roleMapping';

// Export types
export type { ProjectRoleKey, ProjectPermissionName } from './types';
