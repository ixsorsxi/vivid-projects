
import { supabase } from '@/integrations/supabase/client';
import { debugError } from '@/utils/debugLogger';

/**
 * Fetches available project roles from the database
 */
export const fetchProjectRoles = async () => {
  try {
    const { data, error } = await supabase
      .from('project_roles')
      .select('id, role_key, description')
      .order('role_key');

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
