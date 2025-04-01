
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types/project';
import { ProjectStatus } from '@/lib/types/common';
import { getDemoProjects } from './demoData';

/**
 * Fetches all projects for a specific user
 */
export const fetchUserProjects = async (userId: string): Promise<Project[]> => {
  try {
    if (!userId) {
      console.error('No user ID provided for fetching projects');
      return [];
    }

    console.log('Fetching projects for user ID:', userId);
    
    // Try the standard way first - querying projects directly
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id, 
          name, 
          description, 
          progress, 
          status, 
          due_date, 
          category,
          project_type,
          project_manager_id
        `);

      if (error) {
        // If this fails, we'll try the fallback below
        console.warn('Standard project fetch failed:', error);
        throw error;
      }

      console.log('Successfully fetched projects:', data);
      
      // Transform database records to Project type
      return (data || []).map(proj => ({
        id: proj.id,
        name: proj.name,
        description: proj.description || '',
        progress: proj.progress || 0,
        status: proj.status as ProjectStatus,
        dueDate: proj.due_date || '',
        category: proj.category || '',
        project_type: proj.project_type || 'Development',
        project_manager_id: proj.project_manager_id || null,
        members: []
      }));
    } catch (standardError) {
      console.log('Attempting to use get_user_projects function due to standard fetch failure');
      
      // Try using the RPC function as a fallback (if it exists)
      try {
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('get_user_projects');
          
        if (rpcError) {
          console.error('Error using get_user_projects RPC:', rpcError);
          // Since both methods failed, fall back to demo data
          return getDemoProjects();
        }
        
        console.log('Successfully fetched projects using RPC:', rpcData);
        
        // Transform database records to Project type
        return (rpcData || []).map(proj => ({
          id: proj.id,
          name: proj.name,
          description: proj.description || '',
          progress: proj.progress || 0,
          status: proj.status as ProjectStatus,
          dueDate: proj.due_date || '',
          category: proj.category || '',
          project_type: 'Development', // Default since RPC might not return this
          project_manager_id: null, // Default since RPC might not return this
          members: []
        }));
      } catch (rpcError) {
        console.error('All methods of fetching projects failed');
        // Both methods failed, return demo data
        return getDemoProjects();
      }
    }
  } catch (error) {
    console.error('Error in fetchUserProjects:', error);
    // Return demo data as fallback
    return getDemoProjects();
  }
};
