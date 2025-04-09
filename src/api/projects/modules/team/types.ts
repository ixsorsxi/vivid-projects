
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  user_id?: string;
  avatar?: string;
  role_description?: string;
  project_role_id?: string;
  joined_at?: string;
  left_at?: string;
}

export interface SystemUser {
  id: string | number;
  name: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export interface TeamMemberWithPermissions extends TeamMember {
  permissions: string[];
}

export type ProjectRoleKey = 
  | 'project_manager'
  | 'project_owner'
  | 'team_member'
  | 'developer'
  | 'designer'
  | 'qa_tester'
  | 'client_stakeholder'
  | 'observer_viewer'
  | 'admin'
  | 'scrum_master'
  | 'business_analyst'
  | 'coordinator';

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

export interface ProjectRole {
  id: string;
  role_key: ProjectRoleKey;
  description: string;
  created_at?: string;
}
