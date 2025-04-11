
import { supabase } from '@/integrations/supabase/client';
import { debugError } from '@/utils/debugLogger';
import { ProjectRole } from '@/api/projects/modules/team/types';

/**
 * Fetches available project roles from the database
 * Filters out system roles that shouldn't be available for project assignments
 */
export const fetchProjectRoles = async (): Promise<ProjectRole[]> => {
  try {
    const { data, error } = await supabase.rpc(
      'get_project_roles'
    );

    if (error) {
      debugError('API', 'Error fetching project roles:', error);
      return [];
    }

    // Filter out system-level roles (like 'admin') that shouldn't be 
    // available for project member assignments
    const systemRoles = ['admin']; // Add other system roles here if needed
    
    const projectRoles = (data || []).filter(
      (role: any) => !systemRoles.includes(role.role_key)
    );
    
    console.log('Filtered project roles:', projectRoles);
    
    // Transform the data to match our ProjectRole type
    const typedRoles: ProjectRole[] = projectRoles.map((role: any) => ({
      id: role.id,
      role_key: role.role_key as string,
      description: role.description
    }));
    
    return typedRoles;
  } catch (error) {
    debugError('API', 'Exception in fetchProjectRoles:', error);
    return [];
  }
};
