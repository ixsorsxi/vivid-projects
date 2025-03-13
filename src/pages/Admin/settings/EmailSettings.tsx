
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailSettingsProps {
  settings: {
    smtpServer: string;
    smtpPort: string;
    smtpUsername: string;
    smtpPassword: string;
    senderEmail: string;
    senderName: string;
  };
  setSettings: (settings: any) => void;
  handleSaveSettings: (section: string) => void;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({ 
  settings, 
  setSettings, 
  handleSaveSettings 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Server Configuration</CardTitle>
        <CardDescription>Configure the SMTP server for sending emails</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtpServer">SMTP Server</Label>
            <Input 
              id="smtpServer" 
              value={settings.smtpServer} 
              onChange={(e) => setSettings({...settings, smtpServer: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input 
              id="smtpPort" 
              value={settings.smtpPort} 
              onChange={(e) => setSettings({...settings, smtpPort: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpUsername">SMTP Username</Label>
            <Input 
              id="smtpUsername" 
              value={settings.smtpUsername} 
              onChange={(e) => setSettings({...settings, smtpUsername: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPassword">SMTP Password</Label>
            <Input 
              id="smtpPassword" 
              type="password"
              value={settings.smtpPassword} 
              onChange={(e) => setSettings({...settings, smtpPassword: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderEmail">Default Sender Email</Label>
            <Input 
              id="senderEmail" 
              value={settings.senderEmail} 
              onChange={(e) => setSettings({...settings, senderEmail: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderName">Default Sender Name</Label>
            <Input 
              id="senderName" 
              value={settings.senderName} 
              onChange={(e) => setSettings({...settings, senderName: e.target.value})}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSaveSettings('email')}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};

export default EmailSettings;
