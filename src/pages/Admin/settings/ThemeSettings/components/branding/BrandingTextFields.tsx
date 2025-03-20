
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BrandingTextFieldsProps {
  platformTitle: string;
  webLink: string;
  slogan: string;
  onChange: (field: string, value: string) => void;
}

const BrandingTextFields: React.FC<BrandingTextFieldsProps> = ({
  platformTitle,
  webLink,
  slogan,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="platformTitle">Platform Title</Label>
        <Input 
          id="platformTitle" 
          value={platformTitle} 
          onChange={(e) => onChange('platformTitle', e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          The name of your application as displayed in the interface
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="webLink">Website URL</Label>
        <Input 
          id="webLink" 
          value={webLink} 
          onChange={(e) => onChange('webLink', e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Public website address for your application
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="slogan">Slogan/Tagline</Label>
        <Input 
          id="slogan" 
          value={slogan} 
          onChange={(e) => onChange('slogan', e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          A short phrase describing your product's purpose
        </p>
      </div>
    </div>
  );
};

export default BrandingTextFields;
