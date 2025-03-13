
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  value, 
  onChange, 
  presetColors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#6B7280', '#000000']
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={label.replace(/\s+/g, '')}>{label}</Label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-10 h-10 p-0 border-2" 
              style={{ backgroundColor: value }}
            >
              <span className="sr-only">Pick a color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map(color => (
                <button 
                  key={color}
                  type="button"
                  className={cn(
                    "w-8 h-8 rounded-md border-2 flex items-center justify-center transition-all", 
                    color === value ? "border-primary ring-2 ring-primary/20" : "border-muted hover:border-muted-foreground"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => onChange(color)}
                  aria-label={`Select color ${color}`}
                >
                  {color === value && <Check className="h-3 w-3 text-white drop-shadow-sm" />}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <input 
                type="color" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-8"
              />
            </div>
          </PopoverContent>
        </Popover>
        <Input 
          id={label.replace(/\s+/g, '')} 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
