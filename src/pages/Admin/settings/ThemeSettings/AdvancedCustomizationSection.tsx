
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  React.useEffect(() => {
    if (activeTab === 'preview') {
      setCssPreview(settings.customCSS);
    }
  }, [settings.customCSS, activeTab]);

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
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="border rounded-md p-4 min-h-[200px] relative">
              {cssPreview ? (
                <div className="mb-4">
                  <style>{cssPreview}</style>
                  <div className="custom-preview-area space-y-4">
                    <div className="example-button bg-primary text-primary-foreground px-4 py-2 rounded">
                      Example Button
                    </div>
                    <div className="example-card p-4 border rounded-md bg-card">
                      <h3 className="font-semibold mb-2">Example Card</h3>
                      <p className="text-sm">This card shows how your CSS affects card components</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="example-badge px-2 py-1 text-xs rounded-full bg-primary text-primary-foreground">
                        Badge 1
                      </div>
                      <div className="example-badge px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                        Badge 2
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Add some CSS to see a preview</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="help">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-semibold mb-2">CSS Variables Available</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Default Variables:</p>
                    <ul className="text-sm pl-5 list-disc">
                      <li><code>--primary-color</code></li>
                      <li><code>--background-color</code></li>
                      <li><code>--sidebar-color</code></li>
                      <li><code>--card-color</code></li>
                      <li><code>--border-radius</code></li>
                      <li><code>--font-family</code></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Example CSS:</p>
                    <pre className="text-xs bg-slate-800 text-slate-200 p-2 rounded-md">
                      {`.custom-header {\n  background: var(--primary-color);\n  color: white;\n}\n\n.card {\n  border-radius: var(--border-radius);\n}`}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-md">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Notes</h3>
                <ul className="text-sm text-yellow-800 dark:text-yellow-200 pl-5 list-disc">
                  <li>Custom CSS changes override system styles and should be used with caution</li>
                  <li>Test your changes in both light and dark mode</li>
                  <li>Keep selector specificity in mind to avoid unexpected results</li>
                  <li>Use browser developer tools to debug CSS issues</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

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
