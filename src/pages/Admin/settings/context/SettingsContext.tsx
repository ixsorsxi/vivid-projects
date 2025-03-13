
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Define the shape of our settings
export interface SettingsState {
  general: {
    systemName: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  email: {
    smtpServer: string;
    smtpPort: string;
    smtpUsername: string;
    smtpPassword: string;
    senderEmail: string;
    senderName: string;
  };
  security: {
    passwordPolicy: string;
    mfaEnabled: boolean;
    sessionTimeout: string;
    loginAttempts: string;
    dataEncryption: boolean;
  };
  notifications: {
    taskAssignment: boolean;
    projectAssignment: boolean;
    taskDueDate: boolean;
    milestoneCompletion: boolean;
    systemAlerts: boolean;
  };
  integration: {
    googleDriveEnabled: boolean;
    dropboxEnabled: boolean;
    slackEnabled: boolean;
    apiKey: string;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: string;
    backupTime: string;
    retentionPeriod: string;
  };
  theme: {
    platformTitle: string;
    webLink: string;
    slogan: string;
    primaryColor: string;
    backgroundColor: string;
    sidebarColor: string;
    cardColor: string;
    fontFamily: string;
    borderRadius: string;
    customCSS: string;
    darkMode: boolean;
  };
}

// Default settings data
const defaultSettings: SettingsState = {
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
};

interface SettingsContextProps {
  settings: SettingsState;
  originalThemeSettings: any;
  updateSettings: <K extends keyof SettingsState>(
    section: K, 
    newSettings: SettingsState[K]
  ) => void;
  handleSaveSettings: (section: string) => void;
  handleImageUpload: (type: string) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [originalThemeSettings, setOriginalThemeSettings] = useState<any>(null);
  const { toast } = useToast();

  // Store original theme settings when component mounts
  useEffect(() => {
    setOriginalThemeSettings({...settings.theme});
  }, []);

  // Helper function to update settings for a specific section
  const updateSettings = <K extends keyof SettingsState>(
    section: K, 
    newSettings: SettingsState[K]
  ) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: newSettings
    }));
  };

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

  return (
    <SettingsContext.Provider value={{
      settings,
      originalThemeSettings,
      updateSettings,
      handleSaveSettings,
      handleImageUpload
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
