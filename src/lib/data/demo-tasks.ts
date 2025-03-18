
import { Task } from '../types/task';

export const demoTasks: Task[] = [
  {
    id: '1',
    title: 'Design new user dashboard',
    description: 'Create wireframes and high-fidelity designs for the new user dashboard',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2023-11-05',
    project: 'Website Redesign',
    assignees: [
      { name: 'Jane Smith' },
      { name: 'Mike Johnson' },
    ],
    completed: false,
    subtasks: [
      {
        id: '1-1',
        title: 'Research competitive dashboards',
        completed: true,
        status: 'completed',
        priority: 'medium'
      },
      {
        id: '1-2',
        title: 'Create wireframes',
        completed: false,
        status: 'in-progress',
        priority: 'high'
      }
    ]
  },
  {
    id: '2',
    title: 'Implement authentication system',
    description: 'Add OAuth2 and SSO capabilities to the platform',
    status: 'to-do',
    priority: 'medium',
    dueDate: '2023-11-10',
    project: 'Mobile App Development',
    assignees: [
      { name: 'John Doe' },
      { name: 'Robert Johnson' },
    ],
    completed: false,
    dependencies: [
      { taskId: '5', type: 'blocking' }
    ]
  },
  {
    id: '3',
    title: 'Optimize database queries',
    status: 'in-review',
    priority: 'medium',
    dueDate: '2023-11-03',
    project: 'Website Redesign',
    assignees: [
      { name: 'Michael Brown' },
    ],
    completed: false,
    dependencies: [
      { taskId: '1', type: 'related' }
    ]
  },
  {
    id: '4',
    title: 'Create social media graphics',
    description: 'Design promotional graphics for Facebook, Twitter, and Instagram',
    status: 'completed',
    priority: 'low',
    dueDate: '2023-10-28',
    project: 'Marketing Campaign',
    assignees: [
      { name: 'Emily Davis' },
    ],
    completed: true
  },
  {
    id: '5',
    title: 'Write API documentation',
    status: 'to-do',
    priority: 'low',
    dueDate: '2023-11-15',
    project: 'Mobile App Development',
    assignees: [
      { name: 'Robert Johnson' },
    ],
    completed: false,
    dependencies: [
      { taskId: '3', type: 'waiting-on' }
    ]
  },
];
