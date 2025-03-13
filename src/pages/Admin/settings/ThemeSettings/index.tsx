
import React, { useEffect, useState } from 'react';
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
  // Store initial settings when component mounts
  const [initialSettings, setInitialSettings] = useState(settings);
  
  // Create a flag to control real-time preview vs. actual application
  const [previewMode, setPreviewMode] = useState(true);
  
  // Apply custom CSS from the settings only to the preview
  useEffect(() => {
    if (previewMode) {
      // Only apply preview styles to the preview container
      return;
    }
    
    // Only apply global styles when not in preview mode (after saving)
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

  // Restore original settings when component unmounts
  useEffect(() => {
    return () => {
      if (previewMode) {
        // Reset to initial settings when component unmounts and changes weren't saved
        document.documentElement.style.setProperty('--primary-color', initialSettings.primaryColor);
        document.documentElement.style.setProperty('--background-color', initialSettings.backgroundColor);
        document.documentElement.style.setProperty('--sidebar-color', initialSettings.sidebarColor);
        document.documentElement.style.setProperty('--card-color', initialSettings.cardColor);
        
        if (initialSettings.fontFamily) {
          document.documentElement.style.setProperty('--font-family', initialSettings.fontFamily);
        }
        
        // Reset border radius
        let radiusValue = '0.5rem'; // default
        switch (initialSettings.borderRadius) {
          case 'none': radiusValue = '0'; break;
          case 'small': radiusValue = '0.25rem'; break;
          case 'medium': radiusValue = '0.5rem'; break;
          case 'large': radiusValue = '0.75rem'; break;
          case 'full': radiusValue = '9999px'; break;
        }
        document.documentElement.style.setProperty('--border-radius', radiusValue);
        
        // Reset dark mode
        document.documentElement.classList.toggle('dark', initialSettings.darkMode);
      }
    };
  }, [initialSettings, previewMode]);

  // Modified save handler to apply changes globally
  const handleSaveSettingsWithPreview = (section: string) => {
    setPreviewMode(false); // Exit preview mode and apply changes globally
    setInitialSettings({...settings}); // Update initial settings to current settings
    
    // Apply theme variables immediately
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
    
    // Call the original save function
    handleSaveSettings(section);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BrandingSection 
          settings={settings} 
          setSettings={setSettings} 
          handleSaveSettings={handleSaveSettingsWithPreview}
          handleImageUpload={handleImageUpload}
        />
        
        <AppearanceSection 
          settings={settings} 
          setSettings={setSettings} 
          handleSaveSettings={handleSaveSettingsWithPreview}
        />
      </div>
      
      <ThemePreviewSection settings={settings} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BackgroundImagesSection 
          handleImageUpload={handleImageUpload}
          handleSaveSettings={handleSaveSettingsWithPreview}
        />
        
        <AdvancedCustomizationSection 
          settings={settings} 
          setSettings={setSettings} 
          handleSaveSettings={handleSaveSettingsWithPreview}
        />
      </div>
    </div>
  );
};

export default ThemeSettings;
