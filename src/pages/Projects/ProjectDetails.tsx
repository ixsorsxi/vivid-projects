
import React from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import ProjectHeader from '@/components/projects/header';
import ProjectOverview from '@/components/projects/ProjectOverview';
import TasksSection from '@/components/projects/TasksSection';
import ProjectTeam from '@/components/projects/team';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { demoProjects } from '@/lib/data';

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

  // Mock tasks and team members for the TasksSection component
  const mockTasks = [];
  const mockTeamMembers = [
    { id: 1, name: 'John Doe', role: 'Developer' },
    { id: 2, name: 'Jane Smith', role: 'Designer' }
  ];

  return (
    <PageContainer title="Project Details">
      <div className="space-y-6">
        <ProjectHeader />
        
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-5 w-full max-w-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <ProjectOverview project={project} />
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-4">
            <TasksSection 
              projectId={project.id} 
              tasks={mockTasks}
              teamMembers={mockTeamMembers}
            />
          </TabsContent>
          
          <TabsContent value="team" className="mt-4">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <p className="text-muted-foreground">Team members will be integrated with Supabase.</p>
            </div>
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
