
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';

export const useProjectSettings = () => {
  const [settings, setSettings] = useState({
    visibility: "private",
    emailNotifications: true,
    taskReminders: true,
    projectName: "Current Project",
    projectSlug: "current-project",
    category: "Development"
  });
  
  const handleSettingChange = (
    settingKey: keyof typeof settings,
    value: string | boolean
  ) => {
    try {
      setSettings({
        ...settings,
        [settingKey]: value
      });
      
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
    toast.error("Project deleted", {
      description: "The project has been successfully deleted.",
    });
    
    // Navigation is now handled in the component
    return true;
  };

  return {
    settings,
    setSettings,
    handleSettingChange,
    handleDeleteProject
  };
};
