
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
    // Clear any previous states
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
      
      // Show success toast only when there are tasks
      if (fetchedTasks.length > 0) {
        toast({
          title: "Tasks loaded",
          description: `${fetchedTasks.length} tasks retrieved successfully`,
        });
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      
      // Use initial tasks as fallback when there's an error
      if (initialTasks && initialTasks.length > 0) {
        setTasks(initialTasks);
        console.log("Using initial tasks as fallback after fetch error");
      }
      
      setError("Failed to load tasks. Using demo data instead.");
      
      toast({
        title: "Could not load tasks",
        description: "Using demo data instead",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, initialTasks, user]);

  useEffect(() => {
    // Add a slight delay to show loading animation
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);
    
    return () => clearTimeout(timer);
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
