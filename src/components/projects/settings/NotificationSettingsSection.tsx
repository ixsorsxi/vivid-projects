
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SettingsCard } from "@/pages/Admin/settings/components/SettingsCard";

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
  return (
    <SettingsCard 
      title="Notification Settings"
      description="Control how you receive updates about this project"
      onSave={() => {}}
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
            onCheckedChange={onEmailNotificationsChange}
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
            onCheckedChange={onTaskRemindersChange}
          />
        </div>
      </div>
    </SettingsCard>
  );
};

export default NotificationSettingsSection;
