
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SettingsState, SettingsContextProps } from './types/settings-types';
import { defaultSettings } from './defaults/defaultSettings';
import { applyThemeSettings } from './utils/themeUtils';
import { toast } from '@/components/ui/toast-wrapper';
import { fetchSettings, saveSetting } from './services/settingsService';

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsFromDB = await fetchSettings();
        
        if (Object.keys(settingsFromDB).length > 0) {
          const mergedSettings = {
            ...defaultSettings,
            ...settingsFromDB
          };
          
          setSettings(mergedSettings);
          
          if (mergedSettings.theme) {
            applyThemeSettings(mergedSettings.theme);
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = <K extends keyof SettingsState>(
    section: K, 
    newSettings: SettingsState[K]
  ) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        ...newSettings
      }
    }));
  };

  const handleSaveSettings = async (section: string) => {
    try {
      const sectionData = settings[section as keyof SettingsState];
      const success = await saveSetting(section, sectionData);
      
      if (success) {
        if (section === 'theme') {
          applyThemeSettings(settings.theme);
        }
        
        toast.success('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const handleImageUpload = (type: string) => {
    console.log(`Image upload requested for ${type}`);
  };

  const value: SettingsContextProps = {
    settings,
    updateSettings,
    handleSaveSettings,
    handleImageUpload
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
