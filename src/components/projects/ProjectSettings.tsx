
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import ProjectInformationSection from './settings/ProjectInformationSection';
import ProjectVisibilitySection from './settings/ProjectVisibilitySection';
import NotificationSettingsSection from './settings/NotificationSettingsSection';
import DangerZoneSection from './settings/DangerZoneSection';

const ProjectSettings: React.FC = () => {
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
  
  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Project Settings</h2>
      <p className="text-muted-foreground mb-6">
        Manage project configuration, permissions, and other settings.
      </p>
      
      <div className="space-y-6">
        <ProjectInformationSection 
          projectName={settings.projectName}
          projectSlug={settings.projectSlug}
          category={settings.category}
          onProjectNameChange={(value) => 
            setSettings({...settings, projectName: value})
          }
          onProjectSlugChange={(value) => 
            setSettings({...settings, projectSlug: value})
          }
          onCategoryChange={(value) => 
            handleSettingChange("category", value)
          }
        />
        
        <ProjectVisibilitySection 
          visibility={settings.visibility}
          onVisibilityChange={(value) => 
            handleSettingChange("visibility", value)
          }
        />
        
        <NotificationSettingsSection 
          emailNotifications={settings.emailNotifications}
          taskReminders={settings.taskReminders}
          onEmailNotificationsChange={(checked) => 
            handleSettingChange("emailNotifications", checked)
          }
          onTaskRemindersChange={(checked) => 
            handleSettingChange("taskReminders", checked)
          }
        />
        
        <DangerZoneSection 
          onDeleteProject={handleDeleteProject}
        />
      </div>
    </div>
  );
};

export default ProjectSettings;
