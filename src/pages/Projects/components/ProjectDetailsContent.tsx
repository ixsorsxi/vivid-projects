
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from '@/lib/types/project';
import { Task } from '@/lib/types/task';
import ProjectOverview from './ProjectOverview';
import TeamSection from '@/components/projects/TeamSection';
import TasksSection from '@/components/projects/TasksSection';
import ProjectSettings from '@/components/projects/settings/ProjectSettings';
import ProjectTimeline from '@/components/projects/timeline/ProjectTimeline';
import ProjectRisks from '@/components/projects/risks/ProjectRisks';
import ProjectFinancials from '@/components/projects/financials/ProjectFinancials';

interface ProjectDetailsContentProps {
  project: any;
  projectTasks: Task[];
  projectMilestones: any[];
  projectRisks: any[];
  projectFinancials: any[];
  handleAddTask: (task: any) => Promise<any>;
  handleUpdateTaskStatus: (taskId: string, status: string) => Promise<void>;
  handleDeleteTask: (taskId: string) => Promise<void>;
  handleAddMember: (member: any) => Promise<boolean>;
  handleRemoveMember: (memberId: string | number) => Promise<boolean>;
  handleMakeManager: (memberId: string | number, projectId?: string) => Promise<boolean>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projectId: string;
}

const ProjectDetailsContent: React.FC<ProjectDetailsContentProps> = ({
  project,
  projectTasks,
  projectMilestones,
  projectRisks,
  projectFinancials,
  handleAddTask,
  handleUpdateTaskStatus,
  handleDeleteTask,
  activeTab,
  setActiveTab,
  projectId
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid grid-cols-7 w-full max-w-4xl">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="risks">Risks</TabsTrigger>
        <TabsTrigger value="financials">Financials</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        <ProjectOverview 
          project={project} 
          tasks={projectTasks}
          milestones={projectMilestones}
        />
      </TabsContent>
      
      <TabsContent value="tasks" className="space-y-6">
        <TasksSection 
          projectId={projectId}
          tasks={projectTasks} 
          onAddTask={handleAddTask}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          onDeleteTask={handleDeleteTask}
        />
      </TabsContent>
      
      <TabsContent value="team" className="space-y-6">
        <TeamSection />
      </TabsContent>
      
      <TabsContent value="timeline" className="space-y-6">
        <ProjectTimeline 
          projectId={projectId}
          milestones={projectMilestones}
        />
      </TabsContent>
      
      <TabsContent value="risks" className="space-y-6">
        <ProjectRisks 
          projectId={projectId}
          risks={projectRisks}
        />
      </TabsContent>
      
      <TabsContent value="financials" className="space-y-6">
        <ProjectFinancials 
          projectId={projectId}
          financials={projectFinancials}
        />
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-6">
        <ProjectSettings projectId={projectId} project={project} />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectDetailsContent;
