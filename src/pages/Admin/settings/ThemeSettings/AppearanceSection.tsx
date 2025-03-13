
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Colors & Appearance</CardTitle>
        <CardDescription>Configure application colors and visual styles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex gap-2">
            <div 
              className="w-10 h-10 rounded border" 
              style={{ backgroundColor: settings.primaryColor }}
            />
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
            <div 
              className="w-10 h-10 rounded border" 
              style={{ backgroundColor: settings.backgroundColor }}
            />
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
            <div 
              className="w-10 h-10 rounded border" 
              style={{ backgroundColor: settings.sidebarColor }}
            />
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
            <div 
              className="w-10 h-10 rounded border" 
              style={{ backgroundColor: settings.cardColor }}
            />
            <Input 
              id="cardColor" 
              value={settings.cardColor} 
              onChange={(e) => setSettings({...settings, cardColor: e.target.value})}
            />
          </div>
        </div>

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
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSaveSettings('theme')}>Save Appearance</Button>
      </CardFooter>
    </Card>
  );
};

export default AppearanceSection;
