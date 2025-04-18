
import { useState, useEffect } from 'react';
import { ProjectMilestone } from '@/lib/types/project';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

export function useProjectMilestones(projectId: string) {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMilestones = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      
      setMilestones(data || []);
    } catch (err) {
      console.error('Error fetching project milestones:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchMilestones();
    }
  }, [projectId]);

  const addMilestone = async (milestone: Omit<ProjectMilestone, 'id' | 'project_id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .insert({
          ...milestone,
          project_id: projectId
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setMilestones(prev => [...prev, data].sort((a, b) => 
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      ));
      
      toast.success('Milestone added', {
        description: 'The milestone has been added to the project'
      });
      
      return data;
    } catch (err) {
      console.error('Error adding project milestone:', err);
      toast.error('Failed to add milestone', {
        description: 'There was an error adding the milestone'
      });
      throw err;
    }
  };

  const updateMilestone = async (id: string, updates: Partial<ProjectMilestone>) => {
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .update(updates)
        .eq('id', id)
        .eq('project_id', projectId)
        .select()
        .single();
      
      if (error) throw error;
      
      setMilestones(prev => 
        prev.map(milestone => milestone.id === id ? data : milestone)
          .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      );
      
      toast.success('Milestone updated', {
        description: 'The milestone has been updated successfully'
      });
      
      return data;
    } catch (err) {
      console.error('Error updating project milestone:', err);
      toast.error('Failed to update milestone', {
        description: 'There was an error updating the milestone'
      });
      throw err;
    }
  };

  const deleteMilestone = async (id: string) => {
    try {
      const { error } = await supabase
        .from('project_milestones')
        .delete()
        .eq('id', id)
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      setMilestones(prev => prev.filter(milestone => milestone.id !== id));
      
      toast.success('Milestone deleted', {
        description: 'The milestone has been removed from the project'
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting project milestone:', err);
      toast.error('Failed to delete milestone', {
        description: 'There was an error deleting the milestone'
      });
      return false;
    }
  };

  return {
    milestones,
    isLoading,
    error,
    fetchMilestones,
    addMilestone,
    updateMilestone,
    deleteMilestone
  };
}
