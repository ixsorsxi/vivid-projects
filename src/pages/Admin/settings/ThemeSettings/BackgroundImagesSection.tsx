
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, X } from 'lucide-react';

interface BackgroundImagesSectionProps {
  handleImageUpload: (type: string) => void;
  handleSaveSettings: (section: string) => void;
}

const BackgroundImagesSection: React.FC<BackgroundImagesSectionProps> = ({ 
  handleImageUpload,
  handleSaveSettings
}) => {
  // Mock state for image previews (in a real app, these would come from the settings)
  const [imageStates, setImageStates] = useState({
    loginBackground: null as string | null,
    appBackground: null as string | null
  });

  // Mock image upload function to simulate file selection
  const simulateImageUpload = (type: 'loginBackground' | 'appBackground') => {
    // Create a mock file input and trigger click
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setImageStates(prev => ({
            ...prev,
            [type]: result
          }));
        };
        
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  // Function to remove an image
  const removeImage = (type: 'loginBackground' | 'appBackground') => {
    setImageStates(prev => ({
      ...prev,
      [type]: null
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Background Images</CardTitle>
        <CardDescription>Configure application background and login images</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="login">
          <TabsList className="mb-4">
            <TabsTrigger value="login">Login Background</TabsTrigger>
            <TabsTrigger value="app">App Background</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label>Login Page Background</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 bg-muted/40">
                {imageStates.loginBackground ? (
                  <div className="relative w-full">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 z-10 h-8 w-8"
                      onClick={() => removeImage('loginBackground')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <img 
                      src={imageStates.loginBackground} 
                      alt="Login background preview" 
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 rounded overflow-hidden bg-muted/60 flex items-center justify-center">
                    <p className="text-muted-foreground">Login background preview</p>
                  </div>
                )}
                <div className="text-sm text-muted-foreground text-center mt-2">
                  <p>Recommended size: 1920x1080px</p>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={() => simulateImageUpload('loginBackground')}
                >
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-2">Login Background Preview</h3>
              <div 
                className="w-full h-48 rounded-md overflow-hidden border relative"
                style={{
                  backgroundImage: imageStates.loginBackground ? `url(${imageStates.loginBackground})` : 'none',
                  backgroundColor: !imageStates.loginBackground ? '#f1f5f9' : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="bg-white/90 dark:bg-slate-900/90 p-6 rounded-lg w-64">
                    <h3 className="text-center font-bold mb-4">Application Login</h3>
                    <div className="space-y-2">
                      <div className="h-8 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-8 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-8 w-full bg-primary rounded mt-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="app" className="space-y-4">
            <div className="space-y-2">
              <Label>App Background Image</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 bg-muted/40">
                {imageStates.appBackground ? (
                  <div className="relative w-full">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 z-10 h-8 w-8"
                      onClick={() => removeImage('appBackground')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <img 
                      src={imageStates.appBackground} 
                      alt="App background preview" 
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 rounded overflow-hidden bg-muted/60 flex items-center justify-center">
                    <p className="text-muted-foreground">App background preview</p>
                  </div>
                )}
                <div className="text-sm text-muted-foreground text-center mt-2">
                  <p>Recommended size: 1920x1080px</p>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={() => simulateImageUpload('appBackground')}
                >
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-2">App Background Preview</h3>
              <div 
                className="w-full h-48 rounded-md overflow-hidden border relative"
                style={{
                  backgroundImage: imageStates.appBackground ? `url(${imageStates.appBackground})` : 'none',
                  backgroundColor: !imageStates.appBackground ? '#f1f5f9' : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0">
                  <div className="absolute top-4 left-4 right-4 h-8 bg-slate-800/70 backdrop-blur-sm rounded flex items-center px-4">
                    <div className="w-4 h-4 rounded-full bg-primary mr-2"></div>
                    <div className="h-4 w-32 bg-white/20 rounded"></div>
                    <div className="ml-auto flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/20"></div>
                      <div className="w-6 h-6 rounded-full bg-white/20"></div>
                    </div>
                  </div>
                  <div className="absolute top-16 left-4 bottom-4 w-40 bg-slate-800/70 backdrop-blur-sm rounded"></div>
                  <div className="absolute top-16 left-48 right-4 bottom-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded p-4">
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSaveSettings('theme')}>Save Background Images</Button>
      </CardFooter>
    </Card>
  );
};

export default BackgroundImagesSection;
