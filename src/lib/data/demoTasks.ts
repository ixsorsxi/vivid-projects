
import { Task } from '../types/task';
// Use the correct export pattern for types in isolation mode
export type { Task };
export type { Assignee } from '../types/task';

// Define the TaskStatus enum properly
export type TaskStatus = 'to-do' | 'in-progress' | 'in-review' | 'done';

// Sample demo tasks
export const demoTasks: Task[] = [
  {
    id: '1',
    project_id: 'project-1',
    title: 'Design User Interface',
    description: 'Create wireframes and mockups for the new dashboard',
    status: 'done',
    priority: 'high',
    due_date: '2025-05-10',
    completed: true,
    assignees: [
      { id: 'user-1', name: 'Alex Johnson', avatar: '/avatars/alex.jpg' }
    ],
    project: 'Website Redesign',
    subtasks: [
      {
        id: 'subtask-1',
        task_id: '1',
        title: 'Create wireframes',
        completed: true
      },
      {
        id: 'subtask-2',
        task_id: '1',
        title: 'Design mockups',
        completed: true
      }
    ],
    created_at: '2025-04-28T10:00:00Z'
  },
  {
    id: '2',
    project_id: 'project-1',
    title: 'Implement Authentication',
    description: 'Set up user authentication and authorization',
    status: 'in-progress',
    priority: 'high',
    due_date: '2025-05-15',
    completed: false,
    assignees: [
      { id: 'user-2', name: 'Sarah Miller', avatar: '/avatars/sarah.jpg' }
    ],
    project: 'Website Redesign',
    created_at: '2025-04-28T11:00:00Z'
  },
  {
    id: '3',
    project_id: 'project-2',
    title: 'Write Documentation',
    description: 'Create comprehensive documentation for the API',
    status: 'to-do',
    priority: 'medium',
    due_date: '2025-05-20',
    completed: false,
    assignees: [
      { id: 'user-3', name: 'Michael Brown', avatar: '/avatars/michael.jpg' }
    ],
    project: 'API Development',
    created_at: '2025-04-28T12:00:00Z'
  },
  {
    id: '4',
    project_id: 'project-2',
    title: 'Implement Error Handling',
    description: 'Add robust error handling to all API endpoints',
    status: 'to-do',
    priority: 'high',
    due_date: '2025-05-18',
    completed: false,
    assignees: [
      { id: 'user-4', name: 'Emily Davis', avatar: '/avatars/emily.jpg' }
    ],
    project: 'API Development',
    created_at: '2025-04-28T13:00:00Z'
  },
  {
    id: '5',
    project_id: 'project-3',
    title: 'Set Up CI/CD Pipeline',
    description: 'Configure continuous integration and deployment',
    status: 'in-progress',
    priority: 'high',
    due_date: '2025-05-12',
    completed: false,
    assignees: [
      { id: 'user-5', name: 'Daniel Wilson', avatar: '/avatars/daniel.jpg' }
    ],
    project: 'Infrastructure Setup',
    created_at: '2025-04-28T14:00:00Z'
  },
  {
    id: '6',
    project_id: 'project-3',
    title: 'Optimize Database Queries',
    description: 'Improve database performance by optimizing queries',
    status: 'to-do',
    priority: 'medium',
    due_date: '2025-05-25',
    completed: false,
    assignees: [
      { id: 'user-1', name: 'Alex Johnson', avatar: '/avatars/alex.jpg' }
    ],
    project: 'Infrastructure Setup',
    created_at: '2025-04-28T15:00:00Z'
  },
  {
    id: '7',
    project_id: 'project-4',
    title: 'Create Marketing Materials',
    description: 'Design and create marketing materials for product launch',
    status: 'in-review',
    priority: 'medium',
    due_date: '2025-05-08',
    completed: false,
    assignees: [
      { id: 'user-6', name: 'Sophia Anderson', avatar: '/avatars/sophia.jpg' }
    ],
    project: 'Product Launch',
    created_at: '2025-04-28T16:00:00Z'
  },
  {
    id: '8',
    project_id: 'project-4',
    title: 'Prepare Press Release',
    description: 'Write and prepare press release for product launch',
    status: 'done',
    priority: 'high',
    due_date: '2025-05-05',
    completed: true,
    assignees: [
      { id: 'user-7', name: 'James Taylor', avatar: '/avatars/james.jpg' }
    ],
    project: 'Product Launch',
    created_at: '2025-04-28T17:00:00Z'
  },
  {
    id: '9',
    project_id: 'project-5',
    title: 'Conduct User Testing',
    description: 'Organize and conduct user testing sessions',
    status: 'to-do',
    priority: 'high',
    due_date: '2025-05-30',
    completed: false,
    assignees: [
      { id: 'user-8', name: 'Olivia Martinez', avatar: '/avatars/olivia.jpg' }
    ],
    project: 'User Research',
    created_at: '2025-04-28T18:00:00Z'
  },
  {
    id: '10',
    project_id: 'project-5',
    title: 'Analyze Feedback Data',
    description: 'Compile and analyze user feedback data',
    status: 'done',
    priority: 'medium',
    due_date: '2025-04-25',
    completed: true,
    completed_at: '2025-04-24T14:30:00Z',
    assignees: [
      { id: 'user-9', name: 'William Johnson', avatar: '/avatars/william.jpg' }
    ],
    project: 'User Research',
    created_at: '2025-04-15T10:00:00Z'
  }
];

export default demoTasks;
