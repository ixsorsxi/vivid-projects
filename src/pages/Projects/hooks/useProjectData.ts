
import { useProjectState } from './project/useProjectState';
import { useProjectTasks } from './project/useProjectTasks';
import { useProjectTeam } from './project/useProjectTeam';
import { useSupabaseProject } from './project/useSupabaseProject';

export const useProjectData = (projectId: string | undefined) => {
  const { projectData, setProjectData, handleStatusChange } = useProjectState(projectId);
  
  // Initialize Supabase integration
  useSupabaseProject(projectId);
  
  // Setup project tasks management
  const { 
    projectTasks, 
    handleAddTask, 
    handleUpdateTaskStatus, 
    handleDeleteTask
  } = useProjectTasks(projectData.name, setProjectData);
  
  // Setup team management
  const { 
    handleAddMember, 
    handleRemoveMember,
    handleMakeManager
  } = useProjectTeam(projectData, setProjectData);

  return {
    projectData,
    projectTasks,
    handleStatusChange,
    handleAddMember,
    handleRemoveMember,
    handleMakeManager,
    handleAddTask,
    handleUpdateTaskStatus,
    handleDeleteTask
  };
};
