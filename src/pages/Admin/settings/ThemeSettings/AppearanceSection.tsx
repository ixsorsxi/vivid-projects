
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

// Predefined color palettes
const colorPalettes = {
  modern: {
    primaryColor: '#3B82F6',
    backgroundColor: '#F9FAFB',
    sidebarColor: '#1F2937',
    cardColor: '#FFFFFF'
  },
  pastel: {
    primaryColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
    sidebarColor: '#7C3AED',
    cardColor: '#FFFFFF'
  },
  corporate: {
    primaryColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
    sidebarColor: '#0F172A',
    cardColor: '#FFFFFF'
  },
  dark: {
    primaryColor: '#6B7280',
    backgroundColor: '#1F2937',
    sidebarColor: '#111827',
    cardColor: '#374151'
  }
};

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Colors & Appearance</CardTitle>
        <CardDescription>Configure application colors and visual styles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="colors">
          <TabsList className="mb-4">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography & UI</TabsTrigger>
            <TabsTrigger value="presets">Color Presets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-10 h-10 p-0 border-2" 
                      style={{ backgroundColor: settings.primaryColor }}
                    >
                      <span className="sr-only">Pick a color</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="grid grid-cols-5 gap-2">
                      {['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#6B7280', '#000000'].map(color => (
                        <Button 
                          key={color}
                          variant="outline" 
                          className="w-8 h-8 p-0 border-2" 
                          style={{ backgroundColor: color }}
                          onClick={() => setSettings({...settings, primaryColor: color})}
                        />
                      ))}
                    </div>
                    <div className="mt-2">
                      <input 
                        type="color" 
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="w-full h-8"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <Input 
                  id="primaryColor" 
                  value={settings.primaryColor} 
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-10 h-10 p-0 border-2" 
                      style={{ backgroundColor: settings.backgroundColor }}
                    >
                      <span className="sr-only">Pick a color</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="grid grid-cols-5 gap-2">
                      {['#F9FAFB', '#F5F3FF', '#F0F9FF', '#F8FAFC', '#F7FEE7', '#1F2937', '#111827', '#FAFAFA'].map(color => (
                        <Button 
                          key={color}
                          variant="outline" 
                          className="w-8 h-8 p-0 border-2" 
                          style={{ backgroundColor: color }}
                          onClick={() => setSettings({...settings, backgroundColor: color})}
                        />
                      ))}
                    </div>
                    <div className="mt-2">
                      <input 
                        type="color" 
                        value={settings.backgroundColor}
                        onChange={(e) => setSettings({...settings, backgroundColor: e.target.value})}
                        className="w-full h-8"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <Input 
                  id="backgroundColor" 
                  value={settings.backgroundColor} 
                  onChange={(e) => setSettings({...settings, backgroundColor: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sidebarColor">Sidebar Color</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-10 h-10 p-0 border-2" 
                      style={{ backgroundColor: settings.sidebarColor }}
                    >
                      <span className="sr-only">Pick a color</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="grid grid-cols-5 gap-2">
                      {['#1F2937', '#0F172A', '#7C3AED', '#4B5563', '#27364B', '#1D4ED8', '#0F766E', '#000000'].map(color => (
                        <Button 
                          key={color}
                          variant="outline" 
                          className="w-8 h-8 p-0 border-2" 
                          style={{ backgroundColor: color }}
                          onClick={() => setSettings({...settings, sidebarColor: color})}
                        />
                      ))}
                    </div>
                    <div className="mt-2">
                      <input 
                        type="color" 
                        value={settings.sidebarColor}
                        onChange={(e) => setSettings({...settings, sidebarColor: e.target.value})}
                        className="w-full h-8"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <Input 
                  id="sidebarColor" 
                  value={settings.sidebarColor} 
                  onChange={(e) => setSettings({...settings, sidebarColor: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardColor">Card Color</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-10 h-10 p-0 border-2" 
                      style={{ backgroundColor: settings.cardColor }}
                    >
                      <span className="sr-only">Pick a color</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="grid grid-cols-5 gap-2">
                      {['#FFFFFF', '#F5F5F5', '#F1F5F9', '#374151', '#1F2937', '#FAFAFA', '#FCFCFC', '#FFFBEB'].map(color => (
                        <Button 
                          key={color}
                          variant="outline" 
                          className="w-8 h-8 p-0 border-2" 
                          style={{ backgroundColor: color }}
                          onClick={() => setSettings({...settings, cardColor: color})}
                        />
                      ))}
                    </div>
                    <div className="mt-2">
                      <input 
                        type="color" 
                        value={settings.cardColor}
                        onChange={(e) => setSettings({...settings, cardColor: e.target.value})}
                        className="w-full h-8"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <Input 
                  id="cardColor" 
                  value={settings.cardColor} 
                  onChange={(e) => setSettings({...settings, cardColor: e.target.value})}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="typography" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font Family</Label>
              <Select 
                value={settings.fontFamily}
                onValueChange={(value) => setSettings({...settings, fontFamily: value})}
              >
                <SelectTrigger id="fontFamily">
                  <SelectValue placeholder="Select font family" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                </SelectContent>
              </Select>
              <div className="pt-2">
                <p className="text-lg" style={{ fontFamily: settings.fontFamily || 'inherit' }}>
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="borderRadius">Border Radius</Label>
              <Select 
                value={settings.borderRadius}
                onValueChange={(value) => setSettings({...settings, borderRadius: value})}
              >
                <SelectTrigger id="borderRadius">
                  <SelectValue placeholder="Select border radius" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (0px)</SelectItem>
                  <SelectItem value="small">Small (4px)</SelectItem>
                  <SelectItem value="medium">Medium (8px)</SelectItem>
                  <SelectItem value="large">Large (12px)</SelectItem>
                  <SelectItem value="full">Full (9999px)</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-5 gap-2 pt-2">
                {['none', 'small', 'medium', 'large', 'full'].map((rad) => {
                  let radiusValue = '0';
                  switch (rad) {
                    case 'none': radiusValue = '0'; break;
                    case 'small': radiusValue = '4px'; break;
                    case 'medium': radiusValue = '8px'; break;
                    case 'large': radiusValue = '12px'; break;
                    case 'full': radiusValue = '9999px'; break;
                  }
                  return (
                    <div
                      key={rad}
                      className="h-8 bg-primary flex items-center justify-center text-[10px] text-primary-foreground"
                      style={{ borderRadius: radiusValue }}
                    >
                      {rad}
                    </div>
                  );
                })}
              </div>
            </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(colorPalettes).map(([name, palette]) => (
                <div 
                  key={name}
                  className="rounded-md border cursor-pointer hover:border-primary transition-colors p-4"
                  onClick={() => applyColorPalette(name)}
                >
                  <h3 className="font-medium mb-2 capitalize">{name}</h3>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: palette.primaryColor }}></div>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: palette.backgroundColor }}></div>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: palette.sidebarColor }}></div>
                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: palette.cardColor }}></div>
                  </div>
                </div>
              ))}
            </div>
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
