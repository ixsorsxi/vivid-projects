
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectOverview from '@/components/projects/ProjectOverview';
import TasksKanbanView from '@/components/projects/components/TasksKanbanView';
import ProjectTeam from '@/components/projects/team';
import ProjectFiles from '@/components/projects/ProjectFiles';
import ProjectSettings from '@/components/projects/ProjectSettings';
import ProjectHeader from '@/components/projects/header';
import { Project } from '@/lib/types/project';
import { Task } from '@/lib/types/task';
import { ProjectTask } from '@/hooks/project-form/types';
import { ProjectStatus } from '@/lib/types/common';

interface ProjectDetailsContentProps {
  project: Project;
  projectTasks: Task[];
  handleAddTask: (task: any) => void;
  handleUpdateTaskStatus: (taskId: string, newStatus: string) => void;
  handleDeleteTask: (taskId: string) => void;
  handleAddMember: (email: string, role: string) => void;
  handleRemoveMember: (memberId: string | number) => void;
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
  // Type adapter function to convert Task[] to ProjectTask[]
  const adaptTasksToProjectTasks = (tasks: Task[]): ProjectTask[] => {
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '', // Convert optional to required
      dueDate: task.dueDate || '',
      status: task.status,
      priority: task.priority
    }));
  };

  // Convert tasks when passing to components expecting ProjectTask[]
  const projectFormTasks = adaptTasksToProjectTasks(projectTasks);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ProjectHeader 
        projectName={project.name || ''}
        projectStatus={project.status as ProjectStatus}
        projectDescription={project.description || ''}
        onStatusChange={handleUpdateTaskStatus}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="overview" className="mt-0">
            <ProjectOverview 
              project={project} 
              tasks={projectFormTasks} 
            />
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-0">
            <TasksKanbanView 
              tasks={projectTasks} 
              onTaskUpdate={handleUpdateTaskStatus}
              onTaskAdd={handleAddTask}
              onTaskDelete={handleDeleteTask}
              projectId={projectId}
            />
          </TabsContent>
          
          <TabsContent value="team" className="mt-0">
            <ProjectTeam 
              teamMembers={project.team || []} 
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
              projectId={projectId}
            />
          </TabsContent>
          
          <TabsContent value="files" className="mt-0">
            <ProjectFiles projectId={projectId} />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <ProjectSettings 
              project={project} 
              projectId={projectId}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProjectDetailsContent;
