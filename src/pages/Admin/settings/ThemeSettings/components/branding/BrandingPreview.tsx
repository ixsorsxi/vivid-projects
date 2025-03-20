
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface BrandingPreviewProps {
  platformTitle: string;
  webLink: string;
  slogan: string;
  logoUrl: string | null;
  faviconUrl: string | null;
}

const BrandingPreview: React.FC<BrandingPreviewProps> = ({
  platformTitle,
  webLink,
  slogan,
  logoUrl,
  faviconUrl
}) => {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border overflow-hidden">
        <div 
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: '#27364B', color: 'white' }}
        >
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
            ) : (
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
                </svg>
              </div>
            )}
            <div>
              <div className="font-semibold">{platformTitle || 'Platform Name'}</div>
              <div className="text-xs opacity-75">{slogan || 'Your platform slogan'}</div>
            </div>
          </div>
        </div>
        <div className="p-4 text-sm">
          <div className="flex items-center gap-1 text-blue-500 mb-2">
            <ExternalLink size={14} />
            <a href={webLink} target="_blank" rel="noopener noreferrer">
              {webLink || 'https://your-app-link.com'}
            </a>
          </div>
          
          <div className="rounded-md p-4 bg-muted/40 flex flex-col items-center justify-center text-center space-y-2">
            <div className="flex flex-col items-center">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-16 h-16 object-contain mb-2" />
              ) : (
                <div className="w-16 h-16 rounded-md bg-primary flex items-center justify-center mb-2">
                  <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
                  </svg>
                </div>
              )}
              <h3 className="font-bold text-lg">{platformTitle || 'Platform Name'}</h3>
              <p className="text-muted-foreground">{slogan || 'Your platform slogan'}</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                Login
              </span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                Register
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h3 className="font-medium mb-1">Browser tab appearance</h3>
          <div className="h-8 rounded-t-md bg-slate-200 dark:bg-slate-800 px-3 flex items-center gap-2">
            {faviconUrl ? (
              <img src={faviconUrl} alt="Favicon" className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="currentColor" />
                </svg>
              </div>
            )}
            <span className="text-xs truncate">
              {platformTitle || 'Platform Name'}
            </span>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium mb-1">Application header</h3>
          <div className="h-12 bg-slate-800 rounded-md px-3 flex items-center text-white gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-6 h-6" />
            ) : (
              <div className="w-6 h-6">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0L14.9282 4V12L8 16L1.07179 12V4L8 0Z" fill="white" />
                </svg>
              </div>
            )}
            <span className="text-sm truncate">{platformTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingPreview;
