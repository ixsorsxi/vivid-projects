
import { SettingsState } from '../types/settings-types';

// Apply theme settings globally
export const applyThemeSettings = (themeSettings: SettingsState['theme']) => {
  // Apply custom CSS
  let styleElement = document.getElementById('custom-theme-styles');
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'custom-theme-styles';
    document.head.appendChild(styleElement);
  }
  
  styleElement.textContent = themeSettings.customCSS || '';
  
  // Apply theme variables
  document.documentElement.style.setProperty('--primary-color', themeSettings.primaryColor);
  document.documentElement.style.setProperty('--background-color', themeSettings.backgroundColor);
  document.documentElement.style.setProperty('--sidebar-color', themeSettings.sidebarColor);
  document.documentElement.style.setProperty('--card-color', themeSettings.cardColor);
  
  // Apply font family
  if (themeSettings.fontFamily) {
    document.documentElement.style.setProperty('--font-family', themeSettings.fontFamily);
  }
  
  // Apply border radius
  let radiusValue = getBorderRadiusValue(themeSettings.borderRadius);
  document.documentElement.style.setProperty('--border-radius', radiusValue);
  
  // Toggle dark mode
  document.documentElement.classList.toggle('dark', themeSettings.darkMode);
  
  // Update favicon if available
  if (themeSettings.faviconUrl) {
    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = themeSettings.faviconUrl;
  }
};

// Helper function to get border radius value
export const getBorderRadiusValue = (borderRadius: string) => {
  switch (borderRadius) {
    case 'none': return '0';
    case 'small': return '0.25rem';
    case 'medium': return '0.5rem';
    case 'large': return '0.75rem';
    case 'full': return '9999px';
    default: return '0.5rem';
  }
};
