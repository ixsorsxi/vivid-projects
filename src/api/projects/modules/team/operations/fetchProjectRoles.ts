
import { supabase } from '@/integrations/supabase/client';
import { debugError, debugLog } from '@/utils/debugLogger';
import { ProjectRole, ProjectRoleKey } from '@/api/projects/modules/team/types';

/**
 * Fetches available project roles from the database
 * Using security definer function to avoid recursive RLS issues
 */
export const fetchProjectRoles = async (): Promise<ProjectRole[]> => {
  try {
    debugLog('API', 'Fetching project roles');
    
    // First attempt: Use the secure RPC function
    const { data, error } = await supabase.rpc('get_project_roles_v2');

    if (error) {
      debugError('API', 'Error with RPC project roles query:', error);
      
      // Second attempt: Direct query as fallback
      const { data: directData, error: directError } = await supabase
        .from('project_roles')
        .select('id, role_key, description')
        .order('role_key');
        
      if (directError || !directData) {
        debugError('API', 'Error with direct project_roles query:', directError);
        return getDefaultRoles();
      }
      
      if (directData && directData.length > 0) {
        debugLog('API', 'Successfully fetched project roles via direct query:', directData.length);
        
        // Filter out system-level roles (like 'admin') that shouldn't be 
        // available for project member assignments
        const systemRoles = ['admin']; // Add other system roles here if needed
        
        const projectRoles = directData.filter(
          (role) => !systemRoles.includes(role.role_key)
        );
        
        // Transform the data to match our ProjectRole type
        const typedRoles: ProjectRole[] = projectRoles.map((role) => ({
          id: role.id,
          role_key: role.role_key as ProjectRoleKey, // Cast the string to ProjectRoleKey type
          description: role.description
        }));
        
        return typedRoles;
      }
      
      return getDefaultRoles();
    }

    if (data && data.length > 0) {
      debugLog('API', 'Successfully fetched project roles via RPC:', data.length);
      
      // Filter out system-level roles (like 'admin') that shouldn't be 
      // available for project member assignments
      const systemRoles = ['admin']; // Add other system roles here if needed
      
      const projectRoles = data.filter(
        (role) => !systemRoles.includes(role.role_key)
      );
      
      // Transform the data to match our ProjectRole type
      const typedRoles: ProjectRole[] = projectRoles.map((role) => ({
        id: role.id,
        role_key: role.role_key as ProjectRoleKey, // Cast the string to ProjectRoleKey type
        description: role.description
      }));
      
      return typedRoles;
    }

    // If nothing was found, return defaults
    debugLog('API', 'No roles found, returning defaults');
    return getDefaultRoles();
    
  } catch (error) {
    debugError('API', 'Exception in fetchProjectRoles:', error);
    return getDefaultRoles();
  }
};

/**
 * Provides default roles when database retrieval fails
 */
const getDefaultRoles = (): ProjectRole[] => {
  const defaultRoles: ProjectRole[] = [
    { id: '1', role_key: 'team_member', description: 'Standard team member' },
    { id: '2', role_key: 'project_manager', description: 'Project manager with administrative permissions' },
    { id: '3', role_key: 'developer', description: 'Software developer' },
    { id: '4', role_key: 'designer', description: 'UI/UX designer' },
    { id: '5', role_key: 'client_stakeholder', description: 'Client with limited access' }
  ];
  debugLog('API', 'Using default roles', defaultRoles);
  return defaultRoles;
};
