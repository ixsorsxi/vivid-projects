
import { Project } from '@/lib/types/project';
import { Task } from '@/lib/types/task';

// Demo projects for development and testing
export const demoProjects: Project[] = [
  {
    id: 'demo-1',
    name: 'Website Redesign',
    description: 'Redesign the company website with modern UI/UX',
    progress: 65,
    status: 'in-progress',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Design',
    project_type: 'Design',
    members: [
      { id: 'user1', name: 'John Doe', role: 'Project Manager' },
      { id: 'user2', name: 'Jane Smith', role: 'Designer' }
    ],
    project_manager_id: 'user1',
    project_manager_name: 'John Doe'
  },
  {
    id: 'demo-2',
    name: 'Mobile App Development',
    description: 'Develop a mobile app for customer engagement',
    progress: 30,
    status: 'in-progress',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Development',
    project_type: 'Development',
    members: [
      { id: 'user1', name: 'John Doe', role: 'Product Owner' },
      { id: 'user3', name: 'Mike Johnson', role: 'Developer' }
    ],
    project_manager_id: 'user1',
    project_manager_name: 'John Doe'
  },
  {
    id: 'demo-3',
    name: 'Marketing Campaign',
    description: 'Q3 Marketing Campaign for new product launch',
    progress: 100,
    status: 'completed',
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Marketing',
    project_type: 'Marketing',
    members: [
      { id: 'user4', name: 'Sarah Williams', role: 'Marketing Lead' },
      { id: 'user5', name: 'James Brown', role: 'Content Creator' }
    ],
    project_manager_id: 'user4',
    project_manager_name: 'Sarah Williams'
  }
];

// Demo tasks for development and testing
export const demoTasks: Task[] = [
  {
    id: 'task-1',
    project_id: 'demo-1',
    title: 'Design homepage wireframes',
    description: 'Create wireframes for the new homepage layout',
    status: 'in-progress',
    priority: 'high',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
    assignees: [
      { id: 'user2', name: 'Jane Smith', avatar: '' }
    ]
  },
  {
    id: 'task-2',
    project_id: 'demo-1',
    title: 'Implement responsive design',
    description: 'Make sure the website works well on all devices',
    status: 'to-do',
    priority: 'medium',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
    assignees: [
      { id: 'user3', name: 'Mike Johnson', avatar: '' }
    ]
  },
  {
    id: 'task-3',
    project_id: 'demo-2',
    title: 'Develop authentication module',
    description: 'Create user registration and login functionality',
    status: 'in-progress',
    priority: 'high',
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
    assignees: [
      { id: 'user3', name: 'Mike Johnson', avatar: '' }
    ]
  },
  {
    id: 'task-4',
    project_id: 'demo-3',
    title: 'Create social media assets',
    description: 'Design graphics for social media campaign',
    status: 'done',
    priority: 'medium',
    due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completed: true,
    completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    assignees: [
      { id: 'user5', name: 'James Brown', avatar: '' }
    ]
  },
  {
    id: 'task-5',
    project_id: 'demo-1',
    title: 'User testing session',
    description: 'Conduct usability tests with real users',
    status: 'to-do',
    priority: 'high',
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
    assignees: [
      { id: 'user2', name: 'Jane Smith', avatar: '' },
      { id: 'user1', name: 'John Doe', avatar: '' }
    ]
  }
];

// Function to get demo data if needed
export const getDemoData = () => {
  return {
    projects: demoProjects,
    tasks: demoTasks
  };
};
