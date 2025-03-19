
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjectById } from '@/api/projects';
import { useAuth } from '@/context/auth';
import { useProjectData } from './hooks/useProjectData';
import ProjectHeader from '@/components/projects/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectOverview from '@/components/projects/ProjectOverview';
import TasksSection from '@/components/projects/TasksSection';
import ProjectTeam from '@/components/projects/team';
import ProjectFiles from '@/components/projects/ProjectFiles';
import ProjectSettings from '@/components/projects/ProjectSettings';
import { useViewPreference } from '@/hooks/useViewPreference';
import { toast } from '@/components/ui/toast-wrapper';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { viewType: activeTab, setViewType: setActiveTab } = useViewPreference({ 
    defaultView: 'list',
    storageKey: 'project-view-tab'
  });
  
  // Try to fetch the project from Supabase if user is logged in
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
        
        // Only show error toast if it's not an expected condition
        if (err.message && !err.message.includes('auth')) {
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
      toast.error("Project not found", {
        description: "The requested project does not exist or you don't have access to it."
      });
      navigate('/projects');
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

  if (error) {
    console.error("Error loading project:", error);
  }

  if (!projectData && isLoading) {
    return <div className="p-8">Loading project...</div>;
  }

  // Project data to display (prioritize Supabase data, fall back to local state)
  const displayProject = supabaseProject || projectData;

  if (!displayProject) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="space-y-8 p-8">
      <ProjectHeader 
        projectName={displayProject.name || ''} 
        projectStatus={displayProject.status}
        projectDescription={displayProject.description || ''}
        onStatusChange={handleStatusChange}
      />
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="list">Overview</TabsTrigger>
          <TabsTrigger value="kanban">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          <ProjectOverview />
          <TasksSection 
            tasks={projectTasks} 
            onAddTask={handleAddTask} 
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onDeleteTask={handleDeleteTask}
            projectId={projectId || ''}
            teamMembers={displayProject?.team || []}
          />
        </TabsContent>
        
        <TabsContent value="kanban" className="space-y-6">
          <TasksSection 
            tasks={projectTasks} 
            onAddTask={handleAddTask} 
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onDeleteTask={handleDeleteTask}
            projectId={projectId || ''}
            teamMembers={displayProject?.team || []}
            fullView={true}
          />
        </TabsContent>
        
        <TabsContent value="team" className="space-y-6">
          <ProjectTeam 
            team={displayProject?.team || []} 
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
          />
        </TabsContent>
        
        <TabsContent value="files" className="space-y-6">
          <ProjectFiles />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <ProjectSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
