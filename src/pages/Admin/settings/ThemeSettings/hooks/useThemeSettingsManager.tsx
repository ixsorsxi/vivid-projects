
import { useEffect, useState } from 'react';

export interface ThemeSettings {
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
}

interface UseThemeSettingsManagerProps {
  settings: ThemeSettings;
  setSettings: (settings: any) => void;
}

export function useThemeSettingsManager({ settings, setSettings }: UseThemeSettingsManagerProps) {
  // Store initial settings when component mounts
  const [initialSettings, setInitialSettings] = useState<ThemeSettings>(settings);
  
  // Create a flag to control real-time preview vs. actual application
  const [previewMode, setPreviewMode] = useState(true);
  
  // Reset to initial settings when component unmounts and changes weren't saved
  useEffect(() => {
    return () => {
      if (previewMode) {
        restoreInitialSettings();
      }
    };
  }, [initialSettings, previewMode]);
  
  // Apply theme variables based on settings
  useEffect(() => {
    if (previewMode) {
      // Only apply preview styles to the preview container
      return;
    }
    
    // Apply global styles when not in preview mode (after saving)
    applyGlobalStyles();
    
    // Clean up function
    return () => {
      if (!previewMode) {
        const styleElement = document.getElementById('custom-theme-styles');
        if (styleElement) {
          styleElement.textContent = '';
        }
      }
    };
  }, [settings, previewMode]);

  // Function to apply all theme styles globally
  const applyGlobalStyles = () => {
    // Apply custom CSS
    let styleElement = document.getElementById('custom-theme-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'custom-theme-styles';
      document.head.appendChild(styleElement);
    }
    
    // Set the CSS content
    styleElement.textContent = settings.customCSS || '';
    
    // Apply theme variables
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--background-color', settings.backgroundColor);
    document.documentElement.style.setProperty('--sidebar-color', settings.sidebarColor);
    document.documentElement.style.setProperty('--card-color', settings.cardColor);
    
    // Apply font family
    if (settings.fontFamily) {
      document.documentElement.style.setProperty('--font-family', settings.fontFamily);
    }
    
    // Apply border radius
    let radiusValue = getBorderRadiusValue(settings.borderRadius);
    document.documentElement.style.setProperty('--border-radius', radiusValue);
    
    // Toggle dark mode
    document.documentElement.classList.toggle('dark', settings.darkMode);
  };

  // Get border radius value based on setting
  const getBorderRadiusValue = (borderRadius: string) => {
    switch (borderRadius) {
      case 'none': return '0';
      case 'small': return '0.25rem';
      case 'medium': return '0.5rem';
      case 'large': return '0.75rem';
      case 'full': return '9999px';
      default: return '0.5rem';
    }
  };

  // Function to restore initial settings
  const restoreInitialSettings = () => {
    document.documentElement.style.setProperty('--primary-color', initialSettings.primaryColor);
    document.documentElement.style.setProperty('--background-color', initialSettings.backgroundColor);
    document.documentElement.style.setProperty('--sidebar-color', initialSettings.sidebarColor);
    document.documentElement.style.setProperty('--card-color', initialSettings.cardColor);
    
    if (initialSettings.fontFamily) {
      document.documentElement.style.setProperty('--font-family', initialSettings.fontFamily);
    }
    
    let radiusValue = getBorderRadiusValue(initialSettings.borderRadius);
    document.documentElement.style.setProperty('--border-radius', radiusValue);
    
    document.documentElement.classList.toggle('dark', initialSettings.darkMode);
  };

  // Modified save handler to apply changes globally
  const handleSaveSettingsWithPreview = (section: string, saveCallback: (section: string) => void) => {
    setPreviewMode(false); // Exit preview mode and apply changes globally
    setInitialSettings({...settings}); // Update initial settings to current settings
    
    // Apply theme variables immediately
    applyGlobalStyles();
    
    // Call the original save function
    saveCallback(section);
  };

  return {
    previewMode,
    handleSaveSettingsWithPreview
  };
}
