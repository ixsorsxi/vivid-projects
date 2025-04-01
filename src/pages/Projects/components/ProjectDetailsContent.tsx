
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectOverview from '@/components/projects/ProjectOverview';
import TasksKanbanView from '@/components/projects/components/TasksKanbanView';
import ProjectTeam from '@/components/projects/team';
import ProjectFiles from '@/components/projects/ProjectFiles';
import ProjectSettings from '@/components/projects/ProjectSettings';
import { Project } from '@/lib/types/project';
import { Task } from '@/lib/types/task';
import { ProjectTask } from '@/hooks/project-form/types';

interface ProjectDetailsContentProps {
  project: Project;
  projectTasks: Task[];
  handleAddTask: (task: any) => void;
  handleUpdateTaskStatus: (taskId: string, newStatus: string) => void;
  handleDeleteTask: (taskId: string) => void;
  handleAddMember: (member: { id?: string; name: string; role: string; email?: string }) => void;
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
  const adaptTasksToProjectTasks = (tasks: Task[]): ProjectTask[] => {
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      status: task.status,
      priority: task.priority
    }));
  };

  const projectFormTasks = adaptTasksToProjectTasks(projectTasks);

  const groupTasksByStatus = (tasks: Task[]) => {
    return {
      'not-started': tasks.filter(task => task.status === 'not-started'),
      'in-progress': tasks.filter(task => task.status === 'in-progress'),
      'completed': tasks.filter(task => task.status === 'completed')
    };
  };

  const handleDragStart = (e: React.DragEvent, taskId: string, status: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('currentStatus', status);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    handleUpdateTaskStatus(taskId, newStatus);
  };

  // Adapter function to make handleAddMember compatible with ProjectTeam
  const handleAddTeamMember = (member: { id?: string; name: string; role: string; email?: string }) => {
    handleAddMember(member);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
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
              tasksByStatus={groupTasksByStatus(projectTasks)} 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onDeleteTask={handleDeleteTask}
              fullHeight={true}
            />
          </TabsContent>
          
          <TabsContent value="team" className="mt-0">
            <ProjectTeam 
              team={project.team || []} 
              onAddMember={handleAddTeamMember}
              onRemoveMember={handleRemoveMember}
            />
          </TabsContent>
          
          <TabsContent value="files" className="mt-0">
            <ProjectFiles 
              projectId={projectId} 
            />
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
