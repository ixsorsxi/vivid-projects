
import { Project } from '../types/project';

export const demoProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    description: 'Complete redesign of company website with modern UI/UX',
    status: 'in-progress',
    dueDate: '2025-06-15',
    progress: 35,
    userId: 'user-1',
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2025-04-28T09:00:00Z',
    budget: 15000,
    category: 'web-development',
    code: 'WR-2025',
    is_private: false
  },
  {
    id: 'project-2',
    name: 'API Development',
    description: 'Design and implement RESTful API for mobile applications',
    status: 'in-progress',
    dueDate: '2025-07-01',
    progress: 20,
    userId: 'user-2',
    created_at: '2025-03-15T00:00:00Z',
    updated_at: '2025-04-28T10:00:00Z',
    budget: 12000,
    category: 'backend',
    code: 'API-2025',
    is_private: false
  },
  {
    id: 'project-3',
    name: 'Infrastructure Setup',
    description: 'Set up cloud infrastructure for scalable deployment',
    status: 'in-progress',
    dueDate: '2025-06-01',
    progress: 45,
    userId: 'user-3',
    created_at: '2025-02-20T00:00:00Z',
    updated_at: '2025-04-28T11:00:00Z',
    budget: 18000,
    category: 'devops',
    code: 'INF-2025',
    is_private: false
  },
  {
    id: 'project-4',
    name: 'Product Launch',
    description: 'Plan and execute product launch strategy',
    status: 'in-progress',
    dueDate: '2025-05-20',
    progress: 65,
    userId: 'user-4',
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-04-28T12:00:00Z',
    budget: 25000,
    category: 'marketing',
    code: 'PL-2025',
    is_private: true
  },
  {
    id: 'project-5',
    name: 'User Research',
    description: 'Conduct user research and analysis for product improvement',
    status: 'completed',
    dueDate: '2025-04-30',
    progress: 100,
    userId: 'user-5',
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2025-04-28T13:00:00Z',
    budget: 8000,
    category: 'research',
    code: 'UR-2025',
    is_private: false
  }
];

export default demoProjects;
