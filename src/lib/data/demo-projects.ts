
import { Project } from '../types/project';

export const demoProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of the corporate website with modern UI/UX',
    progress: 65,
    status: 'in-progress',
    dueDate: '2025-05-15',
    category: 'Development',
    project_type: 'Development',
    members: [
      { id: '1', name: 'John Doe', role: 'Project Manager' },
      { id: '2', name: 'Sarah Smith', role: 'Designer' },
      { id: '3', name: 'Michael Brown', role: 'Developer' }
    ],
    project_manager_id: '1',
    project_manager_name: 'John Doe',
    start_date: '2025-01-15',
    priority: 'high',
    estimated_cost: 25000,
    budget_approved: true,
    performance_index: 0.95
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Creating a mobile app for iOS and Android platforms',
    progress: 30,
    status: 'in-progress',
    dueDate: '2025-07-30',
    category: 'Development',
    project_type: 'Development',
    members: [
      { id: '1', name: 'John Doe', role: 'Project Manager' },
      { id: '4', name: 'Emily Johnson', role: 'Developer' },
      { id: '5', name: 'David Wilson', role: 'QA Tester' }
    ],
    project_manager_id: '1',
    project_manager_name: 'John Doe',
    start_date: '2025-03-01',
    priority: 'medium',
    estimated_cost: 40000,
    budget_approved: true,
    performance_index: 1.05
  },
  {
    id: '3',
    name: 'Brand Marketing Campaign',
    description: 'Developing and executing a comprehensive marketing strategy',
    progress: 80,
    status: 'in-progress',
    dueDate: '2025-05-01',
    category: 'Marketing',
    project_type: 'Marketing',
    members: [
      { id: '6', name: 'Lisa Anderson', role: 'Marketing Manager' },
      { id: '7', name: 'Robert Clark', role: 'Content Creator' },
      { id: '8', name: 'Jennifer Lee', role: 'Social Media Specialist' }
    ],
    project_manager_id: '6',
    project_manager_name: 'Lisa Anderson',
    start_date: '2025-02-01',
    priority: 'high',
    estimated_cost: 30000,
    budget_approved: true,
    performance_index: 1.2
  },
  {
    id: '4',
    name: 'Product Launch',
    description: 'Planning and executing the launch of our new product',
    progress: 45,
    status: 'in-progress',
    dueDate: '2025-08-20',
    category: 'Marketing',
    project_type: 'Marketing',
    members: [
      { id: '9', name: 'Thomas Harris', role: 'Product Manager' },
      { id: '6', name: 'Lisa Anderson', role: 'Marketing Manager' },
      { id: '10', name: 'Daniel Moore', role: 'Sales Representative' }
    ],
    project_manager_id: '9',
    project_manager_name: 'Thomas Harris',
    start_date: '2025-04-15',
    priority: 'urgent',
    estimated_cost: 50000,
    budget_approved: true,
    performance_index: 0.9
  },
  {
    id: '5',
    name: 'Office Relocation',
    description: 'Planning and executing office move to the new location',
    progress: 90,
    status: 'in-progress',
    dueDate: '2025-05-30',
    category: 'Operations',
    project_type: 'Operations',
    members: [
      { id: '11', name: 'Susan Taylor', role: 'Operations Manager' },
      { id: '12', name: 'James White', role: 'Logistics Coordinator' },
      { id: '13', name: 'Patricia Martin', role: 'Facilities Manager' }
    ],
    project_manager_id: '11',
    project_manager_name: 'Susan Taylor',
    start_date: '2025-01-02',
    priority: 'medium',
    estimated_cost: 35000,
    budget_approved: true,
    performance_index: 1.1
  }
];

export default demoProjects;
