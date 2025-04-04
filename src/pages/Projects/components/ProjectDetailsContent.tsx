
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectOverview from '@/components/projects/ProjectOverview';
import TasksSection from '@/components/projects/TasksSection';
import ProjectSettings from '@/components/projects/ProjectSettings';
import ProjectFiles from '@/components/projects/ProjectFiles';
import { BarChart, Users, FileText, Cog, FileStack, Activity, MessageCircle } from 'lucide-react';
import ProjectTeamManager from '@/components/projects/team/ProjectTeamManager';
import { motion } from 'framer-motion';

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
  const teamMembers = Array.isArray(project.team) ? project.team : [];
  
  console.log("ProjectDetailsContent - Project ID:", projectId);
  console.log("ProjectDetailsContent - Team members:", teamMembers);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-10 px-1 py-1.5 rounded-lg bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 backdrop-blur-lg shadow-sm ring-1 ring-inset ring-white/10">
          <TabsList className="w-full p-1 rounded-md bg-background/90">
            <TabsTrigger value="overview" className="flex items-center gap-2 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <BarChart className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <FileText className="w-4 h-4" />
              <span>Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Users className="w-4 h-4" />
              <span>Team</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <FileStack className="w-4 h-4" />
              <span>Files</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Activity className="w-4 h-4" />
              <span>Activity</span>
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center gap-2 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <MessageCircle className="w-4 h-4" />
              <span>Discussions</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Cog className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ProjectOverview 
              project={project}
              tasks={projectTasks}
              milestones={projectMilestones}
              risks={projectRisks}
              financials={projectFinancials}
              projectId={projectId}
            />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
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
          </motion.div>
        </TabsContent>
        
        <TabsContent value="team" className="mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ProjectTeamManager projectId={projectId} />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="files" className="mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ProjectFiles projectId={projectId} />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-semibold mb-4">Project Activity</h3>
              <p className="text-muted-foreground">Project activity timeline will be displayed here.</p>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="discussions" className="mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-semibold mb-4">Project Discussions</h3>
              <p className="text-muted-foreground">Project discussions will be displayed here.</p>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ProjectSettings project={project} projectId={projectId} />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetailsContent;
