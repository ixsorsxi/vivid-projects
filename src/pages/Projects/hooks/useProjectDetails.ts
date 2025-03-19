
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjectById } from '@/api/projects/projectFetch';
import { useAuth } from '@/context/auth';
import { toast } from '@/components/ui/toast-wrapper';
import { useProjectData } from './useProjectData';
import { useViewPreference } from '@/hooks/useViewPreference';

export const useProjectDetails = (projectId: string | undefined) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { viewType: activeTab, setViewType: setActiveTab } = useViewPreference({ 
    defaultView: 'overview',
    storageKey: 'project-view-tab'
  });
  
  // Fetch the project from Supabase
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
    if (!isLoading && !supabaseProject && !projectData) {
      // Add a small delay to allow the toast to show before redirecting
      const timeoutId = setTimeout(() => {
        navigate('/projects');
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [supabaseProject, isLoading, projectData, navigate]);

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
    projectTasks,
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
