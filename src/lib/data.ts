
import { Project } from './types/project';
import { Task, Assignee } from './types/task';

// Sample demo data for projects
export const demoProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design',
    progress: 65,
    status: 'in-progress',
    dueDate: '2023-12-15',
    category: 'Development',
    members: [
      { id: '1', name: 'John Doe', role: 'Project Manager' },
      { id: '2', name: 'Alice Smith', role: 'Designer' }
    ]
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Create a native mobile app for iOS and Android',
    progress: 30,
    status: 'in-progress',
    dueDate: '2024-02-28',
    category: 'Development',
    members: [
      { id: '1', name: 'John Doe', role: 'Developer' },
      { id: '3', name: 'Bob Johnson', role: 'QA Tester' }
    ]
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Q4 digital marketing campaign for new product launch',
    progress: 100,
    status: 'completed',
    dueDate: '2023-10-31',
    category: 'Marketing',
    members: [
      { id: '4', name: 'Emily Wilson', role: 'Marketing Lead' },
      { id: '5', name: 'Michael Brown', role: 'Content Writer' }
    ]
  }
];

// Sample demo data for tasks
export const demoTasks: Task[] = [
  {
    id: '1',
    title: 'Design homepage mockup',
    description: 'Create a modern homepage design with the new brand guidelines',
    status: 'to-do',
    priority: 'high',
    due_date: '2023-11-10',
    completed: false,
    project_id: '1',
    assignees: [{ id: '2', name: 'Alice Smith' }]
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Add login, signup, and password reset functionality',
    status: 'in-progress',
    priority: 'medium',
    due_date: '2023-11-15',
    completed: false,
    project_id: '1',
    assignees: [{ id: '1', name: 'John Doe' }]
  },
  {
    id: '3',
    title: 'Create API documentation',
    description: 'Document all API endpoints for the mobile app',
    status: 'in-review',
    priority: 'medium',
    due_date: '2023-11-05',
    completed: false,
    project_id: '2',
    assignees: [{ id: '1', name: 'John Doe' }]
  },
  {
    id: '4',
    title: 'Finalize social media posts',
    description: 'Prepare and schedule all social media content for the campaign',
    status: 'done',
    priority: 'high',
    due_date: '2023-10-25',
    completed: true,
    completed_at: '2023-10-24',
    project_id: '3',
    assignees: [{ id: '5', name: 'Michael Brown' }]
  }
];

export const demoAssignees: Assignee[] = [
  { id: '1', name: 'John Doe', avatar: '/avatars/john.png' },
  { id: '2', name: 'Alice Smith', avatar: '/avatars/alice.png' },
  { id: '3', name: 'Bob Johnson', avatar: '/avatars/bob.png' },
  { id: '4', name: 'Emily Wilson', avatar: '/avatars/emily.png' },
  { id: '5', name: 'Michael Brown', avatar: '/avatars/michael.png' }
];
