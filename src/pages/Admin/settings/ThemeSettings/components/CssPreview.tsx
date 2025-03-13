
import React from 'react';

interface CssPreviewProps {
  cssPreview: string;
}

const CssPreview: React.FC<CssPreviewProps> = ({ cssPreview }) => {
  return (
    <div className="border rounded-md p-4 min-h-[200px] relative">
      {cssPreview ? (
        <div className="mb-4">
          <style>{cssPreview}</style>
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
