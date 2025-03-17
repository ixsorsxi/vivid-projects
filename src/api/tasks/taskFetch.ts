
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/lib/data';

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

export const fetchTasks = async (userId?: string): Promise<Task[]> => {
  try {
    if (!userId) {
      console.log('No user ID provided for fetchTasks');
      return [];
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
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

export const fetchTasksByProject = async (projectId: string, userId?: string): Promise<Task[]> => {
  try {
    let query = supabase
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
      .eq('project_id', projectId);
    
    // If userId is provided, filter by user_id as well
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

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

// Utility function to fetch user tasks
export const fetchUserTasks = async (userId?: string): Promise<Task[]> => {
  try {
    if (!userId) {
      console.log('No user ID provided for fetchUserTasks');
      return [];
    }
    
    // Fetch the user's tasks from the database
    console.log('Fetching tasks for user:', userId);
    const tasks = await fetchTasks(userId);
    console.log(`Found ${tasks.length} tasks for user`);
    return tasks;
  } catch (error) {
    console.error('Error in fetchUserTasks:', error);
    return [];
  }
};
