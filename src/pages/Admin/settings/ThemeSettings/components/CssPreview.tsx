
import React, { useEffect, useRef } from 'react';
import { toast } from '@/components/ui/toast-wrapper';

interface CssPreviewProps {
  cssPreview: string;
}

const CssPreview: React.FC<CssPreviewProps> = ({ cssPreview }) => {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    try {
      // Create style element if it doesn't exist yet
      if (!styleRef.current) {
        styleRef.current = document.createElement('style');
        styleRef.current.id = 'css-preview-style';
        document.head.appendChild(styleRef.current);
      }
      
      // Update the style content
      styleRef.current.textContent = cssPreview;
      
      // Clean up on unmount
      return () => {
        if (styleRef.current) {
          document.head.removeChild(styleRef.current);
          styleRef.current = null;
        }
      };
    } catch (error) {
      toast.error("CSS Preview Error", {
        description: "There was an error applying the CSS preview",
      });
      console.error("CSS Preview Error:", error);
    }
  }, [cssPreview]);

  return (
    <div className="border rounded-md p-4 min-h-[200px] relative">
      {cssPreview ? (
        <div className="mb-4">
          <div className="custom-preview-area space-y-4">
            <div className="example-button bg-primary text-primary-foreground px-4 py-2 rounded">
              Example Button
            </div>
            <div className="example-card p-4 border rounded-md bg-card">
              <h3 className="font-semibold mb-2">Example Card</h3>
              <p className="text-sm">This card shows how your CSS affects card components</p>
            </div>
            <div className="flex gap-2">
              <div className="example-badge px-2 py-1 text-xs rounded-full bg-primary text-primary-foreground">
                Badge 1
              </div>
              <div className="example-badge px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                Badge 2
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>Add some CSS to see a preview</p>
        </div>
      )}
    </div>
  );
};

export default CssPreview;
