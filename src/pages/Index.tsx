
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProjectCard from '@/components/dashboard/ProjectCard';
import TasksList from '@/components/dashboard/TasksList';
import { demoProjects, demoTasks } from '@/lib/data';
import FadeIn from '@/components/animations/FadeIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const recentProjects = demoProjects.slice(0, 3);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64 transition-all duration-300">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6 md:p-8">
          <DashboardHeader />
          
          <div className="grid grid-cols-1 gap-6 mb-6">
            <FadeIn duration={800} delay={300}>
              <Tabs defaultValue="all" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Projects</h2>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recentProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="active" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recentProjects
                      .filter((p) => p.status === 'in-progress')
                      .map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))
                    }
                  </div>
                </TabsContent>
                
                <TabsContent value="completed" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recentProjects
                      .filter((p) => p.status === 'completed')
                      .map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))
                    }
                    {recentProjects.filter((p) => p.status === 'completed').length === 0 && (
                      <div className="col-span-3 text-center py-10">
                        <p className="text-muted-foreground">No completed projects yet</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </FadeIn>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <TasksList tasks={demoTasks} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
