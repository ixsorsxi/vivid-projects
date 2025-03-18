import React from 'react';
import { demoProjects } from '@/lib/data';
import PageContainer from '@/components/PageContainer';
import ProjectFilterBar from '@/components/projects/ProjectFilterBar';
import ProjectFilterTabs from '@/components/projects/ProjectFilterTabs';
import { convertToProjectType, filterProjects } from '@/components/projects/utils/projectUtils';
import { useAuth } from '@/context/auth';
import { fetchUserProjects } from '@/api/projects/projectCrud';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast-wrapper';

const Projects = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  
  // Fetch user projects from Supabase with improved error handling
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
        // Show error toast to user
        toast.error("Failed to load projects", {
          description: "Please try again later",
        });
        return [];
      }
    },
    enabled: !!user?.id && isAuthenticated,
    retry: 1,
    retryDelay: 1000,
  });
  
  // Use demo projects as fallback if no user or no projects from Supabase
  const projectsSource = React.useMemo(() => {
    if (Array.isArray(userProjects) && userProjects.length > 0) {
      return userProjects;
    }
    
    // If user is authenticated but no projects, show empty array instead of demo projects
    if (isAuthenticated && !isLoading) {
      return [];
    }
    
    // Otherwise use demo projects
    return demoProjects;
  }, [userProjects, isAuthenticated, isLoading]);
  
  // Convert to ProjectType to ensure compatibility
  const typedProjects = React.useMemo(() => {
    try {
      return convertToProjectType(projectsSource);
    } catch (error) {
      console.error("Error converting projects:", error);
      return [];
    }
  }, [projectsSource]);
  
  // Filter projects based on search query and status filter
  const filteredProjects = React.useMemo(() => {
    try {
      return filterProjects(typedProjects, searchQuery, filterStatus);
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
