
import React from 'react';
import { demoProjects } from '@/lib/data';
import PageContainer from '@/components/PageContainer';
import ProjectFilterBar from '@/components/projects/ProjectFilterBar';
import ProjectFilterTabs from '@/components/projects/ProjectFilterTabs';
import { ProjectType } from '@/types/project';

const Projects = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);
  
  // Convert demoProjects to ProjectType to ensure compatibility
  const typedProjects: ProjectType[] = demoProjects.map(project => ({
    ...project,
    priority: project.priority || 'medium',
    members: project.members || []
  }));
  
  const filteredProjects = React.useMemo(() => {
    return typedProjects.filter(project => {
      // Apply search filter
      const matchesSearch = searchQuery === '' || 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply status filter
      const matchesStatus = filterStatus === null || project.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, filterStatus, typedProjects]);

  return (
    <PageContainer title="Projects" subtitle="Manage and track all your projects">
      <div className="space-y-6">
        <ProjectFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <ProjectFilterTabs
          filteredProjects={filteredProjects}
          setFilterStatus={setFilterStatus}
        />
      </div>
    </PageContainer>
  );
};

export default Projects;
