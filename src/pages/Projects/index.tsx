
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
  const { data: userProjects, isLoading, error } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        const projects = await fetchUserProjects(user.id);
        console.log("Fetched projects:", projects);
        return projects;
      } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
      }
    },
    enabled: !!user?.id
  });
  
  console.log("User:", user);
  console.log("User projects:", userProjects);
  
  // Use demo projects as fallback if no user or no projects from Supabase
  const projectsSource = Array.isArray(userProjects) && userProjects.length > 0 ? userProjects : demoProjects;
  console.log("Projects source:", projectsSource);
  
  // Convert to ProjectType to ensure compatibility
  const typedProjects = React.useMemo(() => {
    try {
      const converted = convertToProjectType(projectsSource);
      console.log("Converted projects:", converted);
      return converted;
    } catch (error) {
      console.error("Error converting projects:", error);
      return [];
    }
  }, [projectsSource]);
  
  // Filter projects based on search query and status filter
  const filteredProjects = React.useMemo(() => {
    try {
      const filtered = filterProjects(typedProjects, searchQuery, filterStatus);
      console.log("Filtered projects:", filtered);
      return filtered;
    } catch (error) {
      console.error("Error filtering projects:", error);
      return [];
    }
  }, [typedProjects, searchQuery, filterStatus]);

  if (error) {
    console.error("Project fetch error:", error);
  }

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
