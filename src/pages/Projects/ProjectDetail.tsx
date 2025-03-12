
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import FadeIn from '@/components/animations/FadeIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectStats from '@/components/projects/ProjectStats';
import ProjectOverview from '@/components/projects/ProjectOverview';
import TasksSection from '@/components/projects/TasksSection';
import ProjectTeam from '@/components/projects/ProjectTeam';
import ProjectFiles from '@/components/projects/ProjectFiles';
import ProjectSettings from '@/components/projects/ProjectSettings';
import { useToast } from '@/hooks/use-toast';
import { useProjectData } from './hooks/useProjectData';
import PageContainer from '@/components/PageContainer';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { toast } = useToast();
  
  const {
    projectData,
    projectTasks,
    handleStatusChange,
    handleAddMember,
    handleRemoveMember,
    handleAddTask,
    handleUpdateTaskStatus,
    handleDeleteTask
  } = useProjectData(projectId, toast);

  return (
    <PageContainer title={projectData.name || ''} subtitle={projectData.description}>
      <FadeIn duration={800}>
        <ProjectHeader 
          projectName={projectData.name || ''} 
          projectStatus={projectData.status} 
          projectDescription={projectData.description}
          onStatusChange={handleStatusChange}
          onAddMember={handleAddMember}
        />
        
        <ProjectStats 
          dueDate={projectData.dueDate}
          category={projectData.category}
          progress={projectData.progress}
          tasks={{
            total: projectData.tasks.total,
            completed: projectData.tasks.completed
          }}
        />
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <ProjectOverview />
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-0">
            <TasksSection 
              projectId={projectId || ''} 
              tasks={projectTasks}
              teamMembers={projectData.team}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onDeleteTask={handleDeleteTask}
            />
          </TabsContent>
          
          <TabsContent value="team" className="mt-0">
            <ProjectTeam 
              team={projectData.team}
              onAddMember={(email, role) => {
                handleAddMember(email);
                
                toast({
                  title: "Team member invited",
                  description: `Invitation sent to ${email} for the role of ${role}`,
                });
              }}
              onRemoveMember={handleRemoveMember}
            />
          </TabsContent>
          
          <TabsContent value="files" className="mt-0">
            <ProjectFiles />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <ProjectSettings />
          </TabsContent>
        </Tabs>
      </FadeIn>
    </PageContainer>
  );
};

export default ProjectDetail;
