
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SettingsCard from './components/SettingsCard';

interface GeneralSettingsProps {
  settings: {
    systemName: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  setSettings: (settings: any) => void;
  handleSaveSettings: (section: string) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ 
  settings, 
  setSettings, 
  handleSaveSettings 
}) => {
  return (
    <SettingsCard
      title="General Settings"
      description="Configure basic system settings"
      onSave={() => handleSaveSettings('general')}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="systemName">System Name</Label>
            <Input 
              id="systemName" 
              value={settings.systemName} 
              onChange={(e) => setSettings({...settings, systemName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Default Timezone</Label>
            <Select 
              value={settings.timezone}
              onValueChange={(value) => setSettings({...settings, timezone: value})}
            >
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="EST">Eastern Standard Time (EST)</SelectItem>
                <SelectItem value="CST">Central Standard Time (CST)</SelectItem>
                <SelectItem value="PST">Pacific Standard Time (PST)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Select 
              value={settings.dateFormat}
              onValueChange={(value) => setSettings({...settings, dateFormat: value})}
            >
              <SelectTrigger id="dateFormat">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Select 
              value={settings.currency}
              onValueChange={(value) => setSettings({...settings, currency: value})}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
};

export default GeneralSettings;
