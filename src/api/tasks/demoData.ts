
import { Task, Assignee } from '@/lib/data';

// Demo tasks for fallback when database isn't available
export const getDemoTasks = (userId?: string): Task[] => [
  {
    id: 'demo-1',
    title: 'Complete project proposal',
    description: 'Write up the proposal for the new client project',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    completed: false,
    project: 'Client Project',
    assignees: [{ name: 'Demo User' }],
    // Add userId if provided to associate with the logged-in user
    ...(userId && { userId })
  },
  {
    id: 'demo-2',
    title: 'Review wireframes',
    description: 'Review the design wireframes from the design team',
    status: 'to-do',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    completed: false,
    project: 'Website Redesign',
    assignees: [{ name: 'Demo User' }],
    ...(userId && { userId })
  },
  {
    id: 'demo-3',
    title: 'Fix sidebar navigation bug',
    description: 'The sidebar navigation collapses unexpectedly on small screens',
    status: 'to-do',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
    completed: false,
    project: 'Bug Fixes',
    assignees: [{ name: 'Demo User' }],
    ...(userId && { userId })
  },
  {
    id: 'demo-4',
    title: 'Write documentation',
    description: 'Document the new API endpoints for the developer portal',
    status: 'completed',
    priority: 'low',
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    completed: true,
    project: 'Documentation',
    assignees: [{ name: 'Demo User' }],
    ...(userId && { userId })
  }
];

// Simple demo users for testing
export const getDemoUsers = (): Assignee[] => [
  { name: 'John Doe', avatar: undefined },
  { name: 'Jane Smith', avatar: undefined },
  { name: 'Robert Johnson', avatar: undefined },
  { name: 'Emily Davis', avatar: undefined }
];
