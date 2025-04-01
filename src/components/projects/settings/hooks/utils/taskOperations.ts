
import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes all task assignees for tasks in a project
 */
export const deleteTaskAssignees = async (taskIds: string[]): Promise<boolean> => {
  if (taskIds.length === 0) return true;
  
  try {
    const { error } = await supabase
      .from('task_assignees')
      .delete()
      .in('task_id', taskIds);
    
    if (error) {
      console.error("Error deleting task assignees:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in deleteTaskAssignees:", error);
    return false;
  }
};

/**
 * Deletes all task dependencies for tasks in a project
 */
export const deleteTaskDependencies = async (taskIds: string[]): Promise<boolean> => {
  if (taskIds.length === 0) return true;
  
  try {
    // Delete dependencies where task is either the source or target
    const { error } = await supabase
      .from('task_dependencies')
      .delete()
      .or(`task_id.in.(${taskIds.join(',')}),dependency_task_id.in.(${taskIds.join(',')})`);
    
    if (error) {
      console.error("Error deleting task dependencies:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in deleteTaskDependencies:", error);
    return false;
  }
};

/**
 * Deletes all subtasks for tasks in a project
 */
export const deleteTaskSubtasks = async (taskIds: string[]): Promise<boolean> => {
  if (taskIds.length === 0) return true;
  
  try {
    const { error } = await supabase
      .from('task_subtasks')
      .delete()
      .in('parent_task_id', taskIds);
    
    if (error) {
      console.error("Error deleting subtasks:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in deleteTaskSubtasks:", error);
    return false;
  }
};

/**
 * Deletes the tasks themselves
 */
export const deleteTasks = async (projectId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('project_id', projectId);
    
    if (error) {
      console.error("Error deleting tasks:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in deleteTasks:", error);
    return false;
  }
};

/**
 * Gets all task IDs for a project
 */
export const getProjectTaskIds = async (projectId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('id')
      .eq('project_id', projectId);
    
    if (error) {
      console.error("Error fetching project tasks:", error);
      return [];
    }
    
    return data.map(task => task.id);
  } catch (error) {
    console.error("Exception in getProjectTaskIds:", error);
    return [];
  }
};

/**
 * Orchestrates the deletion of all task-related data for a project
 */
export const deleteProjectTasks = async (projectId: string): Promise<boolean> => {
  try {
    // Get all task IDs for this project
    const taskIds = await getProjectTaskIds(projectId);
    console.log(`Found ${taskIds.length} tasks to delete`);
    
    if (taskIds.length > 0) {
      // Delete task assignees
      const assigneesDeleted = await deleteTaskAssignees(taskIds);
      if (!assigneesDeleted) {
        return false;
      }
      
      // Delete task dependencies
      const dependenciesDeleted = await deleteTaskDependencies(taskIds);
      if (!dependenciesDeleted) {
        return false;
      }
      
      // Delete task subtasks
      const subtasksDeleted = await deleteTaskSubtasks(taskIds);
      if (!subtasksDeleted) {
        return false;
      }
    }
    
    // Delete tasks
    return await deleteTasks(projectId);
  } catch (error) {
    console.error("Exception in deleteProjectTasks:", error);
    return false;
  }
};
