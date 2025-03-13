
import { SettingsState } from '../types/settings-types';

// Default settings data
export const defaultSettings: SettingsState = {
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
