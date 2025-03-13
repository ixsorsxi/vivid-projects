
import { useState } from 'react';

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
  setSettings: (settings: ThemeSettings) => void;
}

export function useThemeSettingsManager({ settings }: UseThemeSettingsManagerProps) {
  // Store initial settings when component mounts
  const [initialSettings] = useState<ThemeSettings>(settings);
  
  // Function to apply theme styles when saving
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

  // Save handler that applies changes only when explicitly saving
  const handleSaveSettingsWithApply = (section: string, saveCallback: (section: string) => void) => {
    // Apply theme variables when saving
    applyGlobalStyles();
    
    // Call the original save function
    saveCallback(section);
  };

  return {
    handleSaveSettingsWithApply
  };
}
