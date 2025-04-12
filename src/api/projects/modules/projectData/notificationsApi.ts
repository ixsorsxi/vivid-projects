
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  userId: string;
  isRead: boolean;
  createdAt: string;
  relatedToId?: string;
  relatedToType?: 'project' | 'task' | 'milestone' | 'team' | 'system';
  persist?: boolean;
}

/**
 * Fetches all notifications for the current user
 */
export const fetchUserNotifications = async (): Promise<Notification[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user || !user.user) {
      console.error('No authenticated user found');
      return [];
    }
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    
    // Transform from database format to frontend format
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      message: item.message,
      type: item.type as 'info' | 'success' | 'warning' | 'error',
      userId: item.user_id,
      isRead: item.is_read,
      createdAt: item.created_at,
      relatedToId: item.related_to_id,
      relatedToType: item.related_to_type as 'project' | 'task' | 'milestone' | 'team' | 'system',
      persist: true
    }));
  } catch (error) {
    console.error('Error in fetchUserNotifications:', error);
    return [];
  }
};

/**
 * Marks a notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    return false;
  }
};

/**
 * Marks all notifications for the current user as read
 */
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user || !user.user) {
      console.error('No authenticated user found');
      return false;
    }
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.user.id)
      .eq('is_read', false);
    
    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markAllNotificationsAsRead:', error);
    return false;
  }
};

/**
 * Deletes a notification
 */
export const deleteNotification = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteNotification:', error);
    return false;
  }
};

/**
 * Sends a notification to a user
 */
export const sendNotification = async (
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  options?: {
    userId?: string;
    persist?: boolean;
    relatedToId?: string;
    relatedToType?: 'project' | 'task' | 'milestone' | 'team' | 'system';
  }
): Promise<boolean> => {
  try {
    // For non-persistent notifications (UI only), just return success
    if (options?.persist === false) {
      return true;
    }
    
    // If no user ID is provided, get the current user
    let userId = options?.userId;
    if (!userId) {
      const { data: user } = await supabase.auth.getUser();
      if (!user || !user.user) {
        console.error('No authenticated user found and no userId provided');
        return false;
      }
      userId = user.user.id;
    }
    
    const { error } = await supabase
      .from('notifications')
      .insert({
        title,
        message,
        type,
        user_id: userId,
        is_read: false,
        related_to_id: options?.relatedToId,
        related_to_type: options?.relatedToType
      });
    
    if (error) {
      console.error('Error sending notification:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in sendNotification:', error);
    return false;
  }
};

/**
 * Fetches notifications for a specific project
 */
export const getProjectNotifications = async (projectId: string): Promise<Notification[]> => {
  try {
    if (!projectId) {
      console.error('No project ID provided for fetching notifications');
      return [];
    }
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('related_to_id', projectId)
      .eq('related_to_type', 'project')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching project notifications:', error);
      return [];
    }
    
    // Transform from database format to frontend format
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      message: item.message,
      type: item.type as 'info' | 'success' | 'warning' | 'error',
      userId: item.user_id,
      isRead: item.is_read,
      createdAt: item.created_at,
      relatedToId: item.related_to_id,
      relatedToType: item.related_to_type as 'project' | 'task' | 'milestone' | 'team' | 'system',
      persist: true
    }));
  } catch (error) {
    console.error('Error in getProjectNotifications:', error);
    return [];
  }
};
