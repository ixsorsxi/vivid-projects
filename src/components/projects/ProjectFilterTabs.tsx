
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsList from './ProjectsList';
import { ProjectType } from '@/types/project';

interface ProjectFilterTabsProps {
  filteredProjects: ProjectType[];
  setFilterStatus: (status: string | null) => void;
  isLoading?: boolean;
  refetchProjects?: () => void;
}

const ProjectFilterTabs: React.FC<ProjectFilterTabsProps> = ({ 
  filteredProjects, 
  setFilterStatus,
  isLoading = false,
  refetchProjects
}) => {
  const allProjects = filteredProjects;
  const activeProjects = filteredProjects.filter(p => p.status !== 'completed');
  const completedProjects = filteredProjects.filter(p => p.status === 'completed');
  
  const handleTabChange = (value: string) => {
    if (value === 'all') {
      setFilterStatus(null);
    } else if (value === 'active') {
      setFilterStatus('in-progress');
    } else if (value === 'completed') {
      setFilterStatus('completed');
    }
  };
  
  return (
    <Tabs defaultValue="all" className="space-y-4" onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="all">
          All Projects ({allProjects.length})
        </TabsTrigger>
        <TabsTrigger value="active">
          Active ({activeProjects.length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({completedProjects.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-0">
        <ProjectsList projects={allProjects} isLoading={isLoading} refetchProjects={refetchProjects} />
      </TabsContent>
      
      <TabsContent value="active" className="mt-0">
        <ProjectsList projects={activeProjects} isLoading={isLoading} refetchProjects={refetchProjects} />
      </TabsContent>
      
      <TabsContent value="completed" className="mt-0">
        <ProjectsList projects={completedProjects} isLoading={isLoading} refetchProjects={refetchProjects} />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectFilterTabs;
