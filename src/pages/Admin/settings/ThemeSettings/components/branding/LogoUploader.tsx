
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

interface LogoUploaderProps {
  logoUrl: string | null;
  onLogoChange: (url: string | null) => void;
  type: 'logo' | 'favicon';
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ 
  logoUrl, 
  onLogoChange,
  type
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleImageUpload = async () => {
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
          onLogoChange(imageUrl);
          
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

  const removeImage = () => {
    onLogoChange(null);
  };

  return (
    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 bg-muted/40">
      {logoUrl ? (
        <div className="relative">
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute -top-2 -right-2 z-10 h-6 w-6"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
          <img 
            src={logoUrl} 
            alt={`${type === 'logo' ? 'Logo' : 'Favicon'} preview`} 
            className={`${type === 'logo' ? 'w-28 h-28' : 'w-12 h-12'} object-contain rounded-md`}
          />
        </div>
      ) : (
        <div className={`${type === 'logo' ? 'w-20 h-20' : 'w-12 h-12'} rounded overflow-hidden bg-muted flex items-center justify-center`}>
          <svg width={type === 'logo' ? "32" : "16"} height={type === 'logo' ? "32" : "16"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
          </svg>
        </div>
      )}
      <div className="text-sm text-muted-foreground text-center mt-2">
        <p>
          {type === 'logo' 
            ? 'Recommended size: 200x200px (SVG or PNG)' 
            : 'Required size: 32x32px (ICO or PNG)'}
        </p>
      </div>
      <Button 
        variant="outline" 
        className="mt-2" 
        onClick={handleImageUpload}
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
            Upload {type === 'logo' ? 'Logo' : 'Favicon'}
          </>
        )}
      </Button>
    </div>
  );
};

export default LogoUploader;
