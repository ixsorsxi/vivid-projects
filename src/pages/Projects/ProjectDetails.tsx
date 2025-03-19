
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const { viewType: activeTab, setViewType: setActiveTab } = useViewPreference({ 
    defaultView: 'list',
    storageKey: 'project-view-tab'
  });
  const [useDemo, setUseDemo] = useState(false);
  
  // Try to fetch the project from Supabase if user is logged in
  const { data: supabaseProject, isLoading, error, refetch } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId || !user) return null;
      try {
        console.log("Fetching project details for:", projectId);
        const project = await fetchProjectById(projectId);
        console.log("Fetched project details:", project);
        if (project) {
          setUseDemo(false);
        }
        return project;
      } catch (err: any) {
        console.error("Error fetching project:", err);
        
        // Check for infinite recursion error specifically
        if (err.message && err.message.includes('infinite recursion')) {
          console.warn("Infinite recursion detected in policy, using demo data as fallback");
          setUseDemo(true);
          toast.error("Using demo project data", {
            description: "Database configuration issue detected. Created changes may not persist."
          });
        } else {
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

  return (
    <div className="space-y-8 p-8">
      {useDemo && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Using demo project data due to a database configuration issue. Changes may not persist between sessions.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <ProjectHeader 
        projectName={supabaseProject?.name || projectData.name || ''} 
        projectStatus={supabaseProject?.status || projectData.status}
        projectDescription={supabaseProject?.description || projectData.description || ''}
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
            teamMembers={projectData.team || []}
          />
        </TabsContent>
        
        <TabsContent value="kanban" className="space-y-6">
          <TasksSection 
            tasks={projectTasks} 
            onAddTask={handleAddTask} 
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onDeleteTask={handleDeleteTask}
            projectId={projectId || ''}
            teamMembers={projectData.team || []}
            fullView={true}
          />
        </TabsContent>
        
        <TabsContent value="team" className="space-y-6">
          <ProjectTeam 
            team={projectData.team || []} 
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
