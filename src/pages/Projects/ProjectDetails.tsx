
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProjectHeader from '@/components/projects/header';
import useProjectDetails from './hooks/useProjectDetails';
import ProjectDetailsContent from './components/ProjectDetailsContent';
import ProjectLoading from './components/ProjectLoading';
import ProjectError from './components/ProjectError';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/lib/types/task';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  
  const {
    supabaseProject,
    projectData,
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

  // Fetch tasks for this project
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      if (!projectId) return [];

      try {
        const { data, error } = await supabase
          .rpc('get_project_tasks', { p_project_id: projectId });

        if (error) {
          console.error("Error fetching project tasks:", error);
          return [];
        }

        // Transform to Task type
        return (data || []).map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.due_date,
          completed: task.completed,
          projectId: task.project_id,
        }));
      } catch (err) {
        console.error("Error in fetchProjectTasks:", err);
        return [];
      }
    },
    enabled: !!projectId,
  });

  // Update tasks when data changes
  useEffect(() => {
    if (tasks) {
      setProjectTasks(tasks);
    }
  }, [tasks]);

  if (error) {
    console.error("Error loading project:", error);
    return <ProjectError error={error} refetch={refetch} />;
  }

  if (!projectData && isLoading) {
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
