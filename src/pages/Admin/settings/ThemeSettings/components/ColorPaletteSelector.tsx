
import React from 'react';
import { cn } from '@/lib/utils';

interface ColorPalette {
  name: string;
  colors: {
    primaryColor: string;
    backgroundColor: string;
    sidebarColor: string;
    cardColor: string;
  }
}

interface ColorPaletteSelectorProps {
  currentSettings: {
    primaryColor: string;
    backgroundColor: string;
    sidebarColor: string;
    cardColor: string;
  };
  onSelectPalette: (palette: string) => void;
}

// Predefined color palettes
const colorPalettes = {
  modern: {
    primaryColor: '#3B82F6',
    backgroundColor: '#F9FAFB',
    sidebarColor: '#1F2937',
    cardColor: '#FFFFFF'
  },
  pastel: {
    primaryColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
    sidebarColor: '#7C3AED',
    cardColor: '#FFFFFF'
  },
  corporate: {
    primaryColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
    sidebarColor: '#0F172A',
    cardColor: '#FFFFFF'
  },
  dark: {
    primaryColor: '#6B7280',
    backgroundColor: '#1F2937',
    sidebarColor: '#111827',
    cardColor: '#374151'
  },
  vibrant: {
    primaryColor: '#F97316',
    backgroundColor: '#FFFBEB',
    sidebarColor: '#7C2D12',
    cardColor: '#FFFFFF'
  },
  minimal: {
    primaryColor: '#71717A',
    backgroundColor: '#FAFAFA',
    sidebarColor: '#27272A',
    cardColor: '#FFFFFF'
  }
};

const ColorPaletteSelector: React.FC<ColorPaletteSelectorProps> = ({ currentSettings, onSelectPalette }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(colorPalettes).map(([name, palette]) => (
        <div 
          key={name}
          className={cn(
            "rounded-md border cursor-pointer hover:border-primary transition-colors p-4",
            JSON.stringify({primaryColor: currentSettings.primaryColor, backgroundColor: currentSettings.backgroundColor, 
                sidebarColor: currentSettings.sidebarColor, cardColor: currentSettings.cardColor}) === 
                JSON.stringify(palette) ? "border-primary bg-primary/5" : ""
          )}
          onClick={() => onSelectPalette(name)}
        >
          <h3 className="font-medium mb-2 capitalize">{name}</h3>
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: palette.primaryColor }}></div>
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: palette.backgroundColor }}></div>
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: palette.sidebarColor }}></div>
            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: palette.cardColor }}></div>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Primary</span>
              <span>{palette.primaryColor}</span>
            </div>
            <div className="flex justify-between">
              <span>Background</span>
              <span>{palette.backgroundColor}</span>
            </div>
            <div className="flex justify-between">
              <span>Sidebar</span>
              <span>{palette.sidebarColor}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { colorPalettes, ColorPaletteSelector };
