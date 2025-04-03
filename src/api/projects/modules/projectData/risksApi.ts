
import { supabase } from '@/integrations/supabase/client';
import { ProjectRisk } from '@/lib/types/project';

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

    return (data || []) as unknown as ProjectRisk[];
  } catch (error) {
    console.error('Error in fetchProjectRisks:', error);
    return [];
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
          return risk as unknown as ProjectRisk;
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

    // Use RPC for updates instead of direct table access
    const { error } = await supabase.rpc('update_project_risk', {
      p_risk_id: riskId,
      p_update_data: updateData
    });

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
