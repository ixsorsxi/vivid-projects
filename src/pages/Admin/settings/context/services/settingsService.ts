
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';
import { SettingsState } from '../types/settings-types';

// Define the shape of a setting item in the database
interface SettingItem {
  id?: string;
  key: string;
  value: string;
}

/**
 * Fetches all settings from the database
 */
export const fetchSettings = async (): Promise<Record<string, any>> => {
  try {
    // Using RPC function to get settings (safer than direct table access)
    const { data, error } = await supabase.rpc('get_settings');
    
    if (error) {
      console.error('Error fetching settings:', error);
      return {};
    }

    if (!data || data.length === 0) return {};

    // Convert array of settings to an object
    const settingsObject: Record<string, any> = {};
    data.forEach((item: SettingItem) => {
      if (item.key && item.value) {
        try {
          settingsObject[item.key] = JSON.parse(item.value);
        } catch (e) {
          settingsObject[item.key] = item.value;
        }
      }
    });
    
    return settingsObject;
  } catch (error) {
    console.error('Error processing settings:', error);
    return {};
  }
};

/**
 * Saves a setting to the database
 */
export const saveSetting = async (section: string, value: any): Promise<boolean> => {
  try {
    const stringifiedValue = JSON.stringify(value);
    
    // Using RPC function to save settings (safer than direct table access)
    const { data, error } = await supabase.rpc('save_setting', { 
      p_key: section,
      p_value: stringifiedValue
    });
    
    if (error) {
      console.error('Error saving setting:', error);
      toast.error('Failed to save settings');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving setting:', error);
    toast.error('Failed to save settings');
    return false;
  }
};

/**
 * Gets a specific setting by key
 */
export const getSetting = async (key: string): Promise<any | null> => {
  try {
    // Using RPC function to get a specific setting
    const { data, error } = await supabase.rpc('get_setting', { p_key: key });
    
    if (error || !data) {
      console.error('Error fetching setting:', error);
      return null;
    }
    
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  } catch (error) {
    console.error('Error processing setting:', error);
    return null;
  }
};
