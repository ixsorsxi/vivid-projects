import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SettingsState, SettingsContextProps } from './types/settings-types';
import { defaultSettings } from './defaults/defaultSettings';
import { applyThemeSettings } from './utils/themeUtils';
import { toast } from '@/components/ui/toast-wrapper';

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
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*');
          
        if (error) {
          console.error('Error fetching settings:', error);
          return;
        }

        if (data && data.length > 0) {
          const settingsFromDB: Record<string, any> = {};
          
          data.forEach((item: any) => {
            if (item.key && item.value) {
              try {
                settingsFromDB[item.key] = JSON.parse(item.value);
              } catch (e) {
                settingsFromDB[item.key] = item.value;
              }
            }
          });
          
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
        console.error('Error processing settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
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
      const { data, error: fetchError } = await supabase
        .from('settings')
        .select('*')
        .eq('key', section);
      
      const stringifiedValue = JSON.stringify(settings[section as keyof SettingsState]);
      
      if (data && data.length > 0) {
        const { error } = await supabase
          .from('settings')
          .update({ value: stringifiedValue })
          .eq('key', section);
          
        if (error) throw error;
      } 
      else {
        const { error } = await supabase
          .from('settings')
          .insert([
            { key: section, value: stringifiedValue }
          ]);
          
        if (error) throw error;
      }
      
      if (section === 'theme') {
        applyThemeSettings(settings.theme);
      }
      
      toast.success('Settings saved successfully!');
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
