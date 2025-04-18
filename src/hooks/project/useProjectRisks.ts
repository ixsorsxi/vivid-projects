
import { useState, useEffect } from 'react';
import { ProjectRisk } from '@/lib/types/project';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

export function useProjectRisks(projectId: string) {
  const [risks, setRisks] = useState<ProjectRisk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRisks = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('project_risks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setRisks(data || []);
    } catch (err) {
      console.error('Error fetching project risks:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchRisks();
    }
  }, [projectId]);

  const addRisk = async (risk: Omit<ProjectRisk, 'id' | 'project_id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('project_risks')
        .insert({
          ...risk,
          project_id: projectId
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setRisks(prev => [data, ...prev]);
      toast.success('Risk added', {
        description: 'The risk has been added to the project'
      });
      
      return data;
    } catch (err) {
      console.error('Error adding project risk:', err);
      toast.error('Failed to add risk', {
        description: 'There was an error adding the risk'
      });
      throw err;
    }
  };

  const updateRisk = async (id: string, updates: Partial<ProjectRisk>) => {
    try {
      const { data, error } = await supabase
        .from('project_risks')
        .update(updates)
        .eq('id', id)
        .eq('project_id', projectId)
        .select()
        .single();
      
      if (error) throw error;
      
      setRisks(prev => prev.map(risk => risk.id === id ? data : risk));
      toast.success('Risk updated', {
        description: 'The risk has been updated successfully'
      });
      
      return data;
    } catch (err) {
      console.error('Error updating project risk:', err);
      toast.error('Failed to update risk', {
        description: 'There was an error updating the risk'
      });
      throw err;
    }
  };

  const deleteRisk = async (id: string) => {
    try {
      const { error } = await supabase
        .from('project_risks')
        .delete()
        .eq('id', id)
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      setRisks(prev => prev.filter(risk => risk.id !== id));
      toast.success('Risk deleted', {
        description: 'The risk has been removed from the project'
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting project risk:', err);
      toast.error('Failed to delete risk', {
        description: 'There was an error deleting the risk'
      });
      return false;
    }
  };

  return {
    risks,
    isLoading,
    error,
    fetchRisks,
    addRisk,
    updateRisk,
    deleteRisk
  };
}
