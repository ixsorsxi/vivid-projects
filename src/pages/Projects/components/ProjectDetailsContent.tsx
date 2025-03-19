
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProjectData } from '../hooks/useProjectData';
import ProjectHeader from '@/components/projects/header';
import ProjectOverview from '@/components/projects/ProjectOverview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TasksKanbanView from '@/components/projects/components/TasksKanbanView';
import ProjectTeam from '@/components/projects/team';
import ProjectFiles from '@/components/projects/ProjectFiles';
import ProjectSettings from '@/components/projects/ProjectSettings';
import { Task } from '@/lib/types/task';
import { ProjectTask } from '@/hooks/project-form';

const ProjectDetailsContent = () => {
  const { projectId } = useParams<{ projectId: string }>();
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
        projectName={projectData.name}
        projectStatus={projectData.status}
        onStatusChange={handleStatusChange}
      />
      
      <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="overview" className="mt-0">
            <ProjectOverview project={projectData} tasks={projectFormTasks} />
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-0">
            <TasksKanbanView 
              tasks={projectTasks} 
              onTaskUpdate={handleUpdateTaskStatus}
              onTaskAdd={handleAddTask}
              onTaskDelete={handleDeleteTask}
            />
          </TabsContent>
          
          <TabsContent value="team" className="mt-0">
            <ProjectTeam 
              teamMembers={projectData.team || []} 
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
            />
          </TabsContent>
          
          <TabsContent value="files" className="mt-0">
            <ProjectFiles />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <ProjectSettings project={projectData} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProjectDetailsContent;
