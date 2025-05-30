
import { supabase } from '@/integrations/supabase/client';
import { ProjectFinancial } from '@/lib/types/project';
import { updateProjectFinancialDirectly } from './updateFunctions';

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

    // Add explicit type cast to handle JSON conversion
    return (data || []) as unknown as ProjectFinancial[];
  } catch (error) {
    console.error('Error in fetchProjectFinancials:', error);
    return [];
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
      p_transaction_date: financial.transaction_date || financial.date,
      p_amount: financial.amount,
      p_transaction_type: financial.transaction_type || financial.type,
      p_category: financial.category,
      p_description: financial.description || '',
      p_payment_status: financial.payment_status || 'pending'
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
          return financial as unknown as ProjectFinancial;
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
    if (updates.transaction_date !== undefined || updates.date !== undefined) updateData.transaction_date = updates.transaction_date || updates.date;
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.transaction_type !== undefined || updates.type !== undefined) updateData.transaction_type = updates.transaction_type || updates.type;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.payment_status !== undefined) updateData.payment_status = updates.payment_status;

    // Use direct table update instead of RPC
    return await updateProjectFinancialDirectly(financialId, updateData);
  } catch (error) {
    console.error('Error in updateProjectFinancial:', error);
    return false;
  }
};
