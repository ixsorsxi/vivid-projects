
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import SettingsCard from './components/SettingsCard';

interface BackupSettingsProps {
  settings: {
    autoBackup: boolean;
    backupFrequency: string;
    backupTime: string;
    retentionPeriod: string;
  };
  setSettings: (settings: any) => void;
  handleSaveSettings: (section: string) => void;
}

const BackupSettings: React.FC<BackupSettingsProps> = ({ 
  settings, 
  setSettings, 
  handleSaveSettings 
}) => {
  return (
    <SettingsCard
      title="Backup & Recovery"
      description="Configure system backup settings"
      onSave={() => handleSaveSettings('backup')}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="autoBackup">Automatic Backups</Label>
            <p className="text-sm text-muted-foreground">Enable scheduled backups</p>
          </div>
          <Switch 
            id="autoBackup"
            checked={settings.autoBackup}
            onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="backupFrequency">Backup Frequency</Label>
            <Select 
              value={settings.backupFrequency}
              onValueChange={(value) => setSettings({...settings, backupFrequency: value})}
            >
              <SelectTrigger id="backupFrequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="backupTime">Backup Time</Label>
            <Input 
              id="backupTime" 
              type="time"
              value={settings.backupTime} 
              onChange={(e) => setSettings({...settings, backupTime: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
            <Input 
              id="retentionPeriod" 
              value={settings.retentionPeriod} 
              onChange={(e) => setSettings({...settings, retentionPeriod: e.target.value})}
            />
          </div>
        </div>
        <div className="mt-6">
          <Button variant="outline" className="mr-2">Backup Now</Button>
          <Button variant="outline">Restore from Backup</Button>
        </div>
      </div>
    </SettingsCard>
  );
};

export default BackupSettings;
