
import React from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import ProjectHeader from '@/components/projects/header';
import ProjectOverview from '@/components/projects/ProjectOverview';
import TasksSection from '@/components/projects/TasksSection';
import ProjectTeam from '@/components/projects/team';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // This will be replaced with real data fetching in future updates
  const project = {
    id: projectId || '1',
    name: 'Project Name',
    description: 'Project description will be loaded from Supabase',
    status: 'in-progress',
    progress: 50,
    dueDate: new Date().toISOString(),
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <ProjectHeader 
          title={project.name} 
          status={project.status as any} 
          progress={project.progress} 
        />
        
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-5 w-full max-w-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <ProjectOverview project={project as any} />
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-4">
            <TasksSection projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="team" className="mt-4">
            <ProjectTeam projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="files" className="mt-4">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <p className="text-muted-foreground">File management will be integrated with Supabase Storage.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <p className="text-muted-foreground">Project settings will be integrated with Supabase.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default ProjectDetails;
