
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates a project milestone using standard UPDATE query since RPC not available
 */
export const updateProjectMilestoneDirectly = async (milestoneId: string, updates: Record<string, any>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('project_milestones')
      .update(updates)
      .eq('id', milestoneId);

    if (error) {
      console.error('Error updating project milestone:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateProjectMilestoneDirectly:', error);
    return false;
  }
};

/**
 * Updates a project risk using standard UPDATE query since RPC not available
 */
export const updateProjectRiskDirectly = async (riskId: string, updates: Record<string, any>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('project_risks')
      .update(updates)
      .eq('id', riskId);

    if (error) {
      console.error('Error updating project risk:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateProjectRiskDirectly:', error);
    return false;
  }
};

/**
 * Updates a project financial record using standard UPDATE query since RPC not available
 */
export const updateProjectFinancialDirectly = async (financialId: string, updates: Record<string, any>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('project_financials')
      .update(updates)
      .eq('id', financialId);

    if (error) {
      console.error('Error updating project financial:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateProjectFinancialDirectly:', error);
    return false;
  }
};
