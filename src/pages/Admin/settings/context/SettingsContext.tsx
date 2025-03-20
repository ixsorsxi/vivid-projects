
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { SettingsState, SettingsContextProps } from './types/settings-types';
import { defaultSettings } from './defaults/defaultSettings';
import { applyThemeSettings } from './utils/themeUtils';
import { supabase } from '@/integrations/supabase/client';

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load settings from database on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('key, value');
          
        if (!error && data) {
          const loadedSettings = { ...defaultSettings };
          
          data.forEach(item => {
            if (item.key in loadedSettings && item.value) {
              try {
                loadedSettings[item.key as keyof SettingsState] = JSON.parse(item.value);
              } catch (e) {
                console.error(`Error parsing settings for ${item.key}:`, e);
              }
            }
          });
          
          setSettings(loadedSettings);
          
          // Apply theme settings on load
          applyThemeSettings(loadedSettings.theme);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    loadSettings();
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

  const handleSaveSettings = async (section: keyof typeof settings) => {
    if (!isInitialized) return;
    
    try {
      // Save to database
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: section,
          value: JSON.stringify(settings[section])
        }, {
          onConflict: 'key'
        });
        
      if (error) throw error;
      
      toast(`Settings saved`, {
        description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated successfully.`,
      });
      
      // If we're saving theme settings, apply them immediately
      if (section === 'theme') {
        applyThemeSettings(settings.theme);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings', {
        description: 'An error occurred while saving your settings.'
      });
    }
  };

  const handleImageUpload = (type: string) => {
    toast(`Upload initiated`, {
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
