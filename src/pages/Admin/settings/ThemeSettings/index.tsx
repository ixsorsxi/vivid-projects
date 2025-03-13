
import React from 'react';
import BrandingSection from './BrandingSection';
import AppearanceSection from './AppearanceSection';
import BackgroundImagesSection from './BackgroundImagesSection';
import AdvancedCustomizationSection from './AdvancedCustomizationSection';
import ThemePreviewSection from './ThemePreviewSection';
import { useThemeSettingsManager } from './hooks/useThemeSettingsManager';
import type { ThemeSettings as ThemeSettingsType } from './hooks/useThemeSettingsManager';

interface ThemeSettingsComponentProps {
  settings: ThemeSettingsType;
  setSettings: (settings: any) => void;
  handleSaveSettings: (section: string) => void;
  handleImageUpload: (type: string) => void;
}

const ThemeSettingsComponent: React.FC<ThemeSettingsComponentProps> = ({ 
  settings, 
  setSettings, 
  handleSaveSettings,
  handleImageUpload
}) => {
  const { handleSaveSettingsWithPreview } = useThemeSettingsManager({
    settings,
    setSettings
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BrandingSection 
          settings={settings} 
          setSettings={setSettings} 
          handleSaveSettings={(section) => handleSaveSettingsWithPreview(section, handleSaveSettings)}
          handleImageUpload={handleImageUpload}
        />
        
        <AppearanceSection 
          settings={settings} 
          setSettings={setSettings} 
          handleSaveSettings={(section) => handleSaveSettingsWithPreview(section, handleSaveSettings)}
        />
      </div>
      
      <ThemePreviewSection settings={settings} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BackgroundImagesSection 
          handleImageUpload={handleImageUpload}
          handleSaveSettings={(section) => handleSaveSettingsWithPreview(section, handleSaveSettings)}
        />
        
        <AdvancedCustomizationSection 
          settings={settings} 
          setSettings={setSettings} 
          handleSaveSettings={(section) => handleSaveSettingsWithPreview(section, handleSaveSettings)}
        />
      </div>
    </div>
  );
};

export default ThemeSettingsComponent;
