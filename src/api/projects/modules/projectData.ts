
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

    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching project milestones:', error);
      return [];
    }

    return data || [];
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

    const { data, error } = await supabase
      .from('project_risks')
      .select('*')
      .eq('project_id', projectId)
      .order('severity', { ascending: false });

    if (error) {
      console.error('Error fetching project risks:', error);
      return [];
    }

    return data || [];
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

    const { data, error } = await supabase
      .from('project_financials')
      .select('*')
      .eq('project_id', projectId)
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error('Error fetching project financials:', error);
      return [];
    }

    return data || [];
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
    const { data, error } = await supabase
      .from('project_milestones')
      .insert([
        {
          project_id: projectId,
          title: milestone.title,
          description: milestone.description,
          due_date: milestone.due_date,
          status: milestone.status
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding project milestone:', error);
      return null;
    }

    return data;
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
    console.error('Error in updateProjectMilestone:', error);
    return false;
  }
};

/**
 * Adds a new risk to a project
 */
export const addProjectRisk = async (projectId: string, risk: Omit<ProjectRisk, 'id' | 'project_id' | 'created_at'>): Promise<ProjectRisk | null> => {
  try {
    const { data, error } = await supabase
      .from('project_risks')
      .insert([
        {
          project_id: projectId,
          title: risk.title,
          description: risk.description,
          severity: risk.severity,
          probability: risk.probability,
          impact: risk.impact,
          mitigation_plan: risk.mitigation_plan,
          status: risk.status
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding project risk:', error);
      return null;
    }

    return data;
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
    console.error('Error in updateProjectRisk:', error);
    return false;
  }
};

/**
 * Adds a new financial transaction to a project
 */
export const addProjectFinancial = async (projectId: string, financial: Omit<ProjectFinancial, 'id' | 'project_id' | 'created_at'>): Promise<ProjectFinancial | null> => {
  try {
    const { data, error } = await supabase
      .from('project_financials')
      .insert([
        {
          project_id: projectId,
          transaction_date: financial.transaction_date,
          amount: financial.amount,
          transaction_type: financial.transaction_type,
          category: financial.category,
          description: financial.description,
          payment_status: financial.payment_status
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding project financial:', error);
      return null;
    }

    return data;
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
    console.error('Error in updateProjectFinancial:', error);
    return false;
  }
};
