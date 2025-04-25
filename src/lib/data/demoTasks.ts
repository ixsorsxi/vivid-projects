
import { Task } from '@/lib/types/task';

// Task priorities as enum for type safety
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'to-do' | 'in-progress' | 'in-review' | 'completed';

export const demoTasks: Task[] = [
  {
    id: 'task1',
    title: 'Create wireframes for homepage',
    description: 'Design the initial wireframes for the homepage layout',
    status: 'completed',
    completed: true,
    priority: 'high',
    project_id: 'p1',
    due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    assignees: [
      { id: 'u2', name: 'Sarah Wilson', avatar: '/avatars/user2.png' }
    ]
  },
  {
    id: 'task2',
    title: 'Develop navigation component',
    description: 'Create responsive navigation bar with mobile support',
    status: 'in-progress',
    completed: false,
    priority: 'medium',
    project_id: 'p1',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    assignees: [
      { id: 'u3', name: 'David Chen', avatar: '/avatars/user3.png' }
    ],
    subtasks: [
      { id: 'subtask1', title: 'Desktop menu', completed: true, task_id: 'task2' },
      { id: 'subtask2', title: 'Mobile menu', completed: false, task_id: 'task2' },
      { id: 'subtask3', title: 'Dropdown interactions', completed: false, task_id: 'task2' }
    ]
  },
  {
    id: 'task3',
    title: 'Design user authentication screens',
    description: 'Create designs for login, signup, and password reset',
    status: 'to-do',
    completed: false,
    priority: 'medium',
    project_id: 'p1',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    assignees: [
      { id: 'u2', name: 'Sarah Wilson', avatar: '/avatars/user2.png' }
    ]
  },
  {
    id: 'task4',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    status: 'in-progress',
    completed: false,
    priority: 'high',
    project_id: 'p1',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    assignees: [
      { id: 'u3', name: 'David Chen', avatar: '/avatars/user3.png' }
    ]
  },
  {
    id: 'task5',
    title: 'Create app icon',
    description: 'Design app icon for iOS and Android stores',
    status: 'in-review',
    completed: false,
    priority: 'low',
    project_id: 'p2',
    due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    assignees: [
      { id: 'u4', name: 'Lisa Park', avatar: '/avatars/user4.png' }
    ]
  },
  {
    id: 'task6',
    title: 'Implement authentication',
    description: 'Add user authentication with OAuth and email/password',
    status: 'to-do',
    completed: false,
    priority: 'high',
    project_id: 'p2',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    assignees: [
      { id: 'u5', name: 'Michael Roberts', avatar: '/avatars/user5.png' },
      { id: 'u6', name: 'Emma Davis', avatar: '/avatars/user6.png' }
    ],
    dependencies: [
      { taskId: 'task7', type: 'blocking' }
    ]
  },
  {
    id: 'task7',
    title: 'Setup backend API',
    description: 'Create REST API endpoints for mobile app',
    status: 'in-progress',
    completed: false,
    priority: 'high',
    project_id: 'p2',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    assignees: [
      { id: 'u3', name: 'David Chen', avatar: '/avatars/user3.png' }
    ]
  },
  {
    id: 'task8',
    title: 'Create content calendar',
    description: 'Develop content calendar for Q2 marketing campaign',
    status: 'to-do',
    completed: false,
    priority: 'medium',
    project_id: 'p3',
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    assignees: [
      { id: 'u8', name: 'Robert Brown', avatar: '/avatars/user8.png' },
      { id: 'u9', name: 'Patricia Miller', avatar: '/avatars/user9.png' }
    ]
  },
  {
    id: 'task9',
    title: 'Schema migration',
    description: 'Convert MySQL schema to PostgreSQL',
    status: 'completed',
    completed: true,
    priority: 'high',
    project_id: 'p4',
    due_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    assignees: [
      { id: 'u10', name: 'Thomas Wilson', avatar: '/avatars/user10.png' }
    ]
  },
  {
    id: 'task10',
    title: 'Data migration script',
    description: 'Write script to migrate data from old to new database',
    status: 'completed',
    completed: true,
    priority: 'high',
    project_id: 'p4',
    due_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    assignees: [
      { id: 'u3', name: 'David Chen', avatar: '/avatars/user3.png' },
      { id: 'u10', name: 'Thomas Wilson', avatar: '/avatars/user10.png' }
    ]
  }
];

// Add more tasks as needed

export default demoTasks;
