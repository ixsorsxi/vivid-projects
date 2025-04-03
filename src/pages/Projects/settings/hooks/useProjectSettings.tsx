
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { Project } from '@/lib/types/project';

interface ProjectSettingsProps {
  project: Project;
}

export const useProjectSettings = ({ project }: ProjectSettingsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Project settings state
  const [settings, setSettings] = useState({
    projectName: project?.name || '',
    projectSlug: project?.id || '',
    visibility: 'private',
    emailNotifications: true,
    taskReminders: true,
    category: project?.category || 'Development'
  });
  
  // Handler for settings changes
  const handleSettingChange = useCallback((key: string, value: any) => {
    console.log(`Setting ${key} to:`, value);
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value
    }));
  }, []);
  
  // Update project information
  const updateProjectSettings = useCallback(async (updates: any) => {
    if (!project?.id) {
      console.error('No project ID available for update');
      return false;
    }
    
    setIsUpdating(true);
    console.log("Updating project settings with:", updates);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: updates.projectName || settings.projectName,
          category: updates.category || settings.category
          // Add other fields as needed
        })
        .eq('id', project.id)
        .select();
      
      if (error) {
        console.error('Error updating project:', error);
        toast.error("Failed to update project", {
          description: error.message
        });
        return false;
      }
      
      toast.success("Project settings updated", {
        description: "Your changes have been saved successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error in updateProjectSettings:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [project?.id, settings]);
  
  // Delete project
  const handleDeleteProject = useCallback(async () => {
    if (!project?.id) return;
    
    setIsDeleting(true);
    
    try {
      const { data, error } = await supabase
        .rpc('delete_project', { p_project_id: project.id });
      
      if (error) {
        console.error('Error deleting project:', error);
        toast.error("Failed to delete project", {
          description: error.message
        });
        return;
      }
      
      toast.success("Project deleted", {
        description: "The project has been permanently deleted"
      });
    } catch (error) {
      console.error('Error in handleDeleteProject:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [project?.id]);
  
  return {
    settings,
    handleSettingChange,
    updateProjectSettings,
    isUpdating,
    handleDeleteProject,
    isDeleting
  };
};
