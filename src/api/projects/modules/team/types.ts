
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
