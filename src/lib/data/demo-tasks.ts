
import { Task } from '../types/task';

export const demoTasks: Task[] = [
  {
    id: '1',
    project_id: '1',
    title: 'Design Homepage Mockup',
    description: 'Create visual mockups for the new homepage design',
    status: 'done',
    priority: 'high',
    due_date: '2025-04-15',
    completed: true,
    completed_at: '2025-04-10T15:30:00Z',
    assignees: [
      { id: '2', name: 'Sarah Smith', avatar: '/avatars/sarah.jpg' }
    ]
  },
  {
    id: '2',
    project_id: '1',
    title: 'Develop Homepage',
    description: 'Implement the homepage based on approved designs',
    status: 'in-progress',
    priority: 'high',
    due_date: '2025-04-25',
    completed: false,
    assignees: [
      { id: '3', name: 'Michael Brown', avatar: '/avatars/michael.jpg' }
    ]
  },
  {
    id: '3',
    project_id: '1',
    title: 'Create Responsive Components',
    description: 'Develop reusable components that work on all device sizes',
    status: 'to-do',
    priority: 'medium',
    due_date: '2025-05-05',
    completed: false,
    assignees: [
      { id: '3', name: 'Michael Brown', avatar: '/avatars/michael.jpg' }
    ]
  },
  {
    id: '4',
    project_id: '2',
    title: 'Design App Wireframes',
    description: 'Create wireframes for all main screens in the app',
    status: 'done',
    priority: 'high',
    due_date: '2025-04-10',
    completed: true,
    completed_at: '2025-04-09T11:20:00Z',
    assignees: [
      { id: '2', name: 'Sarah Smith', avatar: '/avatars/sarah.jpg' }
    ]
  },
  {
    id: '5',
    project_id: '2',
    title: 'Develop Authentication Module',
    description: 'Implement user authentication including login, registration and password reset',
    status: 'in-progress',
    priority: 'high',
    due_date: '2025-04-25',
    completed: false,
    assignees: [
      { id: '4', name: 'Emily Johnson', avatar: '/avatars/emily.jpg' }
    ]
  },
  {
    id: '6',
    project_id: '2',
    title: 'Create User Profile Screen',
    description: 'Develop the user profile screen with edit functionality',
    status: 'to-do',
    priority: 'medium',
    due_date: '2025-05-10',
    completed: false,
    assignees: [
      { id: '4', name: 'Emily Johnson', avatar: '/avatars/emily.jpg' }
    ]
  },
  {
    id: '7',
    project_id: '3',
    title: 'Develop Marketing Strategy',
    description: 'Create comprehensive marketing strategy document',
    status: 'done',
    priority: 'high',
    due_date: '2025-03-15',
    completed: true,
    completed_at: '2025-03-14T16:45:00Z',
    assignees: [
      { id: '6', name: 'Lisa Anderson', avatar: '/avatars/lisa.jpg' }
    ]
  },
  {
    id: '8',
    project_id: '3',
    title: 'Create Social Media Content',
    description: 'Prepare content calendar for all social media platforms',
    status: 'in-progress',
    priority: 'medium',
    due_date: '2025-04-20',
    completed: false,
    assignees: [
      { id: '8', name: 'Jennifer Lee', avatar: '/avatars/jennifer.jpg' }
    ]
  },
  {
    id: '9',
    project_id: '3',
    title: 'Design Ad Creatives',
    description: 'Create visual assets for digital advertising campaign',
    status: 'to-do',
    priority: 'high',
    due_date: '2025-04-25',
    completed: false,
    assignees: [
      { id: '2', name: 'Sarah Smith', avatar: '/avatars/sarah.jpg' }
    ]
  },
  {
    id: '10',
    project_id: '4',
    title: 'Conduct Market Research',
    description: 'Analyze market trends and competitor products',
    status: 'done',
    priority: 'high',
    due_date: '2025-05-10',
    completed: true,
    completed_at: '2025-05-08T09:30:00Z',
    assignees: [
      { id: '9', name: 'Thomas Harris', avatar: '/avatars/thomas.jpg' }
    ]
  }
];

export default demoTasks;
