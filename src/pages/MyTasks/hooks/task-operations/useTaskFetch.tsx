
import React, { useEffect } from 'react';
import { Task } from '@/lib/data';
import { fetchUserTasks } from '@/api/tasks';
import { toast } from '@/components/ui/toast-wrapper';
import { useAuth } from '@/context/auth';

export const useTaskFetch = (initialTasks: Task[] = []) => {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = React.useState(true);
  const { isAuthenticated } = useAuth();

  const fetchTasks = async () => {
    if (!isAuthenticated) {
      // If not authenticated, use the initial tasks (demo mode)
      setTasks(initialTasks);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const fetchedTasks = await fetchUserTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      
      // Use initial tasks as fallback when there's an error
      setTasks(initialTasks);
      
      // Only show error toast in production - in development it's noisy
      if (process.env.NODE_ENV === 'production') {
        toast.error('Failed to load tasks');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isAuthenticated]);

  return {
    tasks,
    setTasks,
    isLoading,
    refetchTasks: fetchTasks
  };
};

export default useTaskFetch;
