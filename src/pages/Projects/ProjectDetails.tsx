
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectHeader from '@/components/projects/header';
import useProjectDetails from './hooks/useProjectDetails';
import ProjectDetailsContent from './components/ProjectDetailsContent';
import ProjectLoading from './components/ProjectLoading';
import ProjectError from './components/ProjectError';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
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

  if (error) {
    console.error("Error loading project:", error);
    return <ProjectError error={error} refetch={refetch} />;
  }

  if (!supabaseProject && isLoading) {
    return <ProjectLoading />;
  }

  // Project data to display (prioritize Supabase data, fall back to local state)
  const displayProject = supabaseProject || {
    ...projectData,
    id: projectId || 'local-project' // Ensure id property exists
  };

  if (!displayProject) {
    return null; // Will redirect via the useEffect in useProjectDetails
  }

  console.log("Displaying project in ProjectDetails:", displayProject);

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
        handleAddTask={handleAddTask}
        handleUpdateTaskStatus={handleUpdateTaskStatus}
        handleDeleteTask={handleDeleteTask}
        handleAddMember={handleAddMember}
        handleRemoveMember={handleRemoveMember}
        handleMakeManager={handleMakeManager}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projectId={projectId || ''}
      />
    </div>
  );
};

export default ProjectDetails;
