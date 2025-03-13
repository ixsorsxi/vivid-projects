
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
    setSettings({
      ...settings,
      [settingKey]: value
    });
    
    toast({
      title: "Setting updated",
      description: `The ${settingKey} setting has been updated successfully.`,
    });
  };
  
  const handleDeleteProject = () => {
    toast({
      title: "Project deleted",
      description: "The project has been successfully deleted.",
      variant: "destructive"
    });
    
    // In a real app, we would navigate away or refresh
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  return {
    settings,
    setSettings,
    handleSettingChange,
    handleDeleteProject
  };
};
