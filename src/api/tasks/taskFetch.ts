
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/lib/types/task';
import { formatAssignees } from './utils';

/**
 * Mock data for task testing
 */
const mockTasks: Task[] = [
  {
    id: '1',
    project_id: 'project-1',
    title: 'Design homepage',
    description: 'Create wireframes and mockups for the homepage',
    status: 'in-progress',
    priority: 'high',
    due_date: '2025-05-15',
    completed: false,
    assignees: [{ id: 'user-1', name: 'John Doe' }]
  },
  {
    id: '2',
    project_id: 'project-1',
    title: 'Implement authentication',
    description: 'Set up user login and registration',
    status: 'to-do',
    priority: 'medium',
    due_date: '2025-05-20',
    completed: false,
    assignees: [{ id: 'user-2', name: 'Jane Smith' }]
  }
];

/**
 * Fetch all tasks for a project
 */
export const fetchProjectTasks = async (projectId: string): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        task_assignees(user_id, profiles:user_id(id, full_name, avatar_url))
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
    
    // Map the data to our Task interface
    return (data || []).map((task: any) => {
      // Extract assignees from the task_assignees relation
      const assignees = task.task_assignees?.map((assignee: any) => ({
        id: assignee.profiles?.id || assignee.user_id,
        name: assignee.profiles?.full_name || 'Unknown User',
        avatar: assignee.profiles?.avatar_url
      })) || [];
      
      return {
        id: task.id,
        project_id: task.project_id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date,
        completed: task.completed,
        completed_at: task.completed_at,
        created_at: task.created_at,
        assignees
      };
    });
  } catch (error) {
    console.error('Exception in fetchProjectTasks:', error);
    return [];
  }
};

/**
 * Fetch a single task by its ID
 */
export const fetchTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        task_assignees(user_id, profiles:user_id(id, full_name, avatar_url))
      `)
      .eq('id', taskId)
      .single();
    
    if (error || !data) {
      console.error('Error fetching task:', error);
      return null;
    }
    
    // Extract assignees from the task_assignees relation
    const assignees = data.task_assignees?.map((assignee: any) => ({
      id: assignee.profiles?.id || assignee.user_id,
      name: assignee.profiles?.full_name || 'Unknown User',
      avatar: assignee.profiles?.avatar_url
    })) || [];
    
    // Map to our Task interface
    return {
      id: data.id,
      project_id: data.project_id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      due_date: data.due_date,
      completed: data.completed,
      completed_at: data.completed_at,
      created_at: data.created_at,
      assignees
    };
  } catch (error) {
    console.error('Exception in fetchTaskById:', error);
    return null;
  }
};

/**
 * Get mock tasks for testing
 */
export const getMockTasks = (): Task[] => {
  return mockTasks;
};
