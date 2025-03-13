
import React from 'react';
import BrandingSection from './BrandingSection';
import AppearanceSection from './AppearanceSection';
import BackgroundImagesSection from './BackgroundImagesSection';
import AdvancedCustomizationSection from './AdvancedCustomizationSection';
import ThemePreviewSection from './ThemePreviewSection';

interface ThemeSettingsProps {
  settings: {
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
  setSettings: (settings: any) => void;
  handleSaveSettings: (section: string) => void;
  handleImageUpload: (type: string) => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ 
  settings, 
  setSettings, 
  handleSaveSettings,
  handleImageUpload
}) => {
  // Apply custom CSS from the settings
  React.useEffect(() => {
    // Create or update the custom style element
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
    let radiusValue = '0.5rem'; // default
    switch (settings.borderRadius) {
      case 'none': radiusValue = '0'; break;
      case 'small': radiusValue = '0.25rem'; break;
      case 'medium': radiusValue = '0.5rem'; break;
      case 'large': radiusValue = '0.75rem'; break;
      case 'full': radiusValue = '9999px'; break;
    }
    document.documentElement.style.setProperty('--border-radius', radiusValue);
    
    // Toggle dark mode
    document.documentElement.classList.toggle('dark', settings.darkMode);
    
    // Clean up function to remove styles when component unmounts
    return () => {
      if (styleElement) {
        styleElement.textContent = '';
      }
    };
  }, [settings]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BrandingSection 
          settings={settings} 
          setSettings={setSettings} 
          handleSaveSettings={handleSaveSettings}
          handleImageUpload={handleImageUpload}
        />
        
        <AppearanceSection 
          settings={settings} 
          setSettings={setSettings} 
          handleSaveSettings={handleSaveSettings}
        />
      </div>
      
      <ThemePreviewSection settings={settings} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BackgroundImagesSection 
          handleImageUpload={handleImageUpload}
          handleSaveSettings={handleSaveSettings}
        />
        
        <AdvancedCustomizationSection 
          settings={settings} 
          setSettings={setSettings} 
          handleSaveSettings={handleSaveSettings}
        />
      </div>
    </div>
  );
};

export default ThemeSettings;
