
import { supabase } from '@/integrations/supabase/client';
import { debugError } from '@/utils/debugLogger';

/**
 * Fetches available project roles from the database
 */
export const fetchProjectRoles = async () => {
  try {
    const { data, error } = await supabase.rpc(
      'get_project_roles'
    );

    if (error) {
      debugError('API', 'Error fetching project roles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    debugError('API', 'Exception in fetchProjectRoles:', error);
    return [];
  }
};
