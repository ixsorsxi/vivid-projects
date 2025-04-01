
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types/project';
import { toast } from '@/components/ui/toast-wrapper';
import { timeoutPromise, handleDatabaseError } from './utils';
import { fetchProjectByIdRPC, fetchProjectByIdDirect } from './modules/projectById';
import { fetchUserProjects } from './modules/userProjects';
import { 
  fetchProjectMilestones, 
  fetchProjectRisks, 
  fetchProjectFinancials 
} from './modules/projectData';

export const fetchProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    if (!projectId) {
      console.error('No project ID provided');
      return null;
    }

    console.log('Attempting to fetch project with ID:', projectId);
    
    // Try using the RPC function first
    try {
      return await fetchProjectByIdRPC(projectId);
    } catch (rpcError) {
      // Fallback to direct table query if RPC approach fails
      console.log('RPC method failed, falling back to direct query');
      return await fetchProjectByIdDirect(projectId);
    }
  } catch (error) {
    console.error('Error in fetchProjectById:', error);
    throw error;
  }
};

// Re-export the modules
export {
  fetchUserProjects,
  fetchProjectMilestones,
  fetchProjectRisks,
  fetchProjectFinancials
};
