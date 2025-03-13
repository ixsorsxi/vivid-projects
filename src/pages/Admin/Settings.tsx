
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
import { UploadCloud } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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
    },
    theme: {
      platformTitle: 'Projectify',
      webLink: 'https://projectify.app',
      slogan: 'Empower your team, elevate your projects',
      primaryColor: '#75A9F9',
      backgroundColor: '#F8FAFC',
      sidebarColor: '#27364B',
      cardColor: '#FFFFFF',
      fontFamily: 'Inter',
      borderRadius: 'medium',
      customCSS: '',
      darkMode: true,
    }
  });

  const handleSaveSettings = (section: keyof typeof settings) => {
    toast({
      title: "Settings saved",
      description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated successfully.`,
    });
  };

  const handleImageUpload = (type: string) => {
    toast({
      title: "Upload initiated",
      description: `${type} upload functionality would connect to storage here.`,
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
          <TabsTrigger value="theme">Theme & Branding</TabsTrigger>
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

        {/* Theme & Branding Settings */}
        <TabsContent value="theme">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Branding */}
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>Configure application branding elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platformTitle">Platform Title</Label>
                  <Input 
                    id="platformTitle" 
                    value={settings.theme.platformTitle} 
                    onChange={(e) => setSettings({...settings, theme: {...settings.theme, platformTitle: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webLink">Website URL</Label>
                  <Input 
                    id="webLink" 
                    value={settings.theme.webLink} 
                    onChange={(e) => setSettings({...settings, theme: {...settings.theme, webLink: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slogan">Slogan/Tagline</Label>
                  <Input 
                    id="slogan" 
                    value={settings.theme.slogan} 
                    onChange={(e) => setSettings({...settings, theme: {...settings.theme, slogan: e.target.value}})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 bg-muted/40">
                    <div className="w-20 h-20 rounded overflow-hidden bg-muted flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="text-sm text-muted-foreground text-center mt-2">
                      <p>Recommended size: 200x200px (SVG or PNG)</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-2" 
                      onClick={() => handleImageUpload('Logo')}
                    >
                      <UploadCloud className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 bg-muted/40">
                    <div className="w-12 h-12 rounded overflow-hidden bg-muted flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="text-sm text-muted-foreground text-center mt-2">
                      <p>Required size: 32x32px (ICO or PNG)</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-2" 
                      onClick={() => handleImageUpload('Favicon')}
                    >
                      <UploadCloud className="h-4 w-4 mr-2" />
                      Upload Favicon
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveSettings('theme')}>Save Branding</Button>
              </CardFooter>
            </Card>

            {/* UI Colors and Appearance */}
            <Card>
              <CardHeader>
                <CardTitle>Colors & Appearance</CardTitle>
                <CardDescription>Configure application colors and visual styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border" 
                      style={{ backgroundColor: settings.theme.primaryColor }}
                    />
                    <Input 
                      id="primaryColor" 
                      value={settings.theme.primaryColor} 
                      onChange={(e) => setSettings({...settings, theme: {...settings.theme, primaryColor: e.target.value}})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border" 
                      style={{ backgroundColor: settings.theme.backgroundColor }}
                    />
                    <Input 
                      id="backgroundColor" 
                      value={settings.theme.backgroundColor} 
                      onChange={(e) => setSettings({...settings, theme: {...settings.theme, backgroundColor: e.target.value}})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sidebarColor">Sidebar Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border" 
                      style={{ backgroundColor: settings.theme.sidebarColor }}
                    />
                    <Input 
                      id="sidebarColor" 
                      value={settings.theme.sidebarColor} 
                      onChange={(e) => setSettings({...settings, theme: {...settings.theme, sidebarColor: e.target.value}})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardColor">Card Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border" 
                      style={{ backgroundColor: settings.theme.cardColor }}
                    />
                    <Input 
                      id="cardColor" 
                      value={settings.theme.cardColor} 
                      onChange={(e) => setSettings({...settings, theme: {...settings.theme, cardColor: e.target.value}})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select 
                    value={settings.theme.fontFamily}
                    onValueChange={(value) => setSettings({...settings, theme: {...settings.theme, fontFamily: value}})}
                  >
                    <SelectTrigger id="fontFamily">
                      <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="borderRadius">Border Radius</Label>
                  <Select 
                    value={settings.theme.borderRadius}
                    onValueChange={(value) => setSettings({...settings, theme: {...settings.theme, borderRadius: value}})}
                  >
                    <SelectTrigger id="borderRadius">
                      <SelectValue placeholder="Select border radius" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (0px)</SelectItem>
                      <SelectItem value="small">Small (4px)</SelectItem>
                      <SelectItem value="medium">Medium (8px)</SelectItem>
                      <SelectItem value="large">Large (12px)</SelectItem>
                      <SelectItem value="full">Full (9999px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark mode by default</p>
                  </div>
                  <Switch 
                    id="darkMode"
                    checked={settings.theme.darkMode}
                    onCheckedChange={(checked) => setSettings({...settings, theme: {...settings.theme, darkMode: checked}})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveSettings('theme')}>Save Appearance</Button>
              </CardFooter>
            </Card>

            {/* Background Images */}
            <Card>
              <CardHeader>
                <CardTitle>Background Images</CardTitle>
                <CardDescription>Configure application background and login images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Login Page Background</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 bg-muted/40">
                    <div className="w-full h-32 rounded overflow-hidden bg-muted/60 flex items-center justify-center">
                      <p className="text-muted-foreground">Login background preview</p>
                    </div>
                    <div className="text-sm text-muted-foreground text-center mt-2">
                      <p>Recommended size: 1920x1080px</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-2" 
                      onClick={() => handleImageUpload('Login Background')}
                    >
                      <UploadCloud className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>App Background Image</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 bg-muted/40">
                    <div className="w-full h-32 rounded overflow-hidden bg-muted/60 flex items-center justify-center">
                      <p className="text-muted-foreground">App background preview</p>
                    </div>
                    <div className="text-sm text-muted-foreground text-center mt-2">
                      <p>Recommended size: 1920x1080px</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-2" 
                      onClick={() => handleImageUpload('App Background')}
                    >
                      <UploadCloud className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveSettings('theme')}>Save Background Images</Button>
              </CardFooter>
            </Card>

            {/* Advanced Customization */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Customization</CardTitle>
                <CardDescription>Custom CSS and advanced display settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customCSS">Custom CSS</Label>
                  <Textarea 
                    id="customCSS" 
                    className="font-mono text-sm h-52"
                    placeholder=":root { --custom-color: #ff0000; }"
                    value={settings.theme.customCSS} 
                    onChange={(e) => setSettings({...settings, theme: {...settings.theme, customCSS: e.target.value}})}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter custom CSS to further customize the application appearance. 
                    These styles will be applied globally.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200 rounded-md mt-4">
                  <p className="text-sm">
                    <strong>Note:</strong> Custom CSS changes may override system styles and 
                    should be used with caution. Incorrect CSS can break the application layout.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveSettings('theme')}>Save Advanced Settings</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default SystemSettings;
