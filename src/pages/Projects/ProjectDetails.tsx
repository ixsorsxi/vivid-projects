
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjectById } from '@/api/projects/projectCrud';
import { useAuth } from '@/context/auth';
import { demoProjects } from '@/lib/data';
import { useProjectData } from './hooks/useProjectData';
import ProjectHeader from '@/components/projects/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectOverview from '@/components/projects/ProjectOverview';
import TasksSection from '@/components/projects/TasksSection';
import ProjectTeam from '@/components/projects/team';
import ProjectFiles from '@/components/projects/ProjectFiles';
import ProjectSettings from '@/components/projects/ProjectSettings';
import { useViewPreference } from '@/hooks/useViewPreference';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  // Fix viewPreference hook usage by passing an object
  const { viewType: activeTab, setViewType: setActiveTab } = useViewPreference({ 
    defaultView: 'overview',
    storageKey: 'project-view-tab'
  });
  
  // Try to fetch the project from Supabase if user is logged in
  const { data: supabaseProject, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProjectById(projectId as string),
    enabled: !!user && !!projectId,
  });

  // If no Supabase data or not logged in, use demo project as fallback
  const fallbackProject = !supabaseProject && demoProjects.find(p => p.id === projectId || p.id === '1');
  
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

  if (!fallbackProject && !projectData && isLoading) {
    return <div className="p-8">Loading project...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <ProjectHeader 
        projectName={supabaseProject?.name || projectData.name || ''} 
        projectStatus={supabaseProject?.status || projectData.status}
        projectDescription={projectData.description || ''}
        onStatusChange={handleStatusChange}
      />
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
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
        
        <TabsContent value="tasks" className="space-y-6">
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
