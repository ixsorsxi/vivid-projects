
import React from 'react';
import { demoProjects } from '@/lib/data';
import PageContainer from '@/components/PageContainer';
import ProjectFilterBar from '@/components/projects/ProjectFilterBar';
import ProjectFilterTabs from '@/components/projects/ProjectFilterTabs';
import { convertToProjectType, filterProjects } from '@/components/projects/utils/projectUtils';
import { useAuth } from '@/context/auth';
import { fetchUserProjects } from '@/api/projects/projectCrud';
import { useQuery } from '@tanstack/react-query';

const Projects = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);
  const { user } = useAuth();
  
  // Fetch user projects from Supabase
  const { data: userProjects, isLoading } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await fetchUserProjects(user.id);
    },
    enabled: !!user?.id
  });
  
  // Use demo projects as fallback if no user or no projects from Supabase
  const projectsSource = userProjects?.length ? userProjects : demoProjects;
  
  // Convert to ProjectType to ensure compatibility
  // Use any[] type to avoid the TypeScript error on input
  const typedProjects = React.useMemo(() => convertToProjectType(projectsSource as any[]), [projectsSource]);
  
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
          isLoading={isLoading}
        />
      </div>
    </PageContainer>
  );
};

export default Projects;
