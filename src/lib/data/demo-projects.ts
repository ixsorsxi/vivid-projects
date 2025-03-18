
import { Project } from '../types/project';

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
