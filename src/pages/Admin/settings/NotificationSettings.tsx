
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import SettingsCard from './components/SettingsCard';

interface NotificationSettingsProps {
  settings: {
    taskAssignment: boolean;
    projectAssignment: boolean;
    taskDueDate: boolean;
    milestoneCompletion: boolean;
    systemAlerts: boolean;
  };
  setSettings: (settings: any) => void;
  handleSaveSettings: (section: string) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  settings, 
  setSettings, 
  handleSaveSettings 
}) => {
  return (
    <SettingsCard
      title="Notification Settings"
      description="Configure system notification preferences"
      onSave={() => handleSaveSettings('notifications')}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="taskAssignment">Task Assignment</Label>
            <p className="text-sm text-muted-foreground">Notify users when assigned to a task</p>
          </div>
          <Switch 
            id="taskAssignment"
            checked={settings.taskAssignment}
            onCheckedChange={(checked) => setSettings({...settings, taskAssignment: checked})}
          />
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="projectAssignment">Project Assignment</Label>
            <p className="text-sm text-muted-foreground">Notify users when added to a project</p>
          </div>
          <Switch 
            id="projectAssignment"
            checked={settings.projectAssignment}
            onCheckedChange={(checked) => setSettings({...settings, projectAssignment: checked})}
          />
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="taskDueDate">Task Due Date</Label>
            <p className="text-sm text-muted-foreground">Send reminders for upcoming task deadlines</p>
          </div>
          <Switch 
            id="taskDueDate"
            checked={settings.taskDueDate}
            onCheckedChange={(checked) => setSettings({...settings, taskDueDate: checked})}
          />
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="milestoneCompletion">Milestone Completion</Label>
            <p className="text-sm text-muted-foreground">Notify project members when milestones are completed</p>
          </div>
          <Switch 
            id="milestoneCompletion"
            checked={settings.milestoneCompletion}
            onCheckedChange={(checked) => setSettings({...settings, milestoneCompletion: checked})}
          />
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="systemAlerts">System Alerts</Label>
            <p className="text-sm text-muted-foreground">Notify administrators about system issues and updates</p>
          </div>
          <Switch 
            id="systemAlerts"
            checked={settings.systemAlerts}
            onCheckedChange={(checked) => setSettings({...settings, systemAlerts: checked})}
          />
        </div>
      </div>
    </SettingsCard>
  );
};

export default NotificationSettings;
