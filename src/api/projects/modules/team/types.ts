
// If this file doesn't exist yet, we'll create it with the proper types

export type ProjectRoleKey = 
  | 'team_member' 
  | 'project_manager' 
  | 'developer' 
  | 'designer' 
  | 'client_stakeholder'
  | string; // Allow other string values for backward compatibility

export interface ProjectRole {
  id: string;
  role_key: ProjectRoleKey;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  user_id?: string;
  permissions?: string[];
}

export interface SystemUser {
  id: string;
  name: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export type ProjectPermissionName = 
  | 'view_tasks'
  | 'view_project'
  | 'view_files'
  | 'view_team'
  | 'view_reports'
  | 'view_financials' 
  | 'view_milestones'
  | 'create_tasks'
  | 'create_files'
  | 'create_milestones'
  | 'create_comments'
  | 'edit_tasks'
  | 'edit_files'
  | 'edit_project_details'
  | 'edit_milestones'
  | 'edit_project_settings'
  | 'delete_tasks'
  | 'delete_files'
  | 'delete_milestones'
  | 'delete_comments'
  | 'assign_tasks'
  | 'add_team_members'
  | 'remove_team_members'
  | 'change_member_roles';
