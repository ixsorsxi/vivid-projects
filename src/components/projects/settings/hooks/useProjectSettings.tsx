
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useProjectSettings = () => {
  const { toast } = useToast();
  
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
      
      toast({
        title: "Setting updated",
        description: `The ${settingKey} setting has been updated successfully.`,
      });
    } catch (error) {
      console.error(`Error updating ${settingKey}:`, error);
      toast({
        title: "Error updating setting",
        description: `There was a problem updating the ${settingKey} setting.`,
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteProject = () => {
    toast({
      title: "Project deleted",
      description: "The project has been successfully deleted.",
      variant: "destructive"
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
