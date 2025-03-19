
import React from 'react';
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
  
  // Fetch user projects from Supabase with improved error handling
  const { data: userProjects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        console.log("Fetching projects for user:", user.id);
        const projects = await fetchUserProjects(user.id);
        console.log("Fetched projects successfully:", projects);
        return projects;
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        
        // Show a more specific error message based on error type
        if (error?.message && error.message.includes('permission') || error?.message && error.message.includes('policy')) {
          toast.error("Access issue detected", {
            description: "Database access is currently restricted. This might be due to temporary permissions issues. Please try again in a moment."
          });
        } else if (error?.message && error.message.includes('JWSError')) {
          toast.error("Authentication issue", {
            description: "Your session may have expired. Please try logging out and back in."
          });
        } else {
          // Generic error message for other errors
          toast.error("Failed to load projects", {
            description: error?.message || "An unexpected error occurred"
          });
        }
        
        // Return empty array to avoid breaking the UI
        return [];
      }
    },
    enabled: !!user?.id && isAuthenticated,
    retry: 2,
    retryDelay: 1500,
  });
  
  // Convert to ProjectType to ensure compatibility
  const typedProjects = React.useMemo(() => {
    try {
      return convertToProjectType(userProjects || []);
    } catch (error) {
      console.error("Error converting projects:", error);
      return [];
    }
  }, [userProjects]);
  
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
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your projects...</p>
          </div>
        ) : (
          <>
            {error ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Unable to load projects</p>
                <div className="flex flex-col gap-2 items-center">
                  <button 
                    className="bg-primary text-white px-4 py-2 rounded-md"
                    onClick={() => refetch()}
                  >
                    Try Again
                  </button>
                  <p className="text-sm text-muted-foreground mt-2">
                    If this issue persists, try refreshing the page or logging out and back in.
                  </p>
                </div>
              </div>
            ) : (
              <ProjectFilterTabs 
                filteredProjects={filteredProjects} 
                setFilterStatus={setFilterStatus}
                isLoading={isLoading} 
              />
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default Projects;
