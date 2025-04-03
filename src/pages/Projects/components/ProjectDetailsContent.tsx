
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamSection from '@/components/projects/TeamSection';
import ProjectOverview from '@/components/projects/ProjectOverview';
import TasksSection from '@/components/projects/TasksSection';
import ProjectSettings from '@/components/projects/ProjectSettings';
import ProjectFiles from '@/components/projects/ProjectFiles';
import { BarChart, Users, FileText, Cog, FileStack } from 'lucide-react';

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
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-1 py-1 rounded-lg bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 backdrop-blur-sm shadow-sm">
          <TabsList className="w-full p-1 rounded-md bg-background/90">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Team</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FileStack className="w-4 h-4" />
              <span>Files</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Cog className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="space-y-4 animate-fade-in">
          <ProjectOverview 
            project={project}
            tasks={projectTasks}
            milestones={projectMilestones}
            risks={projectRisks}
            financials={projectFinancials}
            projectId={projectId}
          />
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4 animate-fade-in">
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
        
        <TabsContent value="team" className="space-y-4 animate-fade-in">
          <TeamSection 
            teamMembers={teamMembers}
            addTeamMember={handleAddMember}
            updateTeamMember={(id, field, value) => console.log('Update member:', id, field, value)}
            removeTeamMember={handleRemoveMember}
            projectId={projectId}
          />
        </TabsContent>
        
        <TabsContent value="files" className="space-y-4 animate-fade-in">
          <ProjectFiles projectId={projectId} />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 animate-fade-in">
          <ProjectSettings project={project} projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetailsContent;
