
import React from 'react';
import { demoProjects } from '@/lib/data';
import PageContainer from '@/components/PageContainer';
import ProjectFilterBar from '@/components/projects/ProjectFilterBar';
import ProjectFilterTabs from '@/components/projects/ProjectFilterTabs';
import { convertToProjectType, filterProjects } from '@/components/projects/utils/projectUtils';
import { useAuth } from '@/context/auth';
import { fetchUserProjects } from '@/api/projects';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast-wrapper';
import NewProjectModal from '@/components/projects/NewProjectModal';
import ProjectsList from '@/components/projects/ProjectsList';

const Projects = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const [useDemo, setUseDemo] = React.useState(false);
  
  // Fetch user projects from Supabase with improved error handling
  const { data: userProjects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        console.log("Fetching projects for user:", user.id);
        const projects = await fetchUserProjects(user.id);
        console.log("Fetched projects successfully:", projects);
        
        if (projects.length > 0) {
          setUseDemo(false); // Successfully loaded real data
          return projects;
        }
        
        return projects;
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        
        // Only show error toast if it's not an auth-related issue
        if (error.message && !error.message.includes('auth')) {
          toast.error("Failed to load projects", {
            description: error?.message || "An unexpected error occurred",
          });
        }
        
        // Return empty array for real user data
        return [];
      }
    },
    enabled: !!user?.id && isAuthenticated,
    retry: 1,
    retryDelay: 1000,
  });
  
  // Use demo projects as fallback only if explicit flag is set or not authenticated
  const projectsSource = React.useMemo(() => {
    // If there are real user projects, use them
    if (Array.isArray(userProjects) && userProjects.length > 0) {
      return userProjects;
    }
    
    // If not authenticated or useDemo flag is set, use demo projects
    if (!isAuthenticated || useDemo) {
      return demoProjects;
    }
    
    // If authenticated, but no projects, show empty array
    return [];
  }, [userProjects, isAuthenticated, useDemo]);
  
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

  // Force refresh projects when component mounts
  React.useEffect(() => {
    if (isAuthenticated && user) {
      refetch();
    }
  }, [isAuthenticated, user, refetch]);

  if (error) {
    console.error("Project fetch error:", error);
  }

  const showDemoWarning = useDemo && isAuthenticated;

  return (
    <PageContainer title="Projects" subtitle="Manage and track all your projects">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <ProjectFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <NewProjectModal />
        </div>
        
        {showDemoWarning && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Using demo projects due to a database configuration issue. Created projects may not persist between sessions.
                </p>
              </div>
            </div>
          </div>
        )}
        
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
