import { Assignee } from '@/lib/types/common';

/**
 * Returns a list of demo users for fallback when not connected to backend
 */
export const getDemoUsers = (): Assignee[] => {
  return [
    { id: '1', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'Michael Brown', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: '5', name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=5' },
  ];
};

/**
 * Returns demo task data
 */
export const getDemoTasks = () => {
  return [
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
      title: 'Implement authentication',
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
      description: 'Design and implement the database schema',
      status: 'to-do',
      priority: 'medium',
      dueDate: '2023-11-25',
      assignees: [{ id: '4', name: 'Emma Davis' }],
      completed: false
    },
    {
      id: 'task-5',
      title: 'API integration',
      description: 'Integrate with third-party APIs',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2023-11-18',
      assignees: [{ id: '5', name: 'James Wilson' }],
      completed: false
    },
    {
      id: 'task-6',
      title: 'User testing',
      description: 'Conduct user testing sessions',
      status: 'to-do',
      priority: 'low',
      dueDate: '2023-12-05',
      assignees: [{ id: '2', name: 'Sarah Johnson' }],
      completed: false
    },
    {
      id: 'task-7',
      title: 'Documentation',
      description: 'Create user and developer documentation',
      status: 'to-do',
      priority: 'low',
      dueDate: '2023-12-10',
      assignees: [{ id: '1', name: 'John Smith' }],
      completed: false
    },
    {
      id: 'task-8',
      title: 'Bug fixes',
      description: 'Address reported bugs and issues',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2023-11-12',
      assignees: [{ id: '3', name: 'Michael Brown' }],
      completed: false
    },
    {
      id: 'task-9',
      title: 'Performance optimization',
      description: 'Optimize application performance',
      status: 'to-do',
      priority: 'medium',
      dueDate: '2023-11-28',
      assignees: [{ id: '4', name: 'Emma Davis' }],
      completed: false
    },
    {
      id: 'task-10',
      title: 'Deployment setup',
      description: 'Configure deployment pipeline',
      status: 'completed',
      priority: 'high',
      dueDate: '2023-11-08',
      assignees: [{ id: '5', name: 'James Wilson' }],
      completed: true
    }
  ];
};

/**
 * Get a specific demo task by ID
 */
export const getDemoTaskById = (id: string) => {
  return getDemoTasks().find(task => task.id === id) || null;
};
