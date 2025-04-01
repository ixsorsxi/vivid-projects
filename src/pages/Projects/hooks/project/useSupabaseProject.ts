
import { useQuery } from '@tanstack/react-query';
import { fetchProjectById } from '@/api/projects/projectFetch';
import { useAuth } from '@/context/auth';
import { toast } from '@/components/ui/toast-wrapper';
import { Project } from '@/lib/types/project';

/**
 * Hook for fetching project data from Supabase with robust error handling
 */
export const useSupabaseProject = (projectId: string) => {
  const { user } = useAuth();
  
  const { 
    data: project, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId || !user) return null;
      try {
        console.log("Fetching project details for:", projectId);
        const fetchedProject = await fetchProjectById(projectId);
        console.log("Fetched project details:", fetchedProject);
        
        if (fetchedProject && (!fetchedProject.name || fetchedProject.name.includes(fetchedProject.id))) {
          console.warn("Project name appears to be an ID. This might be incorrect data.");
        }
        
        return fetchedProject;
      } catch (err: any) {
        console.error("Error fetching project:", err);
        
        // Show appropriate error message based on error type
        if (err.message && err.message.includes('permission')) {
          toast.error("Access restricted", {
            description: "You don't have permission to view this project."
          });
        } else if (err.message && err.message.includes('recursion')) {
          toast.error("Database configuration issue", {
            description: "There's an issue with the database security policies. Please try refreshing the page."
          });
        } else if (!err.message || !err.message.includes('auth')) {
          toast.error("Error loading project", {
            description: err?.message || "An unexpected error occurred"
          });
        }
        
        return null;
      }
    },
    enabled: !!user && !!projectId,
    retry: 2,
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true,
    refetchInterval: 5000, // Poll every 5 seconds for updates
  });

  return {
    project,
    isLoading,
    error,
    refetch
  };
};
