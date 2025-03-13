
import React, { useEffect } from 'react';
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
    originalThemeSettings,
    updateSettings, 
    handleSaveSettings, 
    handleImageUpload 
  } = useSettings();

  // Handle tab changes to restore original theme settings if moving away from theme tab
  useEffect(() => {
    if (activeTab !== 'theme' && originalThemeSettings) {
      // Reset theme to original if navigating away from theme tab
      const styleElement = document.getElementById('custom-theme-styles');
      if (styleElement) {
        styleElement.textContent = '';
      }
      
      // Reset all CSS variables to their original values
      document.documentElement.style.setProperty('--primary-color', originalThemeSettings.primaryColor);
      document.documentElement.style.setProperty('--background-color', originalThemeSettings.backgroundColor);
      document.documentElement.style.setProperty('--sidebar-color', originalThemeSettings.sidebarColor);
      document.documentElement.style.setProperty('--card-color', originalThemeSettings.cardColor);
      document.documentElement.style.setProperty('--font-family', originalThemeSettings.fontFamily || '');
      
      // Reset border radius
      let radiusValue = '0.5rem'; // default
      switch (originalThemeSettings.borderRadius) {
        case 'none': radiusValue = '0'; break;
        case 'small': radiusValue = '0.25rem'; break;
        case 'medium': radiusValue = '0.5rem'; break;
        case 'large': radiusValue = '0.75rem'; break;
        case 'full': radiusValue = '9999px'; break;
      }
      document.documentElement.style.setProperty('--border-radius', radiusValue);
      
      // Reset dark mode
      document.documentElement.classList.toggle('dark', originalThemeSettings.darkMode);
    }
  }, [activeTab, originalThemeSettings]);

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
