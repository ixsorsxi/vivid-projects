
import React from 'react';
import { demoProjects } from '@/lib/data';
import PageContainer from '@/components/PageContainer';
import ProjectFilterBar from '@/components/projects/ProjectFilterBar';
import ProjectFilterTabs from '@/components/projects/ProjectFilterTabs';
import { ProjectType } from '@/types/project';
import { ProjectStatus, PriorityLevel } from '@/lib/types/common';

const Projects = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);
  
  // Convert demoProjects to ProjectType to ensure compatibility
  const typedProjects: ProjectType[] = demoProjects.map(project => ({
    ...project,
    // Ensure priority exists with a fallback
    priority: (('priority' in project) ? project.priority : 'medium') as PriorityLevel,
    status: project.status as ProjectStatus,
    // Ensure members exists by mapping from team if needed
    members: ('members' in project && project.members) ? project.members : 
             (project.team?.map(member => ({
               id: String(member.id),
               name: member.name
             })) || [])
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
