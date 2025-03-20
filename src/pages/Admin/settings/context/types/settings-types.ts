
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
    logoUrl?: string;
    faviconUrl?: string;
  };
}

export interface SettingsContextProps {
  settings: SettingsState;
  updateSettings: <K extends keyof SettingsState>(
    section: K, 
    newSettings: SettingsState[K]
  ) => void;
  handleSaveSettings: (section: string) => void;
  handleImageUpload: (type: string) => void;
}
