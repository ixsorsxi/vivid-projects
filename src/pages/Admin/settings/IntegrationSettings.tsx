
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface IntegrationSettingsProps {
  settings: {
    googleDriveEnabled: boolean;
    dropboxEnabled: boolean;
    slackEnabled: boolean;
    apiKey: string;
  };
  setSettings: (settings: any) => void;
  handleSaveSettings: (section: string) => void;
}

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({ 
  settings, 
  setSettings, 
  handleSaveSettings 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Settings</CardTitle>
        <CardDescription>Configure third-party service integrations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="googleDrive">Google Drive</Label>
              <p className="text-sm text-muted-foreground">Enable Google Drive integration</p>
            </div>
            <Switch 
              id="googleDrive"
              checked={settings.googleDriveEnabled}
              onCheckedChange={(checked) => setSettings({...settings, googleDriveEnabled: checked})}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="dropbox">Dropbox</Label>
              <p className="text-sm text-muted-foreground">Enable Dropbox integration</p>
            </div>
            <Switch 
              id="dropbox"
              checked={settings.dropboxEnabled}
              onCheckedChange={(checked) => setSettings({...settings, dropboxEnabled: checked})}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="slack">Slack</Label>
              <p className="text-sm text-muted-foreground">Enable Slack integration</p>
            </div>
            <Switch 
              id="slack"
              checked={settings.slackEnabled}
              onCheckedChange={(checked) => setSettings({...settings, slackEnabled: checked})}
            />
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="apiKey">API Key</Label>
            <Input 
              id="apiKey" 
              value={settings.apiKey} 
              onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
            />
            <p className="text-xs text-muted-foreground">Used for external API integrations</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSaveSettings('integration')}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};

export default IntegrationSettings;
