
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/components/ui/use-toast';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();
  
  // Mock system settings
  const [settings, setSettings] = useState({
    general: {
      systemName: 'Projectify',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
    },
    email: {
      smtpServer: 'smtp.example.com',
      smtpPort: '587',
      smtpUsername: 'notifications@example.com',
      smtpPassword: '********',
      senderEmail: 'no-reply@example.com',
      senderName: 'Projectify Team',
    },
    security: {
      passwordPolicy: 'strong',
      mfaEnabled: true,
      sessionTimeout: '30',
      loginAttempts: '5',
      dataEncryption: true,
    },
    notifications: {
      taskAssignment: true,
      projectAssignment: true,
      taskDueDate: true,
      milestoneCompletion: true,
      systemAlerts: true,
    },
    integration: {
      googleDriveEnabled: false,
      dropboxEnabled: false,
      slackEnabled: true,
      apiKey: 'sk-*******************',
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupTime: '02:00',
      retentionPeriod: '30',
    }
  });

  const handleSaveSettings = (section: keyof typeof settings) => {
    toast({
      title: "Settings saved",
      description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated successfully.`,
    });
  };

  return (
    <AdminLayout title="System Settings" currentTab="settings">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email Server</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integration">Integrations</TabsTrigger>
          <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input 
                    id="systemName" 
                    value={settings.general.systemName} 
                    onChange={(e) => setSettings({...settings, general: {...settings.general, systemName: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select 
                    value={settings.general.timezone}
                    onValueChange={(value) => setSettings({...settings, general: {...settings.general, timezone: value}})}
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
                    value={settings.general.dateFormat}
                    onValueChange={(value) => setSettings({...settings, general: {...settings.general, dateFormat: value}})}
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
                    value={settings.general.currency}
                    onValueChange={(value) => setSettings({...settings, general: {...settings.general, currency: value}})}
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
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('general')}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Email Server Settings */}
        <TabsContent value="email">
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
                    value={settings.email.smtpServer} 
                    onChange={(e) => setSettings({...settings, email: {...settings.email, smtpServer: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input 
                    id="smtpPort" 
                    value={settings.email.smtpPort} 
                    onChange={(e) => setSettings({...settings, email: {...settings.email, smtpPort: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input 
                    id="smtpUsername" 
                    value={settings.email.smtpUsername} 
                    onChange={(e) => setSettings({...settings, email: {...settings.email, smtpUsername: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input 
                    id="smtpPassword" 
                    type="password"
                    value={settings.email.smtpPassword} 
                    onChange={(e) => setSettings({...settings, email: {...settings.email, smtpPassword: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Default Sender Email</Label>
                  <Input 
                    id="senderEmail" 
                    value={settings.email.senderEmail} 
                    onChange={(e) => setSettings({...settings, email: {...settings.email, senderEmail: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderName">Default Sender Name</Label>
                  <Input 
                    id="senderName" 
                    value={settings.email.senderName} 
                    onChange={(e) => setSettings({...settings, email: {...settings.email, senderName: e.target.value}})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('email')}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
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
                    value={settings.security.passwordPolicy}
                    onValueChange={(value) => setSettings({...settings, security: {...settings.security, passwordPolicy: value}})}
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
                    value={settings.security.sessionTimeout} 
                    onChange={(e) => setSettings({...settings, security: {...settings.security, sessionTimeout: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Max Failed Login Attempts</Label>
                  <Input 
                    id="loginAttempts" 
                    value={settings.security.loginAttempts} 
                    onChange={(e) => setSettings({...settings, security: {...settings.security, loginAttempts: e.target.value}})}
                  />
                </div>
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="mfa">Multi-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require MFA for all users</p>
                  </div>
                  <Switch 
                    id="mfa"
                    checked={settings.security.mfaEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, security: {...settings.security, mfaEnabled: checked}})}
                  />
                </div>
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="encryption">Data Encryption</Label>
                    <p className="text-sm text-muted-foreground">Enable data encryption at rest</p>
                  </div>
                  <Switch 
                    id="encryption"
                    checked={settings.security.dataEncryption}
                    onCheckedChange={(checked) => setSettings({...settings, security: {...settings.security, dataEncryption: checked}})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('security')}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="taskAssignment">Task Assignment</Label>
                    <p className="text-sm text-muted-foreground">Notify users when assigned to a task</p>
                  </div>
                  <Switch 
                    id="taskAssignment"
                    checked={settings.notifications.taskAssignment}
                    onCheckedChange={(checked) => setSettings({...settings, notifications: {...settings.notifications, taskAssignment: checked}})}
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="projectAssignment">Project Assignment</Label>
                    <p className="text-sm text-muted-foreground">Notify users when added to a project</p>
                  </div>
                  <Switch 
                    id="projectAssignment"
                    checked={settings.notifications.projectAssignment}
                    onCheckedChange={(checked) => setSettings({...settings, notifications: {...settings.notifications, projectAssignment: checked}})}
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="taskDueDate">Task Due Date</Label>
                    <p className="text-sm text-muted-foreground">Send reminders for upcoming task deadlines</p>
                  </div>
                  <Switch 
                    id="taskDueDate"
                    checked={settings.notifications.taskDueDate}
                    onCheckedChange={(checked) => setSettings({...settings, notifications: {...settings.notifications, taskDueDate: checked}})}
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="milestoneCompletion">Milestone Completion</Label>
                    <p className="text-sm text-muted-foreground">Notify project members when milestones are completed</p>
                  </div>
                  <Switch 
                    id="milestoneCompletion"
                    checked={settings.notifications.milestoneCompletion}
                    onCheckedChange={(checked) => setSettings({...settings, notifications: {...settings.notifications, milestoneCompletion: checked}})}
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="systemAlerts">System Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify administrators about system issues and updates</p>
                  </div>
                  <Switch 
                    id="systemAlerts"
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) => setSettings({...settings, notifications: {...settings.notifications, systemAlerts: checked}})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('notifications')}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integration">
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
                    checked={settings.integration.googleDriveEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, integration: {...settings.integration, googleDriveEnabled: checked}})}
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="dropbox">Dropbox</Label>
                    <p className="text-sm text-muted-foreground">Enable Dropbox integration</p>
                  </div>
                  <Switch 
                    id="dropbox"
                    checked={settings.integration.dropboxEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, integration: {...settings.integration, dropboxEnabled: checked}})}
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="slack">Slack</Label>
                    <p className="text-sm text-muted-foreground">Enable Slack integration</p>
                  </div>
                  <Switch 
                    id="slack"
                    checked={settings.integration.slackEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, integration: {...settings.integration, slackEnabled: checked}})}
                  />
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input 
                    id="apiKey" 
                    value={settings.integration.apiKey} 
                    onChange={(e) => setSettings({...settings, integration: {...settings.integration, apiKey: e.target.value}})}
                  />
                  <p className="text-xs text-muted-foreground">Used for external API integrations</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('integration')}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Backup & Recovery Settings */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Recovery</CardTitle>
              <CardDescription>Configure system backup settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoBackup">Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">Enable scheduled backups</p>
                  </div>
                  <Switch 
                    id="autoBackup"
                    checked={settings.backup.autoBackup}
                    onCheckedChange={(checked) => setSettings({...settings, backup: {...settings.backup, autoBackup: checked}})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select 
                      value={settings.backup.backupFrequency}
                      onValueChange={(value) => setSettings({...settings, backup: {...settings.backup, backupFrequency: value}})}
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
                      value={settings.backup.backupTime} 
                      onChange={(e) => setSettings({...settings, backup: {...settings.backup, backupTime: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                    <Input 
                      id="retentionPeriod" 
                      value={settings.backup.retentionPeriod} 
                      onChange={(e) => setSettings({...settings, backup: {...settings.backup, retentionPeriod: e.target.value}})}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="mr-2">Backup Now</Button>
                  <Button variant="outline">Restore from Backup</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings('backup')}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default SystemSettings;
