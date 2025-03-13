
import React from 'react';
import BrandingSection from './BrandingSection';
import AppearanceSection from './AppearanceSection';
import BackgroundImagesSection from './BackgroundImagesSection';
import AdvancedCustomizationSection from './AdvancedCustomizationSection';

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
  return (
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
  );
};

export default ThemeSettings;
