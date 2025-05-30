
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import { defaultSettings } from '@/pages/Admin/settings/context/defaults/defaultSettings';
import { getSetting } from '@/pages/Admin/settings/context/services/settingsService';

const AuthLayout = () => {
  const auth = useAuth();
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [platformTitle, setPlatformTitle] = useState(defaultSettings.theme.platformTitle);

  useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        // Get theme settings using our service
        const themeSettings = await getSetting('theme');
        
        if (themeSettings) {
          setPlatformTitle(themeSettings.platformTitle || defaultSettings.theme.platformTitle);
          
          // Check if there's a logo URL in the settings
          if (themeSettings.logoUrl) {
            setLogoImage(themeSettings.logoUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching theme settings:', error);
      }
    };

    fetchThemeSettings();
  }, []);

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-muted/40">
      <div className="container flex max-w-[400px] flex-col space-y-2 py-12">
        <div className="flex flex-col items-center space-y-2 text-center mb-6">
          {logoImage ? (
            <img 
              src={logoImage} 
              alt={platformTitle}
              className="h-16 w-auto object-contain" 
            />
          ) : (
            <h1 className="text-3xl font-bold">{platformTitle}</h1>
          )}
        </div>
        <div className="mx-auto w-full space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
