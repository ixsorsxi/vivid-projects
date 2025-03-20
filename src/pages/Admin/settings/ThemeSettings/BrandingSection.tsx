
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LogoUploader from './components/branding/LogoUploader';
import BrandingTextFields from './components/branding/BrandingTextFields';
import BrandingPreview from './components/branding/BrandingPreview';

interface BrandingSectionProps {
  settings: {
    platformTitle: string;
    webLink: string;
    slogan: string;
    logoUrl?: string;
    faviconUrl?: string;
  };
  setSettings: (settings: any) => void;
  handleSaveSettings: (section: string) => void;
  handleImageUpload: (type: string) => void;
}

const BrandingSection: React.FC<BrandingSectionProps> = ({ 
  settings, 
  setSettings, 
  handleSaveSettings
}) => {
  const [logoImage, setLogoImage] = useState<string | null>(settings.logoUrl || null);
  const [faviconImage, setFaviconImage] = useState<string | null>(settings.faviconUrl || null);

  const handleTextFieldChange = (field: string, value: string) => {
    setSettings({...settings, [field]: value});
  };

  const handleLogoChange = (url: string | null) => {
    setLogoImage(url);
    setSettings({...settings, logoUrl: url});
  };

  const handleFaviconChange = (url: string | null) => {
    setFaviconImage(url);
    setSettings({...settings, faviconUrl: url});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding</CardTitle>
        <CardDescription>Configure application branding elements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="text">
          <TabsList className="mb-4">
            <TabsTrigger value="text">Text Elements</TabsTrigger>
            <TabsTrigger value="logos">Logo & Favicon</TabsTrigger>
            <TabsTrigger value="preview">Brand Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text">
            <BrandingTextFields 
              platformTitle={settings.platformTitle}
              webLink={settings.webLink}
              slogan={settings.slogan}
              onChange={handleTextFieldChange}
            />
          </TabsContent>
          
          <TabsContent value="logos" className="space-y-6">
            <div className="space-y-2">
              <label className="font-medium">Logo</label>
              <LogoUploader 
                logoUrl={logoImage} 
                onLogoChange={handleLogoChange}
                type="logo"
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium">Favicon</label>
              <LogoUploader 
                logoUrl={faviconImage} 
                onLogoChange={handleFaviconChange}
                type="favicon"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <BrandingPreview
              platformTitle={settings.platformTitle}
              webLink={settings.webLink}
              slogan={settings.slogan}
              logoUrl={logoImage}
              faviconUrl={faviconImage}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSaveSettings('theme')}>Save Branding</Button>
      </CardFooter>
    </Card>
  );
};

export default BrandingSection;
