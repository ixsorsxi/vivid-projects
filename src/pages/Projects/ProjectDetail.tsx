
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import FadeIn from '@/components/animations/FadeIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { demoTasks } from '@/lib/data';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectStats from '@/components/projects/ProjectStats';
import ProjectOverview from '@/components/projects/ProjectOverview';
import TasksSection from '@/components/projects/TasksSection';
import ProjectTeam from '@/components/projects/ProjectTeam';
import ProjectFiles from '@/components/projects/ProjectFiles';
import ProjectSettings from '@/components/projects/ProjectSettings';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  const projectName = projectId?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  
  const projectData = {
    name: projectName,
    description: "This is a sample project description that explains the goals and objectives of this project.",
    status: "in-progress",
    dueDate: "2025-05-15",
    category: "Development",
    progress: 35,
    tasks: {
      total: 24,
      completed: 8,
      inProgress: 12,
      notStarted: 4
    },
    team: [
      { id: 1, name: "John Doe", role: "Project Manager" },
      { id: 2, name: "Jane Smith", role: "Lead Developer" },
      { id: 3, name: "Mike Johnson", role: "Designer" },
      { id: 4, name: "Sarah Williams", role: "QA Engineer" }
    ]
  };

  const projectTasks = demoTasks.filter(task => task.project === projectData.name);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64 transition-all duration-300">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6 md:p-8">
          <FadeIn duration={800}>
            <ProjectHeader 
              projectName={projectData.name || ''} 
              projectStatus={projectData.status} 
              projectDescription={projectData.description} 
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
                <TasksSection projectId={projectId || ''} tasks={projectTasks} />
              </TabsContent>
              
              <TabsContent value="team" className="mt-0">
                <ProjectTeam team={projectData.team} />
              </TabsContent>
              
              <TabsContent value="files" className="mt-0">
                <ProjectFiles />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <ProjectSettings />
              </TabsContent>
            </Tabs>
          </FadeIn>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;
