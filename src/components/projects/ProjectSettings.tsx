
import React from 'react';
import ProjectInformationSection from './settings/ProjectInformationSection';
import ProjectVisibilitySection from './settings/ProjectVisibilitySection';
import NotificationSettingsSection from './settings/NotificationSettingsSection';
import DangerZoneSection from './settings/DangerZoneSection';
import { useProjectSettings } from './settings/hooks/useProjectSettings';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/lib/types/project';

interface ProjectSettingsProps {
  project: Project;
  projectId: string;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ project, projectId }) => {
  const { 
    settings, 
    setSettings, 
    handleSettingChange, 
    handleDeleteProject 
  } = useProjectSettings();
  
  const navigate = useNavigate();
  
  // Enhanced delete project handler with error handling
  const handleProjectDelete = () => {
    try {
      handleDeleteProject();
      // Navigate in the component rather than relying on setTimeout in the hook
      setTimeout(() => {
        navigate('/projects');
      }, 1500);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
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
          onDeleteProject={handleProjectDelete}
        />
      </div>
    </div>
  );
};

export default ProjectSettings;
