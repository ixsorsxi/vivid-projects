
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
  
  const handleSettingChange = async (
    settingKey: keyof typeof settings,
    value: string | boolean
  ) => {
    try {
      setSettings({
        ...settings,
        [settingKey]: value
      });
      
      // If this is a project property, update it in the database
      if (props?.project?.id && ['projectName', 'projectSlug', 'category'].includes(settingKey)) {
        const fieldName = settingKey === 'projectName' ? 'name' : 
                         settingKey === 'projectSlug' ? 'id' : settingKey;
        
        const { error } = await supabase
          .from('projects')
          .update({ [fieldName]: value })
          .eq('id', props.project.id);
          
        if (error) {
          console.error(`Error updating ${settingKey}:`, error);
          const apiError = handleDatabaseError(error);
          toast.error("Error updating setting", {
            description: apiError.message || `There was a problem updating the ${settingKey} setting.`,
          });
          return;
        }
      }
      
      toast("Setting updated", {
        description: `The ${settingKey} setting has been updated successfully.`,
      });
    } catch (error) {
      console.error(`Error updating ${settingKey}:`, error);
      toast.error("Error updating setting", {
        description: `There was a problem updating the ${settingKey} setting.`,
      });
    }
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
      
      const { error } = await supabase
        .from('projects')
        .update(dbUpdates)
        .eq('id', props.project.id);
        
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
