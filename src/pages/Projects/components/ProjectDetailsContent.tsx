
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamSection from '@/components/projects/TeamSection';
import ProjectOverview from '@/components/projects/ProjectOverview';
import TasksSection from '@/components/projects/TasksSection';
import ProjectSettings from '@/components/projects/ProjectSettings';
import ProjectFiles from '@/components/projects/ProjectFiles';

interface ProjectDetailsContentProps {
  project: any;
  projectTasks: any[];
  projectMilestones: any[];
  projectRisks: any[];
  projectFinancials: any[];
  handleAddTask: (task: any) => Promise<any>;
  handleUpdateTaskStatus: (taskId: string, status: string) => Promise<void>;
  handleDeleteTask: (taskId: string) => Promise<void>;
  handleAddMember: (member: any) => Promise<boolean>;
  handleRemoveMember: (memberId: string | number) => Promise<boolean>;
  handleMakeManager: (memberId: string | number) => Promise<boolean>;
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
  handleAddMember,
  handleRemoveMember,
  handleMakeManager,
  activeTab,
  setActiveTab,
  projectId
}) => {
  // Get team members from project or initialize empty array
  const teamMembers = Array.isArray(project.team) ? project.team : [];
  
  console.log("ProjectDetailsContent - Project ID:", projectId);
  console.log("ProjectDetailsContent - Team members:", teamMembers);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <ProjectOverview 
          project={project}
          tasks={projectTasks}
          milestones={projectMilestones}
          risks={projectRisks}
          financials={projectFinancials}
          projectId={projectId}
        />
      </TabsContent>
      
      <TabsContent value="tasks" className="space-y-4">
        <TasksSection 
          tasks={projectTasks} 
          addTask={handleAddTask}
          updateTask={(taskId, field, value) => {
            if (field === 'status') {
              return handleUpdateTaskStatus(taskId, value);
            }
            // Handle other field updates if needed
            return Promise.resolve();
          }}
          removeTask={handleDeleteTask}
          projectId={projectId}
        />
      </TabsContent>
      
      <TabsContent value="team" className="space-y-4">
        <TeamSection 
          teamMembers={teamMembers}
          addTeamMember={handleAddMember}
          updateTeamMember={(id, field, value) => console.log('Update member:', id, field, value)}
          removeTeamMember={handleRemoveMember}
          projectId={projectId}
        />
      </TabsContent>
      
      <TabsContent value="files" className="space-y-4">
        <ProjectFiles projectId={projectId} />
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-4">
        <ProjectSettings project={project} projectId={projectId} />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectDetailsContent;
