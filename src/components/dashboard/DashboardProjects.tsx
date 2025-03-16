
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { useNavigate } from 'react-router-dom';

interface DashboardProjectsProps {
  recentProjects: any[];
  activeProjects: any[];
  completedProjects: any[];
}

const DashboardProjects: React.FC<DashboardProjectsProps> = ({
  recentProjects,
  activeProjects,
  completedProjects
}) => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default DashboardProjects;
