
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/auth';
import { useProjectData } from './useProjectData';
import { useViewPreference } from '@/hooks/useViewPreference';
import { Task } from '@/lib/types/task';
import { fetchProjectTasks } from './project/utils';
import { useSupabaseProject } from './project/useSupabaseProject';

export const useProjectDetails = (projectId: string | undefined) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { viewType: activeTab, setViewType: setActiveTab } = useViewPreference({ 
    defaultView: 'overview',
    storageKey: 'project-view-tab'
  });
  
  // Use the Supabase project hook to fetch project data
  const { 
    project, 
    isLoading, 
    error, 
    refetch 
  } = useSupabaseProject(projectId || '');

  // Fetch tasks for this project
  const { data: tasks } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      if (!projectId || !user) return [];
      return fetchProjectTasks(projectId);
    },
    enabled: !!user && !!projectId && !!project,
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
    if (!isLoading && !project && !projectData && projectId) {
      // Add a small delay to allow the toast to show before redirecting
      const timeoutId = setTimeout(() => {
        navigate('/projects');
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [project, isLoading, projectData, navigate, projectId]);

  // Force refresh when component mounts
  useEffect(() => {
    if (user && projectId) {
      refetch();
    }
  }, [user, projectId, refetch]);

  return {
    // Prioritize Supabase data over local state
    supabaseProject: project,
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
