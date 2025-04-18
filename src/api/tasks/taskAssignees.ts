
import { supabase } from '@/integrations/supabase/client';
import { Assignee } from '@/lib/types/task';

export const fetchAvailableUsers = async (): Promise<Assignee[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url');
    
    if (error) {
      console.error('Error fetching available users:', error);
      return [];
    }
    
    // Convert the database response to our Assignee type
    return data.map(user => ({
      id: user.id,
      name: user.full_name || 'Unknown User',
      avatar: user.avatar_url
    }));
  } catch (error) {
    console.error('Exception in fetchAvailableUsers:', error);
    return [];
  }
};

export const fetchTaskAssignees = async (taskId: string): Promise<Assignee[]> => {
  try {
    // Fetch the assignees for this task
    const { data, error } = await supabase
      .from('task_assignees')
      .select('user_id')
      .eq('task_id', taskId);
    
    if (error) {
      console.error('Error fetching task assignees:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Extract the user IDs
    const userIds = data.map(assignee => assignee.user_id);
    
    // Fetch the user details
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', userIds);
    
    if (usersError) {
      console.error('Error fetching assignee details:', usersError);
      return [];
    }
    
    // Convert to our Assignee type
    return users.map(user => ({
      id: user.id,
      name: user.full_name || 'Unknown User',
      avatar: user.avatar_url
    }));
  } catch (error) {
    console.error('Exception in fetchTaskAssignees:', error);
    return [];
  }
};
