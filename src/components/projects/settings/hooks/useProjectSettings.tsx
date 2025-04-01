
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types/project';

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
          throw error;
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
  
  const handleDeleteProject = () => {
    // This is just for UI toast feedback
    // The actual deletion is now handled in the DangerZoneSection component
    toast.error("Project deleted", {
      description: "The project has been successfully deleted.",
    });
    
    return true;
  };

  return {
    settings,
    setSettings,
    handleSettingChange,
    handleDeleteProject
  };
};
