
import React, { useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SettingsCard from "@/pages/Admin/settings/components/SettingsCard";
import { useNotifications } from '@/context/notifications/NotificationsContext';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/auth';

interface NotificationSettingsProps {
  emailNotifications: boolean;
  taskReminders: boolean;
  onEmailNotificationsChange: (checked: boolean) => void;
  onTaskRemindersChange: (checked: boolean) => void;
}

const NotificationSettingsSection: React.FC<NotificationSettingsProps> = ({
  emailNotifications,
  taskReminders,
  onEmailNotificationsChange,
  onTaskRemindersChange
}) => {
  const { sendNotification } = useNotifications();
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();

  // Handle saving notification settings
  const handleSave = () => {
    sendNotification(
      "Settings Saved",
      "Your notification preferences have been updated.",
      "success",
      {
        persist: true,
        relatedToId: projectId,
        relatedToType: "project"
      }
    );
  };

  // Example: when component mounts, send a notification about viewing settings
  useEffect(() => {
    if (user && projectId) {
      // Silent notification only for first render
      const timer = setTimeout(() => {
        sendNotification(
          "Notification Settings",
          "You can customize how you receive updates about this project.",
          "info",
          {
            persist: false,
          }
        );
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <SettingsCard 
      title="Notification Settings"
      description="Control how you receive updates about this project"
      onSave={handleSave}
      footer={null}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailNotifications">Email notifications</Label>
            <p className="text-sm text-muted-foreground">Receive email updates about this project</p>
          </div>
          <Switch 
            id="emailNotifications"
            checked={emailNotifications}
            onCheckedChange={(checked) => {
              onEmailNotificationsChange(checked);
              sendNotification(
                checked ? "Email Notifications Enabled" : "Email Notifications Disabled",
                checked 
                  ? "You will now receive email updates about this project." 
                  : "You will no longer receive email updates about this project.",
                checked ? "success" : "info"
              );
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="taskReminders">Task reminders</Label>
            <p className="text-sm text-muted-foreground">Get notified about upcoming deadlines</p>
          </div>
          <Switch 
            id="taskReminders"
            checked={taskReminders}
            onCheckedChange={(checked) => {
              onTaskRemindersChange(checked);
              sendNotification(
                checked ? "Task Reminders Enabled" : "Task Reminders Disabled",
                checked 
                  ? "You will now receive reminders about upcoming deadlines." 
                  : "You will no longer receive reminders about upcoming deadlines.",
                checked ? "success" : "info"
              );
            }}
          />
        </div>
      </div>
    </SettingsCard>
  );
};

export default NotificationSettingsSection;
