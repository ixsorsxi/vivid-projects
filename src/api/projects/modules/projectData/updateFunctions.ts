
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates a project milestone directly via the table
 */
export const updateProjectMilestoneDirectly = async (milestoneId: string, updates: Record<string, any>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('project_milestones')
      .update(updates)
      .eq('id', milestoneId);
    
    if (error) {
      console.error('Error updating milestone:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in updateProjectMilestoneDirectly:', error);
    return false;
  }
};

/**
 * Updates a project risk directly via the table
 */
export const updateProjectRiskDirectly = async (riskId: string, updates: Record<string, any>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('project_risks')
      .update(updates)
      .eq('id', riskId);
    
    if (error) {
      console.error('Error updating risk:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in updateProjectRiskDirectly:', error);
    return false;
  }
};

/**
 * Updates a project financial record directly via the table
 */
export const updateProjectFinancialDirectly = async (financialId: string, updates: Record<string, any>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('project_financials')
      .update(updates)
      .eq('id', financialId);
    
    if (error) {
      console.error('Error updating financial record:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in updateProjectFinancialDirectly:', error);
    return false;
  }
};
