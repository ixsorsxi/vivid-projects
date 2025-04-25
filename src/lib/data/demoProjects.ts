
import { Project } from '@/lib/types/project';

export const demoProjects: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Redesigning the company website with modern UI/UX',
    status: 'in-progress',
    progress: 65,
    due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    updated_at: new Date().toISOString(),
    user_id: 'user1',
    team: [
      { id: 'u1', name: 'Alex Johnson', role: 'Project Manager', avatar: '/avatars/user1.png' },
      { id: 'u2', name: 'Sarah Wilson', role: 'Designer', avatar: '/avatars/user2.png' },
      { id: 'u3', name: 'David Chen', role: 'Developer', avatar: '/avatars/user3.png' }
    ]
  },
  {
    id: 'p2',
    name: 'Mobile App Development',
    description: 'Creating a native mobile app for iOS and Android',
    status: 'in-progress',
    progress: 40,
    due_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    updated_at: new Date().toISOString(),
    user_id: 'user1',
    team: [
      { id: 'u1', name: 'Alex Johnson', role: 'Project Manager', avatar: '/avatars/user1.png' },
      { id: 'u4', name: 'Lisa Park', role: 'UI/UX Designer', avatar: '/avatars/user4.png' },
      { id: 'u5', name: 'Michael Roberts', role: 'iOS Developer', avatar: '/avatars/user5.png' },
      { id: 'u6', name: 'Emma Davis', role: 'Android Developer', avatar: '/avatars/user6.png' }
    ]
  },
  {
    id: 'p3',
    name: 'Marketing Campaign',
    description: 'Q2 marketing campaign for new product launch',
    status: 'not-started',
    progress: 0,
    due_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updated_at: new Date().toISOString(),
    user_id: 'user2',
    team: [
      { id: 'u7', name: 'Jennifer Smith', role: 'Marketing Manager', avatar: '/avatars/user7.png' },
      { id: 'u8', name: 'Robert Brown', role: 'Content Writer', avatar: '/avatars/user8.png' },
      { id: 'u9', name: 'Patricia Miller', role: 'Social Media Specialist', avatar: '/avatars/user9.png' }
    ]
  },
  {
    id: 'p4',
    name: 'Database Migration',
    description: 'Migrating from MySQL to PostgreSQL',
    status: 'completed',
    progress: 100,
    due_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    user_id: 'user1',
    team: [
      { id: 'u3', name: 'David Chen', role: 'Lead Developer', avatar: '/avatars/user3.png' },
      { id: 'u10', name: 'Thomas Wilson', role: 'Database Administrator', avatar: '/avatars/user10.png' }
    ]
  },
  {
    id: 'p5',
    name: 'Product Launch',
    description: 'Launching the new SaaS platform',
    status: 'on-hold',
    progress: 75,
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    updated_at: new Date().toISOString(),
    user_id: 'user3',
    team: [
      { id: 'u1', name: 'Alex Johnson', role: 'Project Manager', avatar: '/avatars/user1.png' },
      { id: 'u7', name: 'Jennifer Smith', role: 'Marketing Manager', avatar: '/avatars/user7.png' },
      { id: 'u3', name: 'David Chen', role: 'Lead Developer', avatar: '/avatars/user3.png' },
      { id: 'u11', name: 'Olivia Jones', role: 'QA Tester', avatar: '/avatars/user11.png' }
    ]
  }
];
