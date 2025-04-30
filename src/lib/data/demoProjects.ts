
import { Project } from '@/lib/types/project';

export const demoProjects: Project[] = [
  {
    id: '1',
    name: 'E-Commerce Platform Redesign',
    description: 'Redesign the user interface of our e-commerce platform to improve conversion rates and user experience.',
    status: 'in-progress',
    progress: 65,
    priority: 'high',
    dueDate: '2024-06-30',
    category: 'Design',
    project_type: 'Web Development',
    members: [
      { id: 'user1', name: 'Alice Johnson', role: 'Project Manager', avatar: '/avatars/user1.png' },
      { id: 'user2', name: 'Bob Smith', role: 'UI Designer', avatar: '/avatars/user2.png' },
      { id: 'user3', name: 'Carol Williams', role: 'UX Researcher', avatar: '/avatars/user3.png' }
    ],
    estimated_cost: 25000
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Develop a new mobile application for both iOS and Android platforms to complement our existing web services.',
    status: 'not-started',
    progress: 0,
    priority: 'medium',
    dueDate: '2024-08-15',
    category: 'Development',
    project_type: 'Mobile App',
    members: [
      { id: 'user1', name: 'Alice Johnson', role: 'Project Manager', avatar: '/avatars/user1.png' },
      { id: 'user4', name: 'Dave Brown', role: 'iOS Developer', avatar: '/avatars/user4.png' },
      { id: 'user5', name: 'Eve Davis', role: 'Android Developer', avatar: '/avatars/user5.png' }
    ],
    estimated_cost: 40000
  },
  {
    id: '3',
    name: 'Marketing Campaign for Q2',
    description: 'Plan and execute a comprehensive marketing campaign for the second quarter to boost sales and brand awareness.',
    status: 'completed',
    progress: 100,
    priority: 'high',
    dueDate: '2024-03-31',
    category: 'Marketing',
    project_type: 'Campaign',
    members: [
      { id: 'user6', name: 'Frank Miller', role: 'Marketing Director', avatar: '/avatars/user6.png' },
      { id: 'user7', name: 'Grace Lee', role: 'Content Writer', avatar: '/avatars/user7.png' },
      { id: 'user8', name: 'Henry Wilson', role: 'SEO Specialist', avatar: '/avatars/user8.png' }
    ],
    estimated_cost: 15000
  },
  {
    id: '4',
    name: 'Database Optimization',
    description: 'Optimize our database structure and queries to improve application performance and reduce server load.',
    status: 'in-progress',
    progress: 35,
    priority: 'medium',
    dueDate: '2024-05-15',
    category: 'Development',
    project_type: 'Infrastructure',
    members: [
      { id: 'user9', name: 'Irene Garcia', role: 'Database Administrator', avatar: '/avatars/user9.png' },
      { id: 'user10', name: 'Jack Thompson', role: 'Backend Developer', avatar: '/avatars/user10.png' }
    ],
    estimated_cost: 8000
  },
  {
    id: '5',
    name: 'Customer Support Portal',
    description: 'Create a self-service customer support portal to reduce support tickets and improve customer satisfaction.',
    status: 'on-hold',
    progress: 20,
    priority: 'low',
    dueDate: '2024-07-30',
    category: 'Support',
    project_type: 'Web Application',
    members: [
      { id: 'user1', name: 'Alice Johnson', role: 'Project Manager', avatar: '/avatars/user1.png' },
      { id: 'user11', name: 'Karen Martinez', role: 'Support Manager', avatar: '/avatars/user11.png' },
      { id: 'user12', name: 'Leo Anderson', role: 'UX Designer', avatar: '/avatars/user12.png' }
    ],
    estimated_cost: 18000
  }
];
