
export const projectRoles = [
  { 
    value: 'team_member', 
    label: 'Team Member',
    description: 'Standard team member with basic project access'
  },
  { 
    value: 'Project Manager', 
    label: 'Project Manager',
    description: 'Manages project timeline, tasks, and team coordination'
  },
  { 
    value: 'developer', 
    label: 'Developer',
    description: 'Responsible for implementing project features and fixes'
  },
  { 
    value: 'designer', 
    label: 'Designer',
    description: 'Creates visual elements and user experience'
  },
  { 
    value: 'stakeholder', 
    label: 'Stakeholder',
    description: 'Views progress but cannot modify project elements'
  },
  { 
    value: 'client', 
    label: 'Client',
    description: 'External client with limited view access'
  },
  { 
    value: 'admin', 
    label: 'Admin',
    description: 'Full project control with administrative privileges'
  }
];

export const projectPermissions = {
  view_project: 'View project details',
  edit_project: 'Edit project information',
  delete_project: 'Delete project',
  add_members: 'Add team members',
  remove_members: 'Remove team members',
  edit_members: 'Edit team member roles',
  create_tasks: 'Create tasks',
  edit_tasks: 'Edit tasks',
  delete_tasks: 'Delete tasks',
  view_tasks: 'View tasks',
  complete_tasks: 'Mark tasks as complete',
  view_financials: 'View financial information',
  edit_financials: 'Edit financial information',
};

export const rolePermissionsMap = {
  'team_member': [
    'view_project',
    'view_tasks',
    'complete_tasks'
  ],
  'Project Manager': [
    'view_project',
    'edit_project',
    'add_members',
    'remove_members',
    'edit_members',
    'create_tasks',
    'edit_tasks',
    'delete_tasks', 
    'view_tasks',
    'complete_tasks',
    'view_financials',
  ],
  'developer': [
    'view_project',
    'view_tasks',
    'create_tasks',
    'edit_tasks',
    'complete_tasks'
  ],
  'designer': [
    'view_project',
    'view_tasks',
    'complete_tasks'
  ],
  'stakeholder': [
    'view_project',
    'view_tasks',
    'view_financials'
  ],
  'client': [
    'view_project',
    'view_tasks'
  ],
  'admin': [
    'view_project',
    'edit_project',
    'delete_project',
    'add_members',
    'remove_members',
    'edit_members',
    'create_tasks',
    'edit_tasks',
    'delete_tasks',
    'view_tasks',
    'complete_tasks',
    'view_financials',
    'edit_financials'
  ]
};
