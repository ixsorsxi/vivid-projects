
import { supabase } from '@/integrations/supabase/client';
import { ProjectMilestone } from '@/lib/types/project';

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
