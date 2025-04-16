
import { supabase } from '@/integrations/supabase/client';
import { Task, Assignee } from '@/lib/types/task';

/**
 * Fetches assignees for a task
 */
export const fetchTaskAssignees = async (taskId: string): Promise<Assignee[]> => {
  try {
    const { data, error } = await supabase
      .from('task_assignees')
      .select('users:user_id(id, name, avatar_url)')
      .eq('task_id', taskId);

    if (error) {
      console.error('Error fetching task assignees:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Map the data to match our Assignee interface
    return data.map(item => ({
      id: item.users.id,
      name: item.users.name,
      avatar: item.users.avatar_url
    }));
  } catch (error) {
    console.error('Exception in fetchTaskAssignees:', error);
    return [];
  }
};

/**
 * Formats a task to ensure it matches our Task interface
 */
export const formatTaskResponse = (taskData: any): Task => {
  return {
    id: taskData.id,
    project_id: taskData.project_id,
    title: taskData.title,
    description: taskData.description || '',
    status: taskData.status,
    priority: taskData.priority,
    due_date: taskData.due_date || null,
    completed: taskData.completed || false,
    completed_at: taskData.completed_at || null,
    created_at: taskData.created_at || null,
    assignees: taskData.assignees || []
  };
};
