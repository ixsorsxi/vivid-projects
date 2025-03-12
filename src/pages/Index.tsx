
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProjectCard from '@/components/dashboard/ProjectCard';
import TasksList from '@/components/dashboard/TasksList';
import { demoProjects, demoTasks } from '@/lib/data';
import FadeIn from '@/components/animations/FadeIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  // Sort projects by due date (most recent first)
  const sortedProjects = [...demoProjects].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  
  // Get the most recent projects (first 3)
  const recentProjects = sortedProjects.slice(0, 3);
  
  // Filter tasks by different statuses
  const activeProjects = demoProjects.filter(p => p.status === 'in-progress');
  const completedProjects = demoProjects.filter(p => p.status === 'completed');
  
  // Get tasks that are not completed for the dashboard
  const pendingTasks = demoTasks.filter(task => !task.completed);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen ml-64">
        <Navbar />
        
        <main className="flex-1 p-6 md:p-8">
          <DashboardHeader />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <FadeIn duration={800} delay={300} className="lg:col-span-2">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {recentProjects.map((project) => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      />
                    ))}
                    {recentProjects.length === 0 && (
                      <div className="col-span-2 text-center py-10">
                        <p className="text-muted-foreground">No recent projects</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="active" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {activeProjects.map((project) => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      />
                    ))}
                    {activeProjects.length === 0 && (
                      <div className="col-span-2 text-center py-10">
                        <p className="text-muted-foreground">No active projects</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="completed" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {completedProjects.map((project) => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      />
                    ))}
                    {completedProjects.length === 0 && (
                      <div className="col-span-2 text-center py-10">
                        <p className="text-muted-foreground">No completed projects yet</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </FadeIn>
            
            <FadeIn duration={800} delay={400} className="lg:col-span-1">
              <TasksList tasks={pendingTasks} />
            </FadeIn>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
