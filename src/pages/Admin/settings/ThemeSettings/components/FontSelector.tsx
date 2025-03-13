
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Type } from 'lucide-react';

interface FontSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

// Available fonts
const fontOptions = [
  { value: 'Inter', label: 'Inter (Modern Sans-Serif)' },
  { value: 'Poppins', label: 'Poppins (Clean & Rounded)' },
  { value: 'Roboto', label: 'Roboto (Material Design)' },
  { value: 'Open Sans', label: 'Open Sans (Readable)' },
  { value: 'Montserrat', label: 'Montserrat (Contemporary)' },
  { value: 'Lato', label: 'Lato (Balanced)' },
  { value: 'Raleway', label: 'Raleway (Elegant)' },
  { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro (Versatile)' },
  { value: 'Nunito', label: 'Nunito (Rounded & Modern)' }
];

const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Type className="h-4 w-4 text-primary" />
        <Label htmlFor="fontFamily">Font Family</Label>
      </div>
      <Select 
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger id="fontFamily">
          <SelectValue placeholder="Select font family" />
        </SelectTrigger>
        <SelectContent>
          {fontOptions.map(font => (
            <SelectItem key={font.value} value={font.value}>
              <span style={{ fontFamily: font.value }}>{font.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="p-4 mt-2 bg-muted/30 rounded-md">
        <p className="text-2xl font-bold mb-2" style={{ fontFamily: value || 'inherit' }}>
          Font: {value || 'Default'}
        </p>
        <p className="text-base" style={{ fontFamily: value || 'inherit' }}>
          The quick brown fox jumps over the lazy dog.
        </p>
        <p className="text-sm mt-1" style={{ fontFamily: value || 'inherit' }}>
          ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
        </p>
      </div>
    </div>
  );
};

export default FontSelector;
