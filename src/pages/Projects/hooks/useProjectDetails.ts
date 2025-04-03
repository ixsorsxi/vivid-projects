
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/auth';
import { useProjectData } from './useProjectData';
import { useViewPreference } from '@/hooks/useViewPreference';
import { Task } from '@/lib/types/task';
import { fetchProjectTasks } from './project/utils';
import { useSupabaseProject } from './project/useSupabaseProject';
import { fetchProjectMilestones, fetchProjectRisks, fetchProjectFinancials } from '@/api/projects/projectFetch';
import { toast } from '@/components/ui/toast-wrapper';

export const useProjectDetails = (projectId: string | undefined) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);
  
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
      try {
        console.log("Fetching tasks for project:", projectId);
        return fetchProjectTasks(projectId);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        return [];
      }
    },
    enabled: !!user && !!projectId,
  });
  
  // Fetch project milestones
  const { data: milestones } = useQuery({
    queryKey: ['project-milestones', projectId],
    queryFn: async () => {
      if (!projectId || !user) return [];
      try {
        return fetchProjectMilestones(projectId);
      } catch (err) {
        console.error("Error fetching milestones:", err);
        return [];
      }
    },
    enabled: !!user && !!projectId,
  });
  
  // Fetch project risks
  const { data: risks } = useQuery({
    queryKey: ['project-risks', projectId],
    queryFn: async () => {
      if (!projectId || !user) return [];
      try {
        return fetchProjectRisks(projectId);
      } catch (err) {
        console.error("Error fetching risks:", err);
        return [];
      }
    },
    enabled: !!user && !!projectId,
  });
  
  // Fetch project financials
  const { data: financials } = useQuery({
    queryKey: ['project-financials', projectId],
    queryFn: async () => {
      if (!projectId || !user) return [];
      try {
        return fetchProjectFinancials(projectId);
      } catch (err) {
        console.error("Error fetching financials:", err);
        return [];
      }
    },
    enabled: !!user && !!projectId,
  });
  
  // Use project data hook to manage the project state
  const {
    projectData,
    projectTasks,
    handleStatusChange,
    handleAddMember,
    handleRemoveMember,
    handleMakeManager,
    handleAddTask,
    handleUpdateTaskStatus,
    handleDeleteTask
  } = useProjectData(projectId);

  // Force refresh when component mounts
  useEffect(() => {
    if (user && projectId && !initialLoadAttempted) {
      console.log("Initial load of project data for ID:", projectId);
      refetch();
      setInitialLoadAttempted(true);
    }
  }, [user, projectId, refetch, initialLoadAttempted]);

  // If project fetch has completed and no data found, show toast and redirect
  useEffect(() => {
    if (!isLoading && initialLoadAttempted && !project && !projectData && projectId) {
      console.log("No project found after fetch attempt. Redirecting...");
      toast.error("Project not found", {
        description: "The requested project could not be found or you don't have access to it."
      });
      
      // Add a small delay to allow the toast to show before redirecting
      const timeoutId = setTimeout(() => {
        navigate('/projects');
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [project, isLoading, projectData, navigate, projectId, initialLoadAttempted]);

  // Log project data for debugging
  useEffect(() => {
    if (project) {
      console.log("Loaded project data:", project);
    }
  }, [project]);

  return {
    // Prioritize Supabase data over local state
    supabaseProject: project,
    projectData,
    projectTasks: tasks || projectTasks,
    projectMilestones: milestones || [],
    projectRisks: risks || [],
    projectFinancials: financials || [],
    isLoading,
    error,
    refetch,
    handleStatusChange,
    handleAddMember,
    handleRemoveMember,
    handleMakeManager,
    handleAddTask,
    handleUpdateTaskStatus,
    handleDeleteTask,
    activeTab,
    setActiveTab
  };
};

export default useProjectDetails;
