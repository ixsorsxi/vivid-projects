
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Palette, Paintbrush, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  },
  vibrant: {
    primaryColor: '#F97316',
    backgroundColor: '#FFFBEB',
    sidebarColor: '#7C2D12',
    cardColor: '#FFFFFF'
  },
  minimal: {
    primaryColor: '#71717A',
    backgroundColor: '#FAFAFA',
    sidebarColor: '#27272A',
    cardColor: '#FFFFFF'
  }
};

// Available fonts
const fontOptions = [
  { value: 'Inter', label: 'Inter (Modern Sans-Serif)' },
  { value: 'Poppins', label: 'Poppins (Clean & Rounded)' },
  { value: 'Roboto', label: 'Roboto (Material Design)' },
  { value: 'Open Sans', label: 'Open Sans (Readable)' },
  { value: 'Montserrat', label: 'Montserrat (Contemporary)' },
  { value: 'Lato', label: 'Lato (Balanced)' },
  { value: 'Raleway', label: 'Raleway (Elegant)' },
  { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro (Versatile)' },
  { value: 'Nunito', label: 'Nunito (Rounded & Modern)' }
];

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

  // Function to generate color swatches
  const renderColorSwatches = (colors: string[], currentColor: string, onChange: (color: string) => void) => {
    return (
      <div className="grid grid-cols-5 gap-2">
        {colors.map(color => (
          <button 
            key={color}
            type="button"
            className={cn(
              "w-8 h-8 rounded-md border-2 flex items-center justify-center transition-all", 
              color === currentColor ? "border-primary ring-2 ring-primary/20" : "border-muted hover:border-muted-foreground"
            )}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            aria-label={`Select color ${color}`}
          >
            {color === currentColor && <Check className="h-3 w-3 text-white drop-shadow-sm" />}
          </button>
        ))}
      </div>
    );
  };

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
                    {renderColorSwatches(
                      ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#6B7280', '#000000'],
                      settings.primaryColor,
                      (color) => setSettings({...settings, primaryColor: color})
                    )}
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
                    {renderColorSwatches(
                      ['#F9FAFB', '#F5F3FF', '#F0F9FF', '#F8FAFC', '#F7FEE7', '#1F2937', '#111827', '#FAFAFA'],
                      settings.backgroundColor,
                      (color) => setSettings({...settings, backgroundColor: color})
                    )}
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
                    {renderColorSwatches(
                      ['#1F2937', '#0F172A', '#7C3AED', '#4B5563', '#27364B', '#1D4ED8', '#0F766E', '#000000'],
                      settings.sidebarColor,
                      (color) => setSettings({...settings, sidebarColor: color})
                    )}
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
                    {renderColorSwatches(
                      ['#FFFFFF', '#F5F5F5', '#F1F5F9', '#374151', '#1F2937', '#FAFAFA', '#FCFCFC', '#FFFBEB'],
                      settings.cardColor,
                      (color) => setSettings({...settings, cardColor: color})
                    )}
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
              <div className="flex items-center gap-2 mb-1">
                <Type className="h-4 w-4 text-primary" />
                <Label htmlFor="fontFamily">Font Family</Label>
              </div>
              <Select 
                value={settings.fontFamily}
                onValueChange={(value) => setSettings({...settings, fontFamily: value})}
              >
                <SelectTrigger id="fontFamily">
                  <SelectValue placeholder="Select font family" />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map(font => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="p-4 mt-2 bg-muted/30 rounded-md">
                <p className="text-2xl font-bold mb-2" style={{ fontFamily: settings.fontFamily || 'inherit' }}>
                  Font: {settings.fontFamily || 'Default'}
                </p>
                <p className="text-base" style={{ fontFamily: settings.fontFamily || 'inherit' }}>
                  The quick brown fox jumps over the lazy dog.
                </p>
                <p className="text-sm mt-1" style={{ fontFamily: settings.fontFamily || 'inherit' }}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Paintbrush className="h-4 w-4 text-primary" />
                <Label htmlFor="borderRadius">Border Radius</Label>
              </div>
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
                      className={cn(
                        "h-8 bg-primary flex items-center justify-center text-[10px] text-primary-foreground",
                        rad === settings.borderRadius ? "ring-2 ring-primary/50" : ""
                      )}
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
                  className={cn(
                    "rounded-md border cursor-pointer hover:border-primary transition-colors p-4",
                    JSON.stringify({primaryColor: settings.primaryColor, backgroundColor: settings.backgroundColor, 
                        sidebarColor: settings.sidebarColor, cardColor: settings.cardColor}) === 
                        JSON.stringify(palette) ? "border-primary bg-primary/5" : ""
                  )}
                  onClick={() => applyColorPalette(name)}
                >
                  <h3 className="font-medium mb-2 capitalize">{name}</h3>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: palette.primaryColor }}></div>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: palette.backgroundColor }}></div>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: palette.sidebarColor }}></div>
                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: palette.cardColor }}></div>
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Primary</span>
                      <span>{palette.primaryColor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Background</span>
                      <span>{palette.backgroundColor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sidebar</span>
                      <span>{palette.sidebarColor}</span>
                    </div>
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
