
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates a project milestone using standard UPDATE query since RPC not available
 */
export const updateProjectMilestoneDirectly = async (milestoneId: string, updates: Record<string, any>): Promise<boolean> => {
  try {
    // Use RPC to update milestone instead of direct table access
    const { error } = await supabase.rpc('update_milestone', {
      p_milestone_id: milestoneId,
      p_updates: updates
    });

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
    // Use RPC to update risk instead of direct table access
    const { error } = await supabase.rpc('update_risk', {
      p_risk_id: riskId,
      p_updates: updates
    });

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
    // Use RPC to update financial instead of direct table access
    const { error } = await supabase.rpc('update_financial', {
      p_financial_id: financialId,
      p_updates: updates
    });

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
