
import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '@/lib/data';
import { fetchUserTasks } from '@/api/tasks';
import { toast } from '@/components/ui/toast-wrapper';
import { useAuth } from '@/context/auth';

export const useTaskFetch = (initialTasks: Task[] = []) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  const fetchTasks = useCallback(async () => {
    // Clear any previous toast states - without using dismiss
    // since it doesn't exist on our toast object
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (!isAuthenticated || !user) {
        // If not authenticated, use the initial tasks (demo mode)
        setTasks(initialTasks);
        console.log("Using demo tasks in offline mode (not authenticated)");
        return;
      }

      const fetchedTasks = await fetchUserTasks(user.id);
      setTasks(fetchedTasks);
      console.log("Successfully fetched user tasks:", fetchedTasks.length);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      
      // Use initial tasks as fallback when there's an error
      if (initialTasks && initialTasks.length > 0) {
        setTasks(initialTasks);
        console.log("Using initial tasks as fallback after fetch error");
      }
      
      setError("Failed to load tasks. Using demo data instead.");
      
      // Only show error toast in production - in development it's noisy
      if (process.env.NODE_ENV === 'production') {
        toast.error('Failed to load tasks');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, initialTasks, user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    setTasks,
    isLoading,
    error,
    refetchTasks: fetchTasks
  };
};

export default useTaskFetch;
