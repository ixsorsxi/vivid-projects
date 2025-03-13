
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette } from 'lucide-react';
import ColorPicker from './components/ColorPicker';
import BorderRadiusSelector from './components/BorderRadiusSelector';
import FontSelector from './components/FontSelector';
import { colorPalettes, ColorPaletteSelector } from './components/ColorPaletteSelector';

interface AppearanceSectionProps {
  settings: {
    primaryColor: string;
    backgroundColor: string;
    sidebarColor: string;
    cardColor: string;
    fontFamily: string;
    borderRadius: string;
    darkMode: boolean;
  };
  setSettings: (settings: any) => void;
  handleSaveSettings: (section: string) => void;
}

const AppearanceSection: React.FC<AppearanceSectionProps> = ({ 
  settings, 
  setSettings, 
  handleSaveSettings 
}) => {
  const applyColorPalette = (palette: string) => {
    const selectedPalette = colorPalettes[palette as keyof typeof colorPalettes];
    if (selectedPalette) {
      setSettings({
        ...settings,
        ...selectedPalette
      });
    }
  };

  // Background color presets
  const backgroundColorPresets = ['#F9FAFB', '#F5F3FF', '#F0F9FF', '#F8FAFC', '#F7FEE7', '#1F2937', '#111827', '#FAFAFA'];
  
  // Sidebar color presets
  const sidebarColorPresets = ['#1F2937', '#0F172A', '#7C3AED', '#4B5563', '#27364B', '#1D4ED8', '#0F766E', '#000000'];
  
  // Card color presets
  const cardColorPresets = ['#FFFFFF', '#F5F5F5', '#F1F5F9', '#374151', '#1F2937', '#FAFAFA', '#FCFCFC', '#FFFBEB'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Colors & Appearance</CardTitle>
            <CardDescription>Configure application colors and visual styles</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="colors">
          <TabsList className="mb-4">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography & UI</TabsTrigger>
            <TabsTrigger value="presets">Color Presets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-4">
            <ColorPicker 
              label="Primary Color"
              value={settings.primaryColor}
              onChange={(color) => setSettings({...settings, primaryColor: color})}
            />

            <ColorPicker 
              label="Background Color"
              value={settings.backgroundColor}
              onChange={(color) => setSettings({...settings, backgroundColor: color})}
              presetColors={backgroundColorPresets}
            />

            <ColorPicker 
              label="Sidebar Color"
              value={settings.sidebarColor}
              onChange={(color) => setSettings({...settings, sidebarColor: color})}
              presetColors={sidebarColorPresets}
            />

            <ColorPicker 
              label="Card Color"
              value={settings.cardColor}
              onChange={(color) => setSettings({...settings, cardColor: color})}
              presetColors={cardColorPresets}
            />
          </TabsContent>
          
          <TabsContent value="typography" className="space-y-4">
            <FontSelector 
              value={settings.fontFamily}
              onChange={(value) => setSettings({...settings, fontFamily: value})}
            />

            <BorderRadiusSelector 
              value={settings.borderRadius}
              onChange={(value) => setSettings({...settings, borderRadius: value})}
            />

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Enable dark mode by default</p>
              </div>
              <Switch 
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => setSettings({...settings, darkMode: checked})}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="presets" className="space-y-4">
            <ColorPaletteSelector 
              currentSettings={settings}
              onSelectPalette={applyColorPalette}
            />
            <p className="text-sm text-muted-foreground">
              Click on any preset to apply its color scheme. You can then further customize individual colors.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSaveSettings('theme')}>Save Appearance</Button>
      </CardFooter>
    </Card>
  );
};

export default AppearanceSection;
