
import React from 'react';
import ProjectInformationSection from './settings/ProjectInformationSection';
import ProjectVisibilitySection from './settings/ProjectVisibilitySection';
import NotificationSettingsSection from './settings/NotificationSettingsSection';
import DangerZoneSection from './settings/DangerZoneSection';
import { useProjectSettings } from './settings/hooks/useProjectSettings';

const ProjectSettings: React.FC = () => {
  const { 
    settings, 
    setSettings, 
    handleSettingChange, 
    handleDeleteProject 
  } = useProjectSettings();
  
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
