
import React, { createContext, useState, useContext } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { SettingsState, SettingsContextProps } from './types/settings-types';
import { defaultSettings } from './defaults/defaultSettings';
import { applyThemeSettings } from './utils/themeUtils';

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const { toast } = useToast();

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
    
    // If we're saving theme settings, apply them immediately
    if (section === 'theme') {
      applyThemeSettings(settings.theme);
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
