
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/lib/data';
import { getDemoTasks } from './demoData';

// Convert database task to app model
const mapDbTaskToAppTask = (dbTask: any): Task => ({
  id: dbTask.id,
  title: dbTask.title,
  description: dbTask.description || '',
  status: dbTask.status,
  priority: dbTask.priority,
  dueDate: dbTask.due_date,
  completed: dbTask.completed,
  project: dbTask.project_id, // Map to project property
  assignees: [{ name: 'Assigned User' }] // Simplified assignees
});

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }

    return data.map(mapDbTaskToAppTask);
  } catch (e) {
    console.error('Unexpected error in fetchTasks:', e);
    return [];
  }
};

export const fetchTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) {
      console.error('Error fetching task:', error);
      return null;
    }

    return mapDbTaskToAppTask(data);
  } catch (e) {
    console.error('Unexpected error in fetchTaskById:', e);
    return null;
  }
};

export const fetchTasksByProject = async (projectId: string): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        id,
        title,
        description,
        status,
        priority,
        due_date,
        completed,
        project_id
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching project tasks:', error);
      return [];
    }

    // Convert from database model to app model
    return data.map(mapDbTaskToAppTask);
  } catch (e) {
    console.error('Error in fetchTasksByProject:', e);
    return [];
  }
};

// Utility function to fetch user tasks, with fallback to demo data
export const fetchUserTasks = async (): Promise<Task[]> => {
  try {
    // Try to get tasks from the database
    const tasks = await fetchTasks();
    
    // If we got tasks successfully, return them, otherwise use demo tasks
    return tasks.length > 0 ? tasks : getDemoTasks();
  } catch (error) {
    console.error('Error in fetchUserTasks:', error);
    
    // Return demo tasks as fallback
    return getDemoTasks().slice(0, 2); // Just return 2 demo tasks in case of error
  }
};
