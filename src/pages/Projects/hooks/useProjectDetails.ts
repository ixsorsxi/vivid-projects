
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjectById } from '@/api/projects/projectFetch';
import { useAuth } from '@/context/auth';
import { toast } from '@/components/ui/toast-wrapper';
import { useProjectData } from './useProjectData';
import { useViewPreference } from '@/hooks/useViewPreference';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/lib/types/task';
import { Assignee } from '@/lib/types/common';

export const useProjectDetails = (projectId: string | undefined) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { viewType: activeTab, setViewType: setActiveTab } = useViewPreference({ 
    defaultView: 'list', // Using 'list' which is a valid ViewType
    storageKey: 'project-view-tab'
  });
  
  // Fetch the project from Supabase with shorter stale time to ensure fresh data
  const { data: supabaseProject, isLoading, error, refetch } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId || !user) return null;
      try {
        console.log("Fetching project details for:", projectId);
        const project = await fetchProjectById(projectId);
        console.log("Fetched project details:", project);
        return project;
      } catch (err: any) {
        console.error("Error fetching project:", err);
        
        // Show appropriate error message based on error type
        if (err.message && err.message.includes('permission')) {
          toast.error("Access restricted", {
            description: "You don't have permission to view this project."
          });
        } else if (err.message && err.message.includes('recursion')) {
          toast.error("Database configuration issue", {
            description: "There's an issue with the database security policies."
          });
        } else if (!err.message || !err.message.includes('auth')) {
          toast.error("Error loading project", {
            description: err?.message || "An unexpected error occurred"
          });
        }
        
        return null;
      }
    },
    enabled: !!user && !!projectId,
    retry: 1,
    staleTime: 0, // Set stale time to 0 to always fetch fresh data
    refetchOnWindowFocus: true,
    refetchInterval: 3000, // Refetch every 3 seconds to ensure we see updates
  });

  // Fetch tasks for this project
  const { data: tasks } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      if (!projectId || !user) return [];
      try {
        const { data, error } = await supabase
          .rpc('get_project_tasks', { p_project_id: projectId });
        
        if (error) {
          console.error('Error fetching project tasks:', error);
          return [];
        }
        
        // Transform the tasks to include required properties from Task type
        return (data || []).map(task => ({
          ...task,
          assignees: [] as Assignee[], // Add empty assignees array to match Task type
          // Add other required fields that might be missing
          subtasks: [],
          dependencies: []
        })) as Task[];
      } catch (err) {
        console.error('Error fetching project tasks:', err);
        return [];
      }
    },
    enabled: !!user && !!projectId && !!supabaseProject,
  });
  
  // Use project data hook to manage the project state
  const {
    projectData,
    projectTasks,
    handleStatusChange,
    handleAddMember,
    handleRemoveMember,
    handleAddTask,
    handleUpdateTaskStatus,
    handleDeleteTask
  } = useProjectData(projectId);

  // If no project found and not loading, redirect back to projects page
  useEffect(() => {
    if (!isLoading && !supabaseProject && !projectData && projectId) {
      // Add a small delay to allow the toast to show before redirecting
      const timeoutId = setTimeout(() => {
        navigate('/projects');
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [supabaseProject, isLoading, projectData, navigate, projectId]);

  // Update projectData with fetched data
  useEffect(() => {
    if (supabaseProject) {
      // Update the local state with fetched data
      console.log("Updating project data with:", supabaseProject);
    }
  }, [supabaseProject]);

  // Force refresh when component mounts
  useEffect(() => {
    if (user && projectId) {
      refetch();
    }
  }, [user, projectId, refetch]);

  return {
    supabaseProject,
    projectData,
    projectTasks: tasks || projectTasks,
    isLoading,
    error,
    refetch,
    handleStatusChange,
    handleAddMember,
    handleRemoveMember,
    handleAddTask,
    handleUpdateTaskStatus,
    handleDeleteTask,
    activeTab,
    setActiveTab
  };
};

export default useProjectDetails;
