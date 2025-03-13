
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CssEditorProps {
  customCSS: string;
  onChange: (css: string) => void;
}

const CssEditor: React.FC<CssEditorProps> = ({ customCSS, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="customCSS">Custom CSS</Label>
      <Textarea 
        id="customCSS" 
        className="font-mono text-sm h-52"
        placeholder=":root { --custom-color: #ff0000; }"
        value={customCSS} 
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-sm text-muted-foreground">
        Enter custom CSS to further customize the application appearance. 
        These styles will be applied globally.
      </p>
    </div>
  );
};

export default CssEditor;
