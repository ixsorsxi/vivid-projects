
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettings } from '../context/SettingsContext';

// Import our settings components
import GeneralSettings from '../GeneralSettings';
import EmailSettings from '../EmailSettings';
import SecuritySettings from '../SecuritySettings';
import NotificationSettings from '../NotificationSettings';
import IntegrationSettings from '../IntegrationSettings';
import BackupSettings from '../BackupSettings';
import ThemeSettingsComponent from '../ThemeSettings';

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, setActiveTab }) => {
  const { 
    settings, 
    updateSettings, 
    handleSaveSettings, 
    handleImageUpload 
  } = useSettings();

  return (
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
        <GeneralSettings 
          settings={settings.general} 
          setSettings={(newSettings) => updateSettings('general', newSettings)} 
          handleSaveSettings={handleSaveSettings} 
        />
      </TabsContent>

      {/* Email Server Settings */}
      <TabsContent value="email">
        <EmailSettings 
          settings={settings.email} 
          setSettings={(newSettings) => updateSettings('email', newSettings)} 
          handleSaveSettings={handleSaveSettings} 
        />
      </TabsContent>

      {/* Security Settings */}
      <TabsContent value="security">
        <SecuritySettings 
          settings={settings.security} 
          setSettings={(newSettings) => updateSettings('security', newSettings)} 
          handleSaveSettings={handleSaveSettings} 
        />
      </TabsContent>

      {/* Notification Settings */}
      <TabsContent value="notifications">
        <NotificationSettings 
          settings={settings.notifications} 
          setSettings={(newSettings) => updateSettings('notifications', newSettings)} 
          handleSaveSettings={handleSaveSettings} 
        />
      </TabsContent>

      {/* Integration Settings */}
      <TabsContent value="integration">
        <IntegrationSettings 
          settings={settings.integration} 
          setSettings={(newSettings) => updateSettings('integration', newSettings)} 
          handleSaveSettings={handleSaveSettings} 
        />
      </TabsContent>

      {/* Backup & Recovery Settings */}
      <TabsContent value="backup">
        <BackupSettings 
          settings={settings.backup} 
          setSettings={(newSettings) => updateSettings('backup', newSettings)} 
          handleSaveSettings={handleSaveSettings} 
        />
      </TabsContent>

      {/* Theme & Branding Settings */}
      <TabsContent value="theme">
        <ThemeSettingsComponent 
          settings={settings.theme} 
          setSettings={(newSettings) => updateSettings('theme', newSettings)} 
          handleSaveSettings={handleSaveSettings}
          handleImageUpload={handleImageUpload}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
