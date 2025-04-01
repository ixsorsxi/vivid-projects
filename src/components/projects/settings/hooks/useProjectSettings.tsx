
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types/project';
import { useProjectDelete } from './useProjectDelete';
import { handleDatabaseError } from '@/api/projects/utils';

interface UseProjectSettingsProps {
  project?: Project;
}

export const useProjectSettings = (props?: UseProjectSettingsProps) => {
  const [settings, setSettings] = useState({
    visibility: "private",
    emailNotifications: true,
    taskReminders: true,
    projectName: props?.project?.name || "Current Project",
    projectSlug: props?.project?.id || "current-project",
    category: props?.project?.category || "Development"
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { deleteProject } = useProjectDelete({
    projectId: props?.project?.id || '',
    onSuccess: () => {
      // This callback will be executed when the project is successfully deleted
      toast.error("Project deleted", {
        description: "The project has been successfully deleted.",
      });
    }
  });
  
  // Update settings when project data changes
  useEffect(() => {
    if (props?.project) {
      setSettings(prev => ({
        ...prev,
        projectName: props.project?.name || prev.projectName,
        projectSlug: props.project?.id || prev.projectSlug,
        category: props.project?.category || prev.category,
      }));
    }
  }, [props?.project]);
  
  const handleSettingChange = (
    settingKey: keyof typeof settings,
    value: string | boolean
  ) => {
    setSettings({
      ...settings,
      [settingKey]: value
    });
  };
  
  // Batch update project settings
  const updateProjectSettings = async (updates: Partial<typeof settings>) => {
    if (!props?.project?.id) {
      toast.error("Cannot update project", {
        description: "No project ID provided.",
      });
      return false;
    }
    
    setIsUpdating(true);
    
    try {
      // Convert setting keys to database field names
      const dbUpdates: Record<string, any> = {};
      
      if (updates.projectName !== undefined) {
        dbUpdates.name = updates.projectName;
      }
      
      if (updates.category !== undefined) {
        dbUpdates.category = updates.category;
      }
      
      // Only proceed if we have updates to make
      if (Object.keys(dbUpdates).length === 0) {
        return true;
      }
      
      console.log("Updating project with:", dbUpdates);
      
      // Use the update_project_settings function instead of direct update
      // This function has proper security definer context to avoid recursion issues
      const { data, error } = await supabase.rpc(
        'update_project_settings',
        {
          p_project_id: props.project.id,
          p_name: dbUpdates.name || props.project.name,
          p_description: props.project.description || '',
          p_category: dbUpdates.category || props.project.category || 'Development',
          p_status: props.project.status || 'in-progress'
        }
      );
        
      if (error) {
        console.error("Error updating project settings:", error);
        const apiError = handleDatabaseError(error);
        toast.error("Failed to update project", {
          description: apiError.message || "There was a problem updating the project settings.",
        });
        return false;
      }
      
      // Update local state
      setSettings(prev => ({
        ...prev,
        ...updates
      }));
      
      toast.success("Project updated", {
        description: "Project settings have been updated successfully.",
      });
      
      return true;
    } catch (error) {
      console.error("Error in updateProjectSettings:", error);
      toast.error("Error updating project", {
        description: "An unexpected error occurred while updating project settings.",
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeleteProject = () => {
    if (props?.project?.id) {
      deleteProject(props.project.id);
    }
    
    return true;
  };

  return {
    settings,
    setSettings,
    handleSettingChange,
    handleDeleteProject,
    updateProjectSettings,
    isUpdating
  };
};
