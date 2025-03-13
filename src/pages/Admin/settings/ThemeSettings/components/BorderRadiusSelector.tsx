
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Paintbrush } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BorderRadiusSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const BorderRadiusSelector: React.FC<BorderRadiusSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Paintbrush className="h-4 w-4 text-primary" />
        <Label htmlFor="borderRadius">Border Radius</Label>
      </div>
      <Select 
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger id="borderRadius">
          <SelectValue placeholder="Select border radius" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None (0px)</SelectItem>
          <SelectItem value="small">Small (4px)</SelectItem>
          <SelectItem value="medium">Medium (8px)</SelectItem>
          <SelectItem value="large">Large (12px)</SelectItem>
          <SelectItem value="full">Full (9999px)</SelectItem>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-5 gap-2 pt-2">
        {['none', 'small', 'medium', 'large', 'full'].map((rad) => {
          let radiusValue = '0';
          switch (rad) {
            case 'none': radiusValue = '0'; break;
            case 'small': radiusValue = '4px'; break;
            case 'medium': radiusValue = '8px'; break;
            case 'large': radiusValue = '12px'; break;
            case 'full': radiusValue = '9999px'; break;
          }
          return (
            <div
              key={rad}
              className={cn(
                "h-8 bg-primary flex items-center justify-center text-[10px] text-primary-foreground",
                rad === value ? "ring-2 ring-primary/50" : ""
              )}
              style={{ borderRadius: radiusValue }}
            >
              {rad}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BorderRadiusSelector;
