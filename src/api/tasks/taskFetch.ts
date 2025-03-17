
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/lib/data';
import { getDemoTasks } from './demoData';
import { createTask } from './taskCrud';

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

// Function to assign demo tasks to a specific user in the database
const assignDemoTasksToUser = async (userId: string): Promise<Task[]> => {
  console.log('Assigning demo tasks to user:', userId);
  const demoTasks = getDemoTasks();
  const savedTasks: Task[] = [];
  
  // Create each demo task in the database
  for (const task of demoTasks) {
    const { title, description, status, priority, dueDate, completed, project } = task;
    
    try {
      const savedTask = await createTask(
        { title, description, status, priority, dueDate, completed, project, assignees: [{ name: 'Demo User' }] },
        userId
      );
      
      if (savedTask) {
        console.log('Assigned demo task to user:', savedTask.title);
        savedTasks.push(savedTask);
      }
    } catch (error) {
      console.error('Error assigning demo task to user:', error);
    }
  }
  
  return savedTasks;
};

// Utility function to fetch user tasks, with option to assign demo tasks to the current user
export const fetchUserTasks = async (userId?: string, assignDemoToCurrentUser: boolean = false): Promise<Task[]> => {
  try {
    if (!userId) {
      console.log('No user ID provided for fetchUserTasks, using demo data');
      return getDemoTasks();
    }
    
    // First check if the user already has tasks in the database
    console.log('Checking if user has tasks:', userId);
    const tasks = await fetchTasks(userId);
    
    // If user has no tasks and we want to assign demo tasks to current user
    if (tasks.length === 0 && assignDemoToCurrentUser) {
      console.log('No tasks found for user, assigning demo tasks');
      return await assignDemoTasksToUser(userId);
    } else {
      console.log(`Found ${tasks.length} existing tasks for user`);
      return tasks;
    }
  } catch (error) {
    console.error('Error in fetchUserTasks:', error);
    
    // Return demo tasks as fallback
    return getDemoTasks();
  }
};
