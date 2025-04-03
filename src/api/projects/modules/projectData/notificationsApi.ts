import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  relatedToId?: string;
  relatedToType?: 'project' | 'task' | 'milestone' | 'team' | 'system';
  isRead: boolean;
  createdAt: string;
}

interface DbNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  related_to_id: string | null;
  related_to_type: string | null;
  is_read: boolean;
  created_at: string;
}

/**
 * Fetches notifications for the current user
 */
export const fetchUserNotifications = async (): Promise<Notification[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user?.id) {
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

    return data.map((notification: DbNotification) => ({
      id: notification.id,
      userId: notification.user_id,
      title: notification.title,
      message: notification.message,
      type: validateNotificationType(notification.type),
      relatedToId: notification.related_to_id || undefined,
      relatedToType: notification.related_to_type as Notification['relatedToType'] || undefined,
      isRead: notification.is_read,
      createdAt: notification.created_at
    }));
  } catch (error) {
    console.error('Error in fetchUserNotifications:', error);
    return [];
  }
};

function validateNotificationType(type: string): 'info' | 'success' | 'warning' | 'error' {
  if (['info', 'success', 'warning', 'error'].includes(type)) {
    return type as 'info' | 'success' | 'warning' | 'error';
  }
  return 'info'; // Default fallback
}

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
 * Marks all notifications as read for the current user
 */
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user?.id) {
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
 * Creates a new notification for a user
 */
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  relatedToId?: string,
  relatedToType?: 'project' | 'task' | 'milestone' | 'team' | 'system'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        related_to_id: relatedToId,
        related_to_type: relatedToType,
        is_read: false
      });

    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createNotification:', error);
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
 * Sends a toast notification and optionally creates a database notification
 */
export const sendNotification = async (
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  options?: {
    persist?: boolean;
    userId?: string;
    relatedToId?: string;
    relatedToType?: 'project' | 'task' | 'milestone' | 'team' | 'system';
  }
): Promise<boolean> => {
  // Always show a toast notification
  switch (type) {
    case 'success':
      toast.success(title, { description: message });
      break;
    case 'error':
      toast.error(title, { description: message });
      break;
    default:
      toast(title, { description: message, variant: type === 'warning' ? 'destructive' : 'default' });
  }

  // If we need to persist the notification and we have a user ID, create a database entry
  if (options?.persist && options.userId) {
    return await createNotification(
      options.userId,
      title,
      message,
      type,
      options.relatedToId,
      options.relatedToType
    );
  }

  return true;
};
