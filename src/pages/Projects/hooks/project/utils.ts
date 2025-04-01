
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/lib/types/task';
import { Assignee } from '@/lib/types/common';

/**
 * Fetches tasks for a specific project
 */
export const fetchProjectTasks = async (projectId: string): Promise<Task[]> => {
  if (!projectId) return [];
  
  try {
    const { data, error } = await supabase
      .rpc('get_project_tasks', { p_project_id: projectId });
    
    if (error) {
      console.error('Error fetching project tasks:', error);
      return [];
    }
    
    // Transform the tasks to include required properties from Task type
    return (data || []).map(task => ({
      ...task,
      assignees: [] as Assignee[],
      subtasks: [],
      dependencies: []
    })) as Task[];
  } catch (err) {
    console.error('Error fetching project tasks:', err);
    return [];
  }
};
