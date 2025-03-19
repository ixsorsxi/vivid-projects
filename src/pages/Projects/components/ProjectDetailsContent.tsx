
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectOverview from '@/components/projects/ProjectOverview';
import TasksSection from '@/components/projects/TasksSection';
import ProjectTeam from '@/components/projects/team';
import ProjectFiles from '@/components/projects/ProjectFiles';
import ProjectSettings from '@/components/projects/ProjectSettings';
import { Project } from '@/lib/types/project';
import { Task } from '@/lib/types/task';

interface ProjectDetailsContentProps {
  project: Project;
  projectTasks: Task[];
  handleAddTask: (task: any) => void;
  handleUpdateTaskStatus: (taskId: string, newStatus: string) => void;
  handleDeleteTask: (taskId: string) => void;
  handleAddMember: (email: string, role: string) => void;
  handleRemoveMember: (memberId: number) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projectId: string;
}

const ProjectDetailsContent: React.FC<ProjectDetailsContentProps> = ({
  project,
  projectTasks,
  handleAddTask,
  handleUpdateTaskStatus,
  handleDeleteTask,
  handleAddMember,
  handleRemoveMember,
  activeTab,
  setActiveTab,
  projectId
}) => {
  return (
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
          projectId={projectId}
          teamMembers={project?.team || []}
        />
      </TabsContent>
      
      <TabsContent value="kanban" className="space-y-6">
        <TasksSection 
          tasks={projectTasks} 
          onAddTask={handleAddTask} 
          onUpdateTaskStatus={handleUpdateTaskStatus}
          onDeleteTask={handleDeleteTask}
          projectId={projectId}
          teamMembers={project?.team || []}
          fullView={true}
        />
      </TabsContent>
      
      <TabsContent value="team" className="space-y-6">
        <ProjectTeam 
          team={project?.team || []} 
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
  );
};

export default ProjectDetailsContent;
