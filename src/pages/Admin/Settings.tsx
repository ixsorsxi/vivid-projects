
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/components/ui/use-toast';

// Import our refactored components
import GeneralSettings from './settings/GeneralSettings';
import EmailSettings from './settings/EmailSettings';
import SecuritySettings from './settings/SecuritySettings';
import NotificationSettings from './settings/NotificationSettings';
import IntegrationSettings from './settings/IntegrationSettings';
import BackupSettings from './settings/BackupSettings';
import ThemeSettings from './settings/ThemeSettings';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();
  
  // Store the original theme settings to restore if navigating away without saving
  const [originalThemeSettings, setOriginalThemeSettings] = useState<any>(null);
  
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

  // Store original theme settings when component mounts
  useEffect(() => {
    setOriginalThemeSettings({...settings.theme});
  }, []);

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

  const handleSaveSettings = (section: keyof typeof settings) => {
    toast({
      title: "Settings saved",
      description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated successfully.`,
    });
    
    // If we're saving theme settings, update the original theme settings
    if (section === 'theme') {
      setOriginalThemeSettings({...settings.theme});
    }
  };

  const handleImageUpload = (type: string) => {
    toast({
      title: "Upload initiated",
      description: `${type} upload functionality would connect to storage here.`,
    });
  };

  // Helper functions to update nested settings
  const updateGeneralSettings = (newSettings: any) => {
    setSettings({...settings, general: newSettings});
  };

  const updateEmailSettings = (newSettings: any) => {
    setSettings({...settings, email: newSettings});
  };

  const updateSecuritySettings = (newSettings: any) => {
    setSettings({...settings, security: newSettings});
  };

  const updateNotificationSettings = (newSettings: any) => {
    setSettings({...settings, notifications: newSettings});
  };

  const updateIntegrationSettings = (newSettings: any) => {
    setSettings({...settings, integration: newSettings});
  };

  const updateBackupSettings = (newSettings: any) => {
    setSettings({...settings, backup: newSettings});
  };

  const updateThemeSettings = (newSettings: any) => {
    setSettings({...settings, theme: newSettings});
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
          <GeneralSettings 
            settings={settings.general} 
            setSettings={updateGeneralSettings} 
            handleSaveSettings={handleSaveSettings} 
          />
        </TabsContent>

        {/* Email Server Settings */}
        <TabsContent value="email">
          <EmailSettings 
            settings={settings.email} 
            setSettings={updateEmailSettings} 
            handleSaveSettings={handleSaveSettings} 
          />
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <SecuritySettings 
            settings={settings.security} 
            setSettings={updateSecuritySettings} 
            handleSaveSettings={handleSaveSettings} 
          />
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <NotificationSettings 
            settings={settings.notifications} 
            setSettings={updateNotificationSettings} 
            handleSaveSettings={handleSaveSettings} 
          />
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integration">
          <IntegrationSettings 
            settings={settings.integration} 
            setSettings={updateIntegrationSettings} 
            handleSaveSettings={handleSaveSettings} 
          />
        </TabsContent>

        {/* Backup & Recovery Settings */}
        <TabsContent value="backup">
          <BackupSettings 
            settings={settings.backup} 
            setSettings={updateBackupSettings} 
            handleSaveSettings={handleSaveSettings} 
          />
        </TabsContent>

        {/* Theme & Branding Settings */}
        <TabsContent value="theme">
          <ThemeSettings 
            settings={settings.theme} 
            setSettings={updateThemeSettings} 
            handleSaveSettings={handleSaveSettings}
            handleImageUpload={handleImageUpload}
          />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default SystemSettings;
