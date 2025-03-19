
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

const Projects = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  
  // State to track if we're using demo data due to database errors
  const [usingDemoData, setUsingDemoData] = React.useState(false);
  
  // Fetch user projects from Supabase with improved error handling
  const { data: userProjects, isLoading, error } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        const projects = await fetchUserProjects(user.id);
        setUsingDemoData(false);
        console.log("Fetched projects:", projects);
        return projects;
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        
        // Show more specific error messages based on the error type
        if (error?.message?.includes('infinite recursion')) {
          toast.error("Database configuration issue", {
            description: "Using demo projects until database issues are resolved.",
          });
        } else {
          toast.error("Failed to load projects", {
            description: "Using demo data as fallback",
          });
        }
        
        // Set flag to indicate we're using demo data
        setUsingDemoData(true);
        return [];
      }
    },
    enabled: !!user?.id && isAuthenticated,
    retry: 1,
    retryDelay: 1000,
  });
  
  // Use demo projects as fallback if no user or no projects from Supabase
  const projectsSource = React.useMemo(() => {
    // If using demo data due to error, always use demo projects
    if (usingDemoData) {
      return demoProjects;
    }
    
    // If there are real user projects, use them
    if (Array.isArray(userProjects) && userProjects.length > 0) {
      return userProjects;
    }
    
    // If user is authenticated but no projects or there was an error, show empty array
    if (isAuthenticated && !isLoading && !usingDemoData) {
      return [];
    }
    
    // Otherwise use demo projects
    return demoProjects;
  }, [userProjects, isAuthenticated, isLoading, usingDemoData]);
  
  // Convert to ProjectType to ensure compatibility with safe fallback
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
        <div className="flex justify-between items-center">
          <ProjectFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <NewProjectModal />
        </div>
        
        {usingDemoData && isAuthenticated && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Using demo projects due to database issues. Your changes won't be saved.
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
