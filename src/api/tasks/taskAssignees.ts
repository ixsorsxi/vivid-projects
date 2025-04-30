
// This file contains functions related to task assignees management

import { supabase } from '@/integrations/supabase/client';

/**
 * Assigns a user to a task
 */
export const assignUserToTask = async (taskId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_assignees')
      .insert({ task_id: taskId, user_id: userId });
    
    return !error;
  } catch (e) {
    console.error('Error assigning user to task:', e);
    return false;
  }
};

/**
 * Removes a user assignment from a task
 */
export const removeUserFromTask = async (taskId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('task_assignees')
      .delete()
      .eq('task_id', taskId)
      .eq('user_id', userId);
    
    return !error;
  } catch (e) {
    console.error('Error removing user from task:', e);
    return false;
  }
};

/**
 * Gets all assignees for a task
 */
export const getTaskAssignees = async (taskId: string) => {
  try {
    const { data, error } = await supabase
      .from('task_assignees')
      .select('users:user_id(id, name, avatar_url)')
      .eq('task_id', taskId);
    
    if (error) throw error;
    
    return data.map((item: any) => ({
      id: item.users?.id || '',
      name: item.users?.name || 'Unknown',
      avatar: item.users?.avatar_url
    }));
  } catch (e) {
    console.error('Error getting task assignees:', e);
    return [];
  }
};

/**
 * Gets all tasks assigned to a user
 */
export const getUserAssignedTasks = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('task_assignees')
      .select('tasks:task_id(*)')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data.map((item: any) => item.tasks);
  } catch (e) {
    console.error('Error getting user assigned tasks:', e);
    return [];
  }
};

/**
 * Fetches available users that can be assigned to tasks
 */
export const fetchAvailableUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name')
      .order('full_name');
    
    if (error) throw error;
    
    return data.map((user: any) => ({
      id: user.id,
      name: user.full_name || 'Unnamed User'
    }));
  } catch (e) {
    console.error('Error fetching available users:', e);
    return [];
  }
};
