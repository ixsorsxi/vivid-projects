
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Task } from '@/lib/data';
import { fetchUserTasks } from '@/api/tasks';
import { toast } from '@/components/ui/toast-wrapper';
import { useAuth } from '@/context/auth';

export const useTaskFetch = (initialTasks: Task[] = []) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  
  // Add refs to track previous auth state and prevent duplicate fetches
  const prevAuthRef = useRef(isAuthenticated);
  const prevUserIdRef = useRef(user?.id);
  const hasShownToastRef = useRef(false);
  const isFetchingRef = useRef(false);

  const fetchTasks = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      console.log("Fetch already in progress, skipping");
      return;
    }
    
    // Prevent unnecessary refetches when auth state hasn't changed
    const authChanged = prevAuthRef.current !== isAuthenticated || 
                         prevUserIdRef.current !== user?.id;
    
    // Update refs with current values
    prevAuthRef.current = isAuthenticated;
    prevUserIdRef.current = user?.id;
    
    // Only log when authentication state changes
    if (authChanged) {
      console.log("Authentication state changed, refreshing tasks");
    }
    
    // Set fetching flag
    isFetchingRef.current = true;
    
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

      console.log("Fetching tasks for user:", user.id);
      const fetchedTasks = await fetchUserTasks(user.id);
      setTasks(fetchedTasks);
      console.log("Successfully fetched user tasks:", fetchedTasks.length);
      
      // Show success toast only when there are tasks AND we haven't shown a toast yet
      if (fetchedTasks.length > 0 && !hasShownToastRef.current) {
        toast("Tasks loaded", 
          { description: `${fetchedTasks.length} tasks retrieved successfully` }
        );
        // Mark that we've shown the toast
        hasShownToastRef.current = true;
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      
      // Use initial tasks as fallback when there's an error
      if (initialTasks && initialTasks.length > 0) {
        setTasks(initialTasks);
        console.log("Using initial tasks as fallback after fetch error");
      }
      
      setError("Failed to load tasks. Using demo data instead.");
      
      // Only show error toast once
      if (!hasShownToastRef.current) {
        toast("Could not load tasks", 
          { description: "Using demo data instead", variant: "destructive" }
        );
        hasShownToastRef.current = true;
      }
    } finally {
      setIsLoading(false);
      // Reset fetching flag
      isFetchingRef.current = false;
    }
  }, [isAuthenticated, initialTasks, user]);

  useEffect(() => {
    // Reset toast flag when component unmounts/remounts or dependencies change
    return () => {
      hasShownToastRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Add a slight delay to show loading animation
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  // Function to explicitly refetch and show toast again
  const refetchTasks = useCallback(() => {
    // Reset the toast flag to allow showing toast on manual refetch
    hasShownToastRef.current = false;
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    setTasks,
    isLoading,
    error,
    refetchTasks
  };
};

export default useTaskFetch;
