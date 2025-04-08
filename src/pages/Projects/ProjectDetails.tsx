
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectHeader from '@/components/projects/header';
import useProjectDetails from './hooks/useProjectDetails';
import ProjectDetailsContent from './components/ProjectDetailsContent';
import ProjectLoading from './components/ProjectLoading';
import ProjectError from './components/ProjectError';
import { toast } from '@/components/ui/toast-wrapper';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const {
    supabaseProject,
    projectData,
    projectTasks,
    projectMilestones,
    projectRisks,
    projectFinancials,
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
  } = useProjectDetails(projectId);

  // Force a refetch on mount
  useEffect(() => {
    if (projectId) {
      console.log("Forcing refetch of project data on mount for ID:", projectId);
      refetch();
    }
  }, [projectId, refetch]);

  useEffect(() => {
    if (!isLoading && !supabaseProject && !projectData && projectId) {
      toast.error("Project not found", {
        description: "The project you're looking for could not be found."
      });
      
      setTimeout(() => {
        navigate('/projects');
      }, 1500);
    }
  }, [supabaseProject, isLoading, projectData, navigate, projectId]);

  if (error) {
    console.error("Error loading project:", error);
    return <ProjectError error={error} refetch={refetch} />;
  }

  if (isLoading) {
    return <ProjectLoading />;
  }

  // Project data to display (prioritize Supabase data, fall back to local state)
  const displayProject = supabaseProject || {
    ...projectData,
    id: projectId || 'local-project' // Ensure id property exists
  };

  if (!displayProject) {
    return null; // Will redirect via the useEffect
  }

  console.log("Displaying project in ProjectDetails:", displayProject);
  console.log("Project ID being passed to components:", projectId);

  // Create Promise-returning wrapper functions
  const handleAddTaskPromise = async (task: any) => {
    return handleAddTask(task);
  };
  
  const handleUpdateTaskStatusPromise = async (taskId: string, status: string) => {
    return handleUpdateTaskStatus(taskId, status);
  };
  
  const handleDeleteTaskPromise = async (taskId: string) => {
    return handleDeleteTask(taskId);
  };
  
  const handleAddMemberPromise = async (member: any) => {
    try {
      const result = await handleAddMember(member);
      return true; // Return boolean as expected by the type
    } catch (error) {
      console.error("Error in handleAddMemberPromise:", error);
      return false;
    }
  };
  
  const handleRemoveMemberPromise = async (memberId: string | number) => {
    try {
      const result = await handleRemoveMember(memberId);
      return true; // Return boolean as expected by the type
    } catch (error) {
      console.error("Error in handleRemoveMemberPromise:", error);
      return false;
    }
  };
  
  const handleMakeManagerPromise = async (memberId: string | number) => {
    try {
      const result = await handleMakeManager(memberId, projectId);
      return true; // Return boolean as expected by the type
    } catch (error) {
      console.error("Error in handleMakeManagerPromise:", error);
      return false;
    }
  };

  return (
    <div className="space-y-8 p-8">
      <ProjectHeader 
        projectName={displayProject.name} 
        projectStatus={displayProject.status}
        projectDescription={displayProject.description || ''}
        onStatusChange={handleStatusChange}
      />
      
      <ProjectDetailsContent
        project={displayProject}
        projectTasks={projectTasks}
        projectMilestones={projectMilestones}
        projectRisks={projectRisks}
        projectFinancials={projectFinancials}
        handleAddTask={handleAddTaskPromise}
        handleUpdateTaskStatus={handleUpdateTaskStatusPromise}
        handleDeleteTask={handleDeleteTaskPromise}
        handleAddMember={handleAddMemberPromise}
        handleRemoveMember={handleRemoveMemberPromise}
        handleMakeManager={handleMakeManagerPromise}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projectId={projectId || ''}
      />
    </div>
  );
};

export default ProjectDetails;
