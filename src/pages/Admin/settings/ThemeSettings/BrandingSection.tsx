
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';

interface BrandingSectionProps {
  settings: {
    platformTitle: string;
    webLink: string;
    slogan: string;
  };
  setSettings: (settings: any) => void;
  handleSaveSettings: (section: string) => void;
  handleImageUpload: (type: string) => void;
}

const BrandingSection: React.FC<BrandingSectionProps> = ({ 
  settings, 
  setSettings, 
  handleSaveSettings,
  handleImageUpload
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding</CardTitle>
        <CardDescription>Configure application branding elements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="platformTitle">Platform Title</Label>
          <Input 
            id="platformTitle" 
            value={settings.platformTitle} 
            onChange={(e) => setSettings({...settings, platformTitle: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="webLink">Website URL</Label>
          <Input 
            id="webLink" 
            value={settings.webLink} 
            onChange={(e) => setSettings({...settings, webLink: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slogan">Slogan/Tagline</Label>
          <Input 
            id="slogan" 
            value={settings.slogan} 
            onChange={(e) => setSettings({...settings, slogan: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label>Logo</Label>
          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 bg-muted/40">
            <div className="w-20 h-20 rounded overflow-hidden bg-muted flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
              </svg>
            </div>
            <div className="text-sm text-muted-foreground text-center mt-2">
              <p>Recommended size: 200x200px (SVG or PNG)</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => handleImageUpload('Logo')}
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Logo
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Favicon</Label>
          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 bg-muted/40">
            <div className="w-12 h-12 rounded overflow-hidden bg-muted flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
              </svg>
            </div>
            <div className="text-sm text-muted-foreground text-center mt-2">
              <p>Required size: 32x32px (ICO or PNG)</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => handleImageUpload('Favicon')}
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Favicon
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSaveSettings('theme')}>Save Branding</Button>
      </CardFooter>
    </Card>
  );
};

export default BrandingSection;
