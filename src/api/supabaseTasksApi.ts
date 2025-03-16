
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/lib/data';

export const fetchTasks = async (): Promise<Task[]> => {
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
      project_id,
      task_assignees (
        id,
        user_id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  // Convert from database model to app model
  return data.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    dueDate: task.due_date,
    completed: task.completed,
    projectId: task.project_id,
    assignees: task.task_assignees?.map((assignee: any) => ({
      id: assignee.user_id
    })) || []
  }));
};

export const fetchTaskById = async (taskId: string): Promise<Task | null> => {
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
      project_id,
      task_assignees (
        id,
        user_id
      )
    `)
    .eq('id', taskId)
    .single();

  if (error) {
    console.error('Error fetching task:', error);
    return null;
  }

  // Convert from database model to app model
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    status: data.status,
    priority: data.priority,
    dueDate: data.due_date,
    completed: data.completed,
    projectId: data.project_id,
    assignees: data.task_assignees?.map((assignee: any) => ({
      id: assignee.user_id
    })) || []
  };
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.dueDate,
      completed: task.completed || false,
      project_id: task.projectId,
      user_id: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    return null;
  }

  // Create task assignees if provided
  if (task.assignees && task.assignees.length > 0) {
    const assigneesData = task.assignees.map(assignee => ({
      task_id: data.id,
      user_id: assignee.id
    }));

    const { error: assigneesError } = await supabase
      .from('task_assignees')
      .insert(assigneesData);

    if (assigneesError) {
      console.error('Error adding task assignees:', assigneesError);
    }
  }

  // Return the newly created task
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    status: data.status,
    priority: data.priority,
    dueDate: data.due_date,
    completed: data.completed,
    projectId: data.project_id,
    assignees: task.assignees || []
  };
};

export const updateTask = async (taskId: string, task: Partial<Task>): Promise<Task | null> => {
  // Update the main task data
  const { data, error } = await supabase
    .from('tasks')
    .update({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.dueDate,
      completed: task.completed
    })
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    return null;
  }

  // Update assignees if provided
  if (task.assignees) {
    // First remove all existing assignees
    const { error: deleteError } = await supabase
      .from('task_assignees')
      .delete()
      .eq('task_id', taskId);

    if (deleteError) {
      console.error('Error deleting task assignees:', deleteError);
    }

    // Then add the new ones
    if (task.assignees.length > 0) {
      const assigneesData = task.assignees.map(assignee => ({
        task_id: taskId,
        user_id: assignee.id
      }));

      const { error: assigneesError } = await supabase
        .from('task_assignees')
        .insert(assigneesData);

      if (assigneesError) {
        console.error('Error adding task assignees:', assigneesError);
      }
    }
  }

  // Return the updated task
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    status: data.status,
    priority: data.priority,
    dueDate: data.due_date,
    completed: data.completed,
    projectId: data.project_id,
    assignees: task.assignees || []
  };
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  // Delete the task (cascade will handle related records)
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error.message);
    return false;
  }

  return true;
};

export const toggleTaskStatus = async (taskId: string, completed: boolean): Promise<boolean> => {
  const { error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', taskId);

  if (error) {
    console.error('Error toggling task status:', error);
    return false;
  }

  return true;
};

export const fetchTasksByProject = async (projectId: string): Promise<Task[]> => {
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
      project_id,
      task_assignees (
        id,
        user_id
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching project tasks:', error);
    return [];
  }

  // Convert from database model to app model
  return data.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    dueDate: task.due_date,
    completed: task.completed,
    projectId: task.project_id,
    assignees: task.task_assignees?.map((assignee: any) => ({
      id: assignee.user_id
    })) || []
  }));
};
