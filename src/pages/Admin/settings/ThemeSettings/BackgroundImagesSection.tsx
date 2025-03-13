
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';

interface BackgroundImagesSectionProps {
  handleImageUpload: (type: string) => void;
  handleSaveSettings: (section: string) => void;
}

const BackgroundImagesSection: React.FC<BackgroundImagesSectionProps> = ({ 
  handleImageUpload,
  handleSaveSettings
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Background Images</CardTitle>
        <CardDescription>Configure application background and login images</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Login Page Background</Label>
          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 bg-muted/40">
            <div className="w-full h-32 rounded overflow-hidden bg-muted/60 flex items-center justify-center">
              <p className="text-muted-foreground">Login background preview</p>
            </div>
            <div className="text-sm text-muted-foreground text-center mt-2">
              <p>Recommended size: 1920x1080px</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => handleImageUpload('Login Background')}
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>App Background Image</Label>
          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 bg-muted/40">
            <div className="w-full h-32 rounded overflow-hidden bg-muted/60 flex items-center justify-center">
              <p className="text-muted-foreground">App background preview</p>
            </div>
            <div className="text-sm text-muted-foreground text-center mt-2">
              <p>Recommended size: 1920x1080px</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => handleImageUpload('App Background')}
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSaveSettings('theme')}>Save Background Images</Button>
      </CardFooter>
    </Card>
  );
};

export default BackgroundImagesSection;
