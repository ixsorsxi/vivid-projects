
import React from 'react';
import { demoProjects } from '@/lib/data';
import PageContainer from '@/components/PageContainer';
import ProjectFilterBar from '@/components/projects/ProjectFilterBar';
import ProjectFilterTabs from '@/components/projects/ProjectFilterTabs';
import { convertToProjectType, filterProjects } from '@/components/projects/utils/projectUtils';

const Projects = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);
  
  // Convert demoProjects to ProjectType to ensure compatibility
  const typedProjects = React.useMemo(() => convertToProjectType(demoProjects), []);
  
  // Filter projects based on search query and status filter
  const filteredProjects = React.useMemo(() => 
    filterProjects(typedProjects, searchQuery, filterStatus), 
    [typedProjects, searchQuery, filterStatus]
  );

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
