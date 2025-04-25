
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification,
  Notification,
  sendNotification
} from '@/api/projects/modules/projectData/notificationsApi';
import { useAuth } from '@/context/auth/AuthContext';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (notificationId: string) => Promise<void>;
  sendNotification: (
    title: string,
    message: string,
    type?: 'info' | 'success' | 'warning' | 'error',
    options?: {
      persist?: boolean;
      relatedToId?: string;
      relatedToType?: 'project' | 'task' | 'milestone' | 'team' | 'system';
    }
  ) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const refreshNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await fetchUserNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    }
  };

  const markAllAsRead = async () => {
    const success = await markAllNotificationsAsRead();
    if (success) {
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
    }
  };

  const removeNotification = async (notificationId: string) => {
    const success = await deleteNotification(notificationId);
    if (success) {
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
    }
  };

  const sendUserNotification = async (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    options?: {
      persist?: boolean;
      relatedToId?: string;
      relatedToType?: 'project' | 'task' | 'milestone' | 'team' | 'system';
    }
  ) => {
    if (!user) return;
    
    await sendNotification(title, message, type, {
      ...options,
      userId: user.id
    });
    
    if (options?.persist) {
      refreshNotifications();
    }
  };

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        removeNotification,
        sendNotification: sendUserNotification
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
