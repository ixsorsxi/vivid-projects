
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CssEditor from './components/CssEditor';
import CssPreview from './components/CssPreview';
import CssHelp from './components/CssHelp';
import CssWarning from './components/CssWarning';

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
  const [activeTab, setActiveTab] = useState('editor');
  const [cssPreview, setCssPreview] = useState('');
  
  // Update preview when CSS changes or tab changes
  useEffect(() => {
    if (activeTab === 'preview') {
      setCssPreview(settings.customCSS);
    }
  }, [settings.customCSS, activeTab]);

  const handleCssChange = (css: string) => {
    setSettings({...settings, customCSS: css});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Customization</CardTitle>
        <CardDescription>Custom CSS and advanced display settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="editor">CSS Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="help">CSS Help</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="space-y-2">
            <CssEditor 
              customCSS={settings.customCSS} 
              onChange={handleCssChange} 
            />
          </TabsContent>
          
          <TabsContent value="preview">
            <CssPreview cssPreview={cssPreview} />
          </TabsContent>
          
          <TabsContent value="help">
            <CssHelp />
          </TabsContent>
        </Tabs>

        <CssWarning />
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSaveSettings('theme')}>Save Advanced Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default AdvancedCustomizationSection;
