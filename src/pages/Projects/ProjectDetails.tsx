
import React from 'react';
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
  } = useProjectDetails(projectId);

  if (error) {
    console.error("Error loading project:", error);
    return <ProjectError error={error} refetch={refetch} />;
  }

  if (!projectData && isLoading) {
    return <ProjectLoading />;
  }

  // Project data to display (prioritize Supabase data, fall back to local state)
  const displayProject = supabaseProject || projectData;

  if (!displayProject) {
    return null; // Will redirect via the useEffect in useProjectDetails
  }

  return (
    <div className="space-y-8 p-8">
      <ProjectHeader 
        projectName={displayProject.name || ''} 
        projectStatus={displayProject.status}
        projectDescription={displayProject.description || ''}
        onStatusChange={handleStatusChange}
      />
      
      <ProjectDetailsContent
        project={displayProject}
        projectTasks={projectTasks}
        handleAddTask={handleAddTask}
        handleUpdateTaskStatus={handleUpdateTaskStatus}
        handleDeleteTask={handleDeleteTask}
        handleAddMember={handleAddMember}
        handleRemoveMember={handleRemoveMember}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projectId={projectId || ''}
      />
    </div>
  );
};

export default ProjectDetails;
