
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
        
        // Show appropriate error message based on error type
        if (err.message && err.message.includes('permission')) {
          toast.error("Access restricted", {
            description: "You don't have permission to view this project."
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

  if (error) {
    console.error("Error loading project:", error);
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Unable to load project</h2>
        <p className="text-muted-foreground mb-6">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => refetch()} 
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate('/projects')} 
            className="bg-secondary text-primary px-4 py-2 rounded-md"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!projectData && isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
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
