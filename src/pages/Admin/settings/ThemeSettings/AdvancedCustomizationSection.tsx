
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AdvancedCustomizationSectionProps {
  settings: {
    customCSS: string;
  };
  setSettings: (settings: any) => void;
  handleSaveSettings: (section: string) => void;
}

const AdvancedCustomizationSection: React.FC<AdvancedCustomizationSectionProps> = ({ 
  settings, 
  setSettings, 
  handleSaveSettings 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Customization</CardTitle>
        <CardDescription>Custom CSS and advanced display settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customCSS">Custom CSS</Label>
          <Textarea 
            id="customCSS" 
            className="font-mono text-sm h-52"
            placeholder=":root { --custom-color: #ff0000; }"
            value={settings.customCSS} 
            onChange={(e) => setSettings({...settings, customCSS: e.target.value})}
          />
          <p className="text-sm text-muted-foreground">
            Enter custom CSS to further customize the application appearance. 
            These styles will be applied globally.
          </p>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200 rounded-md mt-4">
          <p className="text-sm">
            <strong>Note:</strong> Custom CSS changes may override system styles and 
            should be used with caution. Incorrect CSS can break the application layout.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSaveSettings('theme')}>Save Advanced Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default AdvancedCustomizationSection;
