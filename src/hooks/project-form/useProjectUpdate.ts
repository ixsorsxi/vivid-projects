
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { Project } from '@/lib/types/project';

export interface ProjectUpdateData {
  name: string;
  description: string;
  project_manager_id?: string;
  project_manager_name?: string;
  status: string;
  start_date?: string;
  due_date?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  progress?: number;
  estimated_cost?: number;
  budget_approved?: boolean;
  risk_level?: 'low' | 'medium' | 'high';
}

export const useProjectUpdate = (projectId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to update a project
  const updateProject = async (data: ProjectUpdateData): Promise<boolean> => {
    if (!projectId) {
      setError("No project ID provided");
      return false;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Updating project with data:", data);

      // Map the form fields to database fields
      const dbData = {
        name: data.name,
        description: data.description,
        status: data.status,
        project_manager_id: data.project_manager_id,
        project_manager_name: data.project_manager_name,
        start_date: data.start_date ? new Date(data.start_date).toISOString() : null,
        due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
        category: data.category,
        priority: data.priority,
        progress: data.progress,
        estimated_cost: data.estimated_cost,
        budget_approved: data.budget_approved,
        // Using the performance_index field to store risk level as a number
        performance_index: data.risk_level === 'high' ? 0.5 : data.risk_level === 'medium' ? 1.0 : 1.5
      };

      // Update the project in Supabase
      const { data: updatedProject, error: updateError } = await supabase
        .from('projects')
        .update(dbData)
        .eq('id', projectId)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating project:", updateError);
        setError(updateError.message);
        toast.error("Failed to update project", {
          description: updateError.message
        });
        return false;
      }

      console.log("Project updated successfully:", updatedProject);
      toast.success("Project updated", {
        description: "Project details have been successfully updated"
      });
      return true;
    } catch (err: any) {
      console.error("Unexpected error updating project:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      toast.error("Failed to update project", {
        description: err instanceof Error ? err.message : "Unknown error occurred"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    updateProject,
    isSubmitting,
    error
  };
};

export default useProjectUpdate;
