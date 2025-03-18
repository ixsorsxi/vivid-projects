// Re-export Task type from the types folder - this ensures we have a single source of truth 
export type { Task, TaskDependency, Subtask } from './types/task';
export type { Assignee, DependencyType, PriorityLevel, StatusType } from './types/common';

// Demo Data - This will be moved to the database later

// Demo assignees - This will be replaced with users from auth tables
export const demoAssignees = [
  { id: '1', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Michael Brown', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=5' },
];

// Demo tasks - This will be replaced with data from the tasks table
export const demoTasks = [
  {
    id: 'task-1',
    title: 'Complete project proposal',
    description: 'Draft the project proposal for client review',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2023-11-15',
    assignees: [{ id: '1', name: 'John Smith' }],
    completed: false
  },
  {
    id: 'task-2',
    title: 'Design system review',
    description: 'Review the design system for consistency',
    status: 'to-do',
    priority: 'medium',
    dueDate: '2023-11-20',
    assignees: [{ id: '2', name: 'Sarah Johnson' }],
    completed: false
  },
  {
    id: 'task-3',
    title: 'Implement user authentication',
    description: 'Set up user authentication and authorization',
    status: 'completed',
    priority: 'high',
    dueDate: '2023-11-10',
    assignees: [{ id: '3', name: 'Michael Brown' }],
    completed: true
  },
  {
    id: 'task-4',
    title: 'Create database schema',
    description: 'Define the database schema for the application',
    status: 'review',
    priority: 'medium',
    dueDate: '2023-11-22',
    assignees: [{ id: '4', name: 'Emma Davis' }],
    completed: false
  },
  {
    id: 'task-5',
    title: 'Write unit tests',
    description: 'Write unit tests for all components',
    status: 'blocked',
    priority: 'low',
    dueDate: '2023-11-25',
    assignees: [{ id: '5', name: 'James Wilson' }],
    completed: false
  },
];

// Demo projects - This will be replaced with data from the projects table
export const demoProjects = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    description: 'Redesign the company website',
    status: 'in-progress',
    dueDate: '2023-12-31',
    category: 'Marketing',
    progress: 60,
    tasks: { total: 15, completed: 9 },
    team: [
      { id: 1, name: 'John Smith', role: 'Frontend Developer' },
      { id: 2, name: 'Sarah Johnson', role: 'Backend Developer' },
      { id: 3, name: 'Michael Brown', role: 'Project Manager' }
    ]
  },
  {
    id: 'project-2',
    name: 'Mobile App Development',
    description: 'Develop a mobile app for iOS and Android',
    status: 'completed',
    dueDate: '2023-11-15',
    category: 'Development',
    progress: 100,
    tasks: { total: 20, completed: 20 },
    team: [
      { id: 4, name: 'Emma Davis', role: 'Mobile Developer' },
      { id: 5, name: 'James Wilson', role: 'UI/UX Designer' }
    ]
  },
  {
    id: 'project-3',
    name: 'Content Marketing Strategy',
    description: 'Create a content marketing strategy for the next quarter',
    status: 'in-progress',
    dueDate: '2023-12-15',
    category: 'Marketing',
    progress: 40,
    tasks: { total: 10, completed: 4 },
    team: [
      { id: 1, name: 'John Smith', role: 'Content Writer' },
      { id: 3, name: 'Michael Brown', role: 'Marketing Manager' }
    ]
  }
];

// Helper function to get demo data for task features
export const getDemoUsers = () => {
  return demoAssignees;
};
