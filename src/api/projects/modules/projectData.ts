
import { supabase } from '@/integrations/supabase/client';
import { ProjectMilestone, ProjectRisk, ProjectFinancial } from '@/lib/types/project';

/**
 * Fetches milestones for a specific project
 */
export const fetchProjectMilestones = async (projectId: string): Promise<ProjectMilestone[]> => {
  try {
    if (!projectId) {
      console.error('No project ID provided for fetching milestones');
      return [];
    }

    const { data, error } = await supabase.rpc('get_project_milestones', { p_project_id: projectId });

    if (error) {
      console.error('Error fetching project milestones:', error);
      return [];
    }

    return data as ProjectMilestone[] || [];
  } catch (error) {
    console.error('Error in fetchProjectMilestones:', error);
    return [];
  }
};

/**
 * Fetches risks for a specific project
 */
export const fetchProjectRisks = async (projectId: string): Promise<ProjectRisk[]> => {
  try {
    if (!projectId) {
      console.error('No project ID provided for fetching risks');
      return [];
    }

    const { data, error } = await supabase.rpc('get_project_risks', { p_project_id: projectId });

    if (error) {
      console.error('Error fetching project risks:', error);
      return [];
    }

    return data as ProjectRisk[] || [];
  } catch (error) {
    console.error('Error in fetchProjectRisks:', error);
    return [];
  }
};

/**
 * Fetches financial data for a specific project
 */
export const fetchProjectFinancials = async (projectId: string): Promise<ProjectFinancial[]> => {
  try {
    if (!projectId) {
      console.error('No project ID provided for fetching financials');
      return [];
    }

    const { data, error } = await supabase.rpc('get_project_financials', { p_project_id: projectId });

    if (error) {
      console.error('Error fetching project financials:', error);
      return [];
    }

    return data as ProjectFinancial[] || [];
  } catch (error) {
    console.error('Error in fetchProjectFinancials:', error);
    return [];
  }
};

/**
 * Adds a new milestone to a project
 */
export const addProjectMilestone = async (projectId: string, milestone: Omit<ProjectMilestone, 'id' | 'project_id' | 'created_at'>): Promise<ProjectMilestone | null> => {
  try {
    // Use our RPC function to add a milestone
    const { data, error } = await supabase.rpc('add_project_milestone', { 
      p_project_id: projectId,
      p_title: milestone.title,
      p_description: milestone.description || '',
      p_due_date: milestone.due_date,
      p_status: milestone.status
    });

    if (error) {
      console.error('Error adding project milestone:', error);
      return null;
    }

    // Fetch the newly created milestone
    if (data) {
      const { data: newMilestone, error: fetchError } = await supabase
        .rpc('get_project_milestones', { p_project_id: projectId });
        
      if (fetchError) {
        console.error('Error fetching new milestone:', fetchError);
      } else {
        const milestone = newMilestone.find((m: any) => m.id === data);
        if (milestone) {
          return milestone as ProjectMilestone;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error in addProjectMilestone:', error);
    return null;
  }
};

/**
 * Updates an existing project milestone
 */
export const updateProjectMilestone = async (milestoneId: string, updates: Partial<ProjectMilestone>): Promise<boolean> => {
  try {
    const updateData: Record<string, any> = {};
    
    // Only include fields that are provided in the updates
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.due_date !== undefined) updateData.due_date = updates.due_date;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.completion_date !== undefined) updateData.completion_date = updates.completion_date;

    // Since we can't use direct table access, we need to use a custom RPC function
    // For now, let's use the update method and rely on RLS policies
    const { error } = await supabase
      .from('project_milestones')
      .update(updateData)
      .eq('id', milestoneId);

    if (error) {
      console.error('Error updating project milestone:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateProjectMilestone:', error);
    return false;
  }
};

/**
 * Adds a new risk to a project
 */
export const addProjectRisk = async (projectId: string, risk: Omit<ProjectRisk, 'id' | 'project_id' | 'created_at'>): Promise<ProjectRisk | null> => {
  try {
    // Use our RPC function to add a risk
    const { data, error } = await supabase.rpc('add_project_risk', {
      p_project_id: projectId,
      p_title: risk.title,
      p_description: risk.description || '',
      p_severity: risk.severity,
      p_probability: risk.probability,
      p_impact: risk.impact,
      p_mitigation_plan: risk.mitigation_plan || '',
      p_status: risk.status
    });

    if (error) {
      console.error('Error adding project risk:', error);
      return null;
    }

    // Fetch the newly created risk
    if (data) {
      const { data: newRisks, error: fetchError } = await supabase
        .rpc('get_project_risks', { p_project_id: projectId });
        
      if (fetchError) {
        console.error('Error fetching new risk:', fetchError);
      } else {
        const risk = newRisks.find((r: any) => r.id === data);
        if (risk) {
          return risk as ProjectRisk;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error in addProjectRisk:', error);
    return null;
  }
};

/**
 * Updates an existing project risk
 */
export const updateProjectRisk = async (riskId: string, updates: Partial<ProjectRisk>): Promise<boolean> => {
  try {
    const updateData: Record<string, any> = {};
    
    // Only include fields that are provided in the updates
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.severity !== undefined) updateData.severity = updates.severity;
    if (updates.probability !== undefined) updateData.probability = updates.probability;
    if (updates.impact !== undefined) updateData.impact = updates.impact;
    if (updates.mitigation_plan !== undefined) updateData.mitigation_plan = updates.mitigation_plan;
    if (updates.status !== undefined) updateData.status = updates.status;

    const { error } = await supabase
      .from('project_risks')
      .update(updateData)
      .eq('id', riskId);

    if (error) {
      console.error('Error updating project risk:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateProjectRisk:', error);
    return false;
  }
};

/**
 * Adds a new financial transaction to a project
 */
export const addProjectFinancial = async (projectId: string, financial: Omit<ProjectFinancial, 'id' | 'project_id' | 'created_at'>): Promise<ProjectFinancial | null> => {
  try {
    // Use our RPC function to add a financial record
    const { data, error } = await supabase.rpc('add_project_financial', {
      p_project_id: projectId,
      p_transaction_date: financial.transaction_date,
      p_amount: financial.amount,
      p_transaction_type: financial.transaction_type,
      p_category: financial.category,
      p_description: financial.description || '',
      p_payment_status: financial.payment_status
    });

    if (error) {
      console.error('Error adding project financial:', error);
      return null;
    }

    // Fetch the newly created financial record
    if (data) {
      const { data: newFinancials, error: fetchError } = await supabase
        .rpc('get_project_financials', { p_project_id: projectId });
        
      if (fetchError) {
        console.error('Error fetching new financial record:', fetchError);
      } else {
        const financial = newFinancials.find((f: any) => f.id === data);
        if (financial) {
          return financial as ProjectFinancial;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error in addProjectFinancial:', error);
    return null;
  }
};

/**
 * Updates an existing project financial transaction
 */
export const updateProjectFinancial = async (financialId: string, updates: Partial<ProjectFinancial>): Promise<boolean> => {
  try {
    const updateData: Record<string, any> = {};
    
    // Only include fields that are provided in the updates
    if (updates.transaction_date !== undefined) updateData.transaction_date = updates.transaction_date;
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.transaction_type !== undefined) updateData.transaction_type = updates.transaction_type;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.payment_status !== undefined) updateData.payment_status = updates.payment_status;

    const { error } = await supabase
      .from('project_financials')
      .update(updateData)
      .eq('id', financialId);

    if (error) {
      console.error('Error updating project financial:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateProjectFinancial:', error);
    return false;
  }
};
