
import React from 'react';
import ProjectInformationSection from './settings/ProjectInformationSection';
import ProjectVisibilitySection from './settings/ProjectVisibilitySection';
import NotificationSettingsSection from './settings/NotificationSettingsSection';
import DangerZoneSection from './settings/DangerZoneSection';
import { useProjectSettings } from './settings/hooks/useProjectSettings';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/lib/types/project';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useQueryClient } from '@tanstack/react-query';

interface ProjectSettingsProps {
  project: Project;
  projectId: string;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ project, projectId }) => {
  const queryClient = useQueryClient();
  
  const { 
    settings, 
    handleSettingChange,
    updateProjectSettings,
    isUpdating,
    handleDeleteProject 
  } = useProjectSettings({ project });
  
  const navigate = useNavigate();
  
  // Handler for project information updates
  const handleProjectInfoSave = async () => {
    try {
      // Use the batch update method for project information
      const success = await updateProjectSettings({
        projectName: settings.projectName,
        category: settings.category
      });
      
      // If update was successful, invalidate and refetch project data
      if (success) {
        await queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };
  
  // Enhanced delete project handler with navigation
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
            handleSettingChange("projectName", value)
          }
          onCategoryChange={(value) => 
            handleSettingChange("category", value)
          }
          onSave={handleProjectInfoSave}
          isSaving={isUpdating}
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
          projectId={projectId}
          onDeleteProject={handleProjectDelete}
        />
      </div>
    </div>
  );
};

export default ProjectSettings;
