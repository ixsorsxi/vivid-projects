
// Project role options (not system user roles)
export const projectRoles = [
  { value: 'team_member', label: 'Team Member' },
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'qa_tester', label: 'QA Tester' },
  { value: 'project_manager', label: 'Project Manager' },
  { value: 'business_analyst', label: 'Business Analyst' },
  { value: 'scrum_master', label: 'Scrum Master' },
  { value: 'client_stakeholder', label: 'Client Stakeholder' },
  { value: 'observer_viewer', label: 'Observer' }
];

// Map system roles to display variants
export const systemRoleVariants = {
  'admin': 'destructive',
  'manager': 'default',
  'developer': 'outline',
  'designer': 'secondary', 
  'user': 'outline'
};

// Default project permissions for different roles
export const defaultRolePermissions = {
  'project_manager': [
    'view_tasks', 'view_project', 'view_files', 'view_team', 'view_reports',
    'create_tasks', 'create_files', 'create_milestones', 'edit_tasks', 
    'edit_files', 'edit_project_details', 'add_team_members', 'assign_tasks'
  ],
  'team_member': [
    'view_tasks', 'view_project', 'view_files', 'view_team',
    'create_tasks', 'edit_tasks'
  ],
  'observer_viewer': [
    'view_tasks', 'view_project', 'view_files', 'view_team'
  ]
};
