
import { Project } from '@/lib/types/project';

/**
 * Returns demo projects for cases where database access fails
 */
export const getDemoProjects = (): Project[] => {
  return [
    {
      id: 'demo-1',
      name: 'Website Redesign',
      description: 'Redesign the company website with modern UI/UX',
      progress: 65,
      status: 'in-progress',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Design',
      project_type: 'Design',
      members: [
        { id: 'user1', name: 'John Doe', role: 'Project Manager' },
        { id: 'user2', name: 'Jane Smith', role: 'Designer' }
      ],
      project_manager_id: 'user1',
      project_manager_name: 'John Doe'
    },
    {
      id: 'demo-2',
      name: 'Mobile App Development',
      description: 'Develop a mobile app for customer engagement',
      progress: 30,
      status: 'in-progress',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Development',
      project_type: 'Development',
      members: [
        { id: 'user1', name: 'John Doe', role: 'Product Owner' },
        { id: 'user3', name: 'Mike Johnson', role: 'Developer' }
      ],
      project_manager_id: 'user1',
      project_manager_name: 'John Doe'
    },
    {
      id: 'demo-3',
      name: 'Marketing Campaign',
      description: 'Q3 Marketing Campaign for new product launch',
      progress: 100,
      status: 'completed',
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Marketing',
      project_type: 'Marketing',
      members: [
        { id: 'user4', name: 'Sarah Williams', role: 'Marketing Lead' },
        { id: 'user5', name: 'James Brown', role: 'Content Creator' }
      ],
      project_manager_id: 'user4',
      project_manager_name: 'Sarah Williams'
    }
  ];
};
