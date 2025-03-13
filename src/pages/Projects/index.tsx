
import React from 'react';
import { demoProjects } from '@/lib/data';
import PageContainer from '@/components/PageContainer';
import ProjectFilterBar from '@/components/projects/ProjectFilterBar';
import ProjectFilterTabs from '@/components/projects/ProjectFilterTabs';

const Projects = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);
  
  const filteredProjects = React.useMemo(() => {
    return demoProjects.filter(project => {
      // Apply search filter
      const matchesSearch = searchQuery === '' || 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply status filter
      const matchesStatus = filterStatus === null || project.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, filterStatus, demoProjects]);

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
