
// Re-export all team module functionality for easier imports
export * from './team/fetchTeamMembers';
export * from './team/projectManager';
export * from './team/rolePermissions';
// Don't re-export operations as they might contain duplicates
// export * from './team/operations';
export * from './team/types';
export * from './team/operations/addProjectTeamMember';
export * from './team/operations/removeProjectTeamMember';
export * from './team/fixRlsPolicy';
export * from './team/fixTeamExports';
