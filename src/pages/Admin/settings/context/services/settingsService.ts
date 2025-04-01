
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { SettingsState } from '../types/settings-types';

// Define the shape of a setting item in the database
interface SettingItem {
  id?: string;
  key: string;
  value: string;
}

// Helper to create the settings table if it doesn't exist
const ensureSettingsTable = async (): Promise<boolean> => {
  try {
    // Try a simple select to check if the table exists
    const { error } = await supabase.rpc('create_settings_table_if_not_exists');
    
    if (error) {
      console.error('Error ensuring settings table exists:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Failed to ensure settings table exists:', err);
    
    // Store settings in localStorage as a fallback
    console.log('Falling back to localStorage for settings');
    return false;
  }
};

/**
 * Fetches all settings from the database or localStorage fallback
 */
export const fetchSettings = async (): Promise<Record<string, any>> => {
  try {
    // Check if we have a server-side settings table
    const tableExists = await ensureSettingsTable();
    
    if (tableExists) {
      // Attempt to get settings from server
      const { data, error } = await supabase.rpc('get_all_settings');
      
      if (error) {
        console.error('Error fetching settings:', error);
        // Fall back to localStorage
        return getLocalSettings();
      }
      
      if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        return getLocalSettings();
      }
      
      return data;
    } else {
      // Use localStorage
      return getLocalSettings();
    }
  } catch (error) {
    console.error('Error processing settings:', error);
    return getLocalSettings();
  }
};

/**
 * Saves a setting to the database or localStorage fallback
 */
export const saveSetting = async (section: string, value: any): Promise<boolean> => {
  try {
    const stringifiedValue = JSON.stringify(value);
    
    // Check if we have a server-side settings table
    const tableExists = await ensureSettingsTable();
    
    if (tableExists) {
      // Save to server
      const { error } = await supabase.rpc('save_setting', { 
        p_key: section, 
        p_value: stringifiedValue 
      });
      
      if (error) {
        console.error('Error saving setting to server:', error);
        // Fall back to localStorage
        return saveLocalSetting(section, stringifiedValue);
      }
    } else {
      // Save to localStorage
      return saveLocalSetting(section, stringifiedValue);
    }
    
    return true;
  } catch (error) {
    console.error('Error saving setting:', error);
    toast.error('Failed to save settings');
    
    // Try localStorage as last resort
    return saveLocalSetting(section, JSON.stringify(value));
  }
};

/**
 * Gets a specific setting by key from database or localStorage fallback
 */
export const getSetting = async (key: string): Promise<any | null> => {
  try {
    // Check if we have a server-side settings table
    const tableExists = await ensureSettingsTable();
    
    if (tableExists) {
      // Get from server
      const { data, error } = await supabase.rpc('get_setting', { p_key: key });
      
      if (error || !data) {
        console.error('Error fetching setting from server:', error);
        // Fall back to localStorage
        return getLocalSetting(key);
      }
      
      return data;
    } else {
      // Get from localStorage
      return getLocalSetting(key);
    }
  } catch (error) {
    console.error('Error processing setting:', error);
    return getLocalSetting(key);
  }
};

// Local storage fallback functions
const getLocalSettings = (): Record<string, any> => {
  try {
    const settingsJson = localStorage.getItem('app_settings');
    if (!settingsJson) return {};
    
    return JSON.parse(settingsJson);
  } catch (error) {
    console.error('Error reading settings from localStorage:', error);
    return {};
  }
};

const saveLocalSetting = (key: string, value: string): boolean => {
  try {
    const settings = getLocalSettings();
    settings[key] = JSON.parse(value);
    localStorage.setItem('app_settings', JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving setting to localStorage:', error);
    return false;
  }
};

const getLocalSetting = (key: string): any | null => {
  try {
    const settings = getLocalSettings();
    return settings[key] || null;
  } catch (error) {
    console.error('Error getting setting from localStorage:', error);
    return null;
  }
};
