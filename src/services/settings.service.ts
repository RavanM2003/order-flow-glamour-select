
import { supabase } from "@/integrations/supabase/client";

export interface SettingsValue {
  [key: string]: string | any;
}

export interface Setting {
  id: string;
  key: string;
  value: SettingsValue;
  status: boolean;
  created_at: string;
  updated_at: string;
}

class SettingsService {
  async getAllSettings(): Promise<Setting[]> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('status', true);
    
    if (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
    
    return data || [];
  }

  async getSettingByKey(key: string): Promise<Setting | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .eq('status', true)
      .single();
    
    if (error) {
      console.error(`Error fetching setting ${key}:`, error);
      return null;
    }
    
    return data;
  }

  getLocalizedValue(setting: Setting | null, language: string = 'az', fallbackKey?: string): string {
    if (!setting) return '';
    
    // For simple values (like max_booking_days)
    if (setting.value.value !== undefined) {
      return setting.value.value.toString();
    }
    
    // For localized values
    if (setting.value[language]) {
      return setting.value[language];
    }
    
    // Fallback to 'az' if requested language not found
    if (language !== 'az' && setting.value.az) {
      return setting.value.az;
    }
    
    // Fallback to first available language
    const firstKey = Object.keys(setting.value)[0];
    return setting.value[firstKey] || '';
  }

  async updateSetting(key: string, value: SettingsValue): Promise<Setting | null> {
    const { data, error } = await supabase
      .from('settings')
      .update({ value })
      .eq('key', key)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating setting ${key}:`, error);
      throw error;
    }
    
    return data;
  }
}

export const settingsService = new SettingsService();
