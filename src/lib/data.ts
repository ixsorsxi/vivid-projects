
export type ProjectStatus = 'not-started' | 'in-progress' | 'on-hold' | 'completed';
export type PriorityLevel = 'high' | 'medium' | 'low';
export type DependencyType = 'blocking' | 'waiting-on' | 'related';

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: ProjectStatus;
  dueDate: string;
  priority: PriorityLevel;
  members: { name: string }[];
}

export interface Assignee {
  name: string;
  avatar?: string;
}

export interface TaskDependency {
  taskId: string;
  type: DependencyType;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate: string;
  project: string;
  assignees: Assignee[];
  completed: boolean;
  parentId?: string; // For subtask relationship
  subtasks?: Task[]; // For parent-child relationship
  dependencies?: TaskDependency[]; // For task dependencies
}

export const demoProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Redesign and rebuild the company website with modern technologies and improved UX.',
    progress: 75,
    status: 'in-progress',
    dueDate: '2023-12-15',
    priority: 'high',
    members: [
      { name: 'John Doe' },
      { name: 'Jane Smith' },
      { name: 'Robert Johnson' },
      { name: 'Michael Brown' },
    ],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Create a mobile application for iOS and Android platforms to complement our web services.',
    progress: 40,
    status: 'in-progress',
    dueDate: '2024-02-28',
    priority: 'medium',
    members: [
      { name: 'Emily Davis' },
      { name: 'Jane Smith' },
      { name: 'Robert Johnson' },
    ],
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Launch a comprehensive marketing campaign targeting new market segments.',
    progress: 90,
    status: 'in-progress',
    dueDate: '2023-11-30',
    priority: 'medium',
    members: [
      { name: 'John Doe' },
      { name: 'Emily Davis' },
    ],
  },
  {
    id: '4',
    name: 'Product Launch',
    description: 'Prepare and execute the launch of our new flagship product.',
    progress: 20,
    status: 'not-started',
    dueDate: '2024-03-15',
    priority: 'high',
    members: [
      { name: 'Jane Smith' },
      { name: 'Michael Brown' },
      { name: 'Robert Johnson' },
      { name: 'John Doe' },
      { name: 'Emily Davis' },
    ],
  },
];

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
        description: 'Analyze 5-10 competitor dashboard designs',
        status: 'completed',
        priority: 'medium',
        dueDate: '2023-10-30',
        project: 'Website Redesign',
        assignees: [{ name: 'Jane Smith' }],
        completed: true,
        parentId: '1'
      },
      {
        id: '1-2',
        title: 'Create wireframes',
        description: 'Develop low-fidelity wireframes based on research',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2023-11-02',
        project: 'Website Redesign',
        assignees: [{ name: 'Jane Smith' }],
        completed: false,
        parentId: '1'
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
