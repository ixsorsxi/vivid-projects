
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
  const initialLoadDoneRef = useRef(false);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTasks = useCallback(async (forceRefresh = false) => {
    // Prevent concurrent fetches
    if (isFetchingRef.current && !forceRefresh) {
      console.log("Fetch already in progress, skipping");
      return;
    }
    
    // Set fetching flag immediately
    isFetchingRef.current = true;
    
    // Clear any previous states
    setIsLoading(true);
    setError(null);
    
    try {
      if (!isAuthenticated || !user) {
        // If not authenticated, use the initial tasks (demo mode)
        setTasks(initialTasks);
        console.log("Using demo tasks in offline mode (not authenticated)");
        setIsLoading(false);
        isFetchingRef.current = false;
        return;
      }

      console.log("Fetching tasks for user:", user.id);
      const fetchedTasks = await fetchUserTasks(user.id);
      
      // Log what we got back for debugging
      console.log(`Fetched ${fetchedTasks.length} tasks:`, fetchedTasks);
      
      // Update state with fetched tasks
      setTasks(fetchedTasks);
      
      // Only show success toast on manual refetch to avoid notification spam
      if (fetchedTasks.length > 0 && (forceRefresh || !initialLoadDoneRef.current)) {
        if (forceRefresh) {
          toast("Tasks refreshed", 
            { description: `${fetchedTasks.length} tasks retrieved successfully` }
          );
        } else if (!hasShownToastRef.current) {
          toast("Tasks loaded", 
            { description: `${fetchedTasks.length} tasks retrieved successfully` }
          );
          // Mark that we've shown the toast
          hasShownToastRef.current = true;
        }
      }
      
      // Mark initial load as done
      initialLoadDoneRef.current = true;
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
      // Reset fetching flag with a small delay to prevent rapid re-fetches
      setTimeout(() => {
        isFetchingRef.current = false;
      }, 500);
    }
  }, [isAuthenticated, initialTasks, user]);

  // Effect for initial fetch and cleanup
  useEffect(() => {
    // Reset toast flag when component unmounts/remounts
    hasShownToastRef.current = false;
    initialLoadDoneRef.current = false;
    
    // Initial fetch
    if (!initialLoadDoneRef.current) {
      fetchTasks();
    }
    
    // Make sure to cancel any ongoing timeouts when unmounting
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  // Effect for fetch with auth state change detection
  useEffect(() => {
    // Check if auth state changed
    const authChanged = prevAuthRef.current !== isAuthenticated || 
                         prevUserIdRef.current !== user?.id;
    
    // Update refs with current values
    prevAuthRef.current = isAuthenticated;
    prevUserIdRef.current = user?.id;
    
    // Only fetch if auth state changed or on initial mount
    if (authChanged) {
      console.log("Authentication state changed, refreshing tasks");
      
      // Clear any existing timeout
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      
      // Add a slight delay to prevent rapid consecutive fetches
      fetchTimeoutRef.current = setTimeout(() => {
        fetchTasks();
      }, 300);
    }
  }, [fetchTasks, isAuthenticated, user]);

  // Function to explicitly refetch and show toast again
  const refetchTasks = useCallback(() => {
    console.log("Manual refetch requested");
    fetchTasks(true); // true indicates a manual/forced refresh
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
