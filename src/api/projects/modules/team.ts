
// Re-export all team module functionality for easier imports
export * from './team/fetchTeamMembers';
export * from './team/projectManager';
export * from './team/permissions';  // Updated to new path
// Don't re-export operations as they might contain duplicates
// export * from './team/operations';
export * from './team/types';
export * from './team/operations/addProjectTeamMember';
export * from './team/operations/removeProjectTeamMember';
// Rename the export from fixRlsPolicy to avoid name conflict
export { checkProjectMemberAccess as fixRlsPolicy } from './team/fixRlsPolicy';
export * from './team/team-permissions';
