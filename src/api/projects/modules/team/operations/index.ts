
export { addProjectTeamMember, addProjectTeamMember as addTeamMemberToProject } from './addProjectTeamMember';
export { removeProjectTeamMember } from './removeProjectTeamMember';
export { updateProjectTeamMember } from './updateProjectTeamMember';

// Create placeholder exports for missing functions
export const fetchProjectRoles = async () => {
  console.warn('fetchProjectRoles within operations not implemented yet');
  return [];
};
