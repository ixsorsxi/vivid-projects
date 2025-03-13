
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface SecuritySettingsProps {
  settings: {
    passwordPolicy: string;
    mfaEnabled: boolean;
    sessionTimeout: string;
    loginAttempts: string;
    dataEncryption: boolean;
  };
  setSettings: (settings: any) => void;
  handleSaveSettings: (section: string) => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ 
  settings, 
  setSettings, 
  handleSaveSettings 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Configure security policies and options</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="passwordPolicy">Password Policy</Label>
            <Select 
              value={settings.passwordPolicy}
              onValueChange={(value) => setSettings({...settings, passwordPolicy: value})}
            >
              <SelectTrigger id="passwordPolicy">
                <SelectValue placeholder="Select policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic (min 8 characters)</SelectItem>
                <SelectItem value="medium">Medium (min 10 characters, 1 special character)</SelectItem>
                <SelectItem value="strong">Strong (min 12 characters, mixed case, numbers, symbols)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Input 
              id="sessionTimeout" 
              value={settings.sessionTimeout} 
              onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loginAttempts">Max Failed Login Attempts</Label>
            <Input 
              id="loginAttempts" 
              value={settings.loginAttempts} 
              onChange={(e) => setSettings({...settings, loginAttempts: e.target.value})}
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label htmlFor="mfa">Multi-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Require MFA for all users</p>
            </div>
            <Switch 
              id="mfa"
              checked={settings.mfaEnabled}
              onCheckedChange={(checked) => setSettings({...settings, mfaEnabled: checked})}
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label htmlFor="encryption">Data Encryption</Label>
              <p className="text-sm text-muted-foreground">Enable data encryption at rest</p>
            </div>
            <Switch 
              id="encryption"
              checked={settings.dataEncryption}
              onCheckedChange={(checked) => setSettings({...settings, dataEncryption: checked})}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSaveSettings('security')}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};

export default SecuritySettings;
