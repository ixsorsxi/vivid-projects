import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, X, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

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
  handleSaveSettings,
  handleImageUpload
}) => {
  const [logoImage, setLogoImage] = useState<string | null>(settings.logoUrl || null);
  const [faviconImage, setFaviconImage] = useState<string | null>(settings.faviconUrl || null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleImageUploadInternal = async (type: 'logo' | 'favicon') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'favicon' ? 'image/x-icon,image/png' : 'image/*';
    
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        setIsUploading(true);
        
        try {
          const fileName = `${type}_${Date.now()}_${file.name}`;
          const { data, error } = await supabase.storage
            .from('app-assets')
            .upload(fileName, file);
            
          if (error) {
            throw error;
          }
          
          const { data: urlData } = supabase.storage
            .from('app-assets')
            .getPublicUrl(fileName);
            
          const imageUrl = urlData.publicUrl;
          
          if (type === 'logo') {
            setLogoImage(imageUrl);
            setSettings({...settings, logoUrl: imageUrl});
          } else {
            setFaviconImage(imageUrl);
            setSettings({...settings, faviconUrl: imageUrl});
          }
          
          toast.success(`${type} uploaded successfully`);
        } catch (error) {
          console.error(`Error uploading ${type}:`, error);
          toast.error(`Failed to upload ${type}`);
        } finally {
          setIsUploading(false);
        }
      }
    };
    
    input.click();
  };

  const removeImage = (type: 'logo' | 'favicon') => {
    if (type === 'logo') {
      setLogoImage(null);
      setSettings({...settings, logoUrl: null});
    } else {
      setFaviconImage(null);
      setSettings({...settings, faviconUrl: null});
    }
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
          
          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformTitle">Platform Title</Label>
              <Input 
                id="platformTitle" 
                value={settings.platformTitle} 
                onChange={(e) => setSettings({...settings, platformTitle: e.target.value})}
              />
              <p className="text-sm text-muted-foreground">
                The name of your application as displayed in the interface
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="webLink">Website URL</Label>
              <Input 
                id="webLink" 
                value={settings.webLink} 
                onChange={(e) => setSettings({...settings, webLink: e.target.value})}
              />
              <p className="text-sm text-muted-foreground">
                Public website address for your application
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slogan">Slogan/Tagline</Label>
              <Input 
                id="slogan" 
                value={settings.slogan} 
                onChange={(e) => setSettings({...settings, slogan: e.target.value})}
              />
              <p className="text-sm text-muted-foreground">
                A short phrase describing your product's purpose
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="logos" className="space-y-6">
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 bg-muted/40">
                {logoImage ? (
                  <div className="relative">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute -top-2 -right-2 z-10 h-6 w-6"
                      onClick={() => removeImage('logo')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <img 
                      src={logoImage} 
                      alt="Logo preview" 
                      className="w-28 h-28 object-contain rounded-md"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded overflow-hidden bg-muted flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
                    </svg>
                  </div>
                )}
                <div className="text-sm text-muted-foreground text-center mt-2">
                  <p>Recommended size: 200x200px (SVG or PNG)</p>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={() => handleImageUploadInternal('logo')}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4 mr-2" />
                      Upload Logo
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Favicon</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 bg-muted/40">
                {faviconImage ? (
                  <div className="relative">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute -top-2 -right-2 z-10 h-6 w-6"
                      onClick={() => removeImage('favicon')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <img 
                      src={faviconImage} 
                      alt="Favicon preview" 
                      className="w-12 h-12 object-contain rounded-md"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded overflow-hidden bg-muted flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
                    </svg>
                  </div>
                )}
                <div className="text-sm text-muted-foreground text-center mt-2">
                  <p>Required size: 32x32px (ICO or PNG)</p>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={() => handleImageUploadInternal('favicon')}
                >
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Upload Favicon
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="space-y-6">
              <div className="rounded-lg border overflow-hidden">
                <div 
                  className="p-4 flex items-center justify-between"
                  style={{ backgroundColor: '#27364B', color: 'white' }}
                >
                  <div className="flex items-center gap-2">
                    {logoImage ? (
                      <img src={logoImage} alt="Logo" className="w-8 h-8 object-contain" />
                    ) : (
                      <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{settings.platformTitle || 'Platform Name'}</div>
                      <div className="text-xs opacity-75">{settings.slogan || 'Your platform slogan'}</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 text-sm">
                  <div className="flex items-center gap-1 text-blue-500 mb-2">
                    <ExternalLink size={14} />
                    <a href={settings.webLink} target="_blank" rel="noopener noreferrer">
                      {settings.webLink || 'https://your-app-link.com'}
                    </a>
                  </div>
                  
                  <div className="rounded-md p-4 bg-muted/40 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="flex flex-col items-center">
                      {logoImage ? (
                        <img src={logoImage} alt="Logo" className="w-16 h-16 object-contain mb-2" />
                      ) : (
                        <div className="w-16 h-16 rounded-md bg-primary flex items-center justify-center mb-2">
                          <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
                          </svg>
                        </div>
                      )}
                      <h3 className="font-bold text-lg">{settings.platformTitle || 'Platform Name'}</h3>
                      <p className="text-muted-foreground">{settings.slogan || 'Your platform slogan'}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Login
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Register
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Browser tab appearance</h3>
                  <div className="h-8 rounded-t-md bg-slate-200 dark:bg-slate-800 px-3 flex items-center gap-2">
                    {faviconImage ? (
                      <img src={faviconImage} alt="Favicon" className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4">
                        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
                        </svg>
                      </div>
                    )}
                    <span className="text-xs truncate">
                      {settings.platformTitle || 'Platform Name'}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Application header</h3>
                  <div className="h-12 bg-slate-800 rounded-md px-3 flex items-center text-white gap-2">
                    {logoImage ? (
                      <img src={logoImage} alt="Logo" className="w-6 h-6" />
                    ) : (
                      <div className="w-6 h-6">
                        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="white" />
                        </svg>
                      </div>
                    )}
                    <span className="text-sm truncate">{settings.platformTitle}</span>
                  </div>
                </div>
              </div>
            </div>
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
