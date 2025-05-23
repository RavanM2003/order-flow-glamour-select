
import { supabase } from "@/integrations/supabase/client";

export interface Setting {
  id: string;
  key: string;
  value: string;
  lang: string;
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

  async getSettingByKey(key: string, lang: string = 'az'): Promise<Setting | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .eq('lang', lang)
      .eq('status', true)
      .single();
    
    if (error) {
      console.error(`Error fetching setting ${key} for ${lang}:`, error);
      return null;
    }
    
    return data;
  }

  getLocalizedValue(settings: Setting[], key: string, language: string = 'az', fallbackKey?: string): string {
    // First try to find the setting for the requested language
    let setting = settings.find(s => s.key === key && s.lang === language);
    
    // If not found, try fallback to 'az'
    if (!setting && language !== 'az') {
      setting = settings.find(s => s.key === key && s.lang === 'az');
    }
    
    // If still not found and fallbackKey is provided, try fallbackKey
    if (!setting && fallbackKey) {
      setting = settings.find(s => s.key === fallbackKey && s.lang === language);
      if (!setting && language !== 'az') {
        setting = settings.find(s => s.key === fallbackKey && s.lang === 'az');
      }
    }
    
    return setting?.value || '';
  }

  async updateSetting(key: string, value: string, lang: string = 'az'): Promise<Setting | null> {
    const { data, error } = await supabase
      .from('settings')
      .update({ value })
      .eq('key', key)
      .eq('lang', lang)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating setting ${key} for ${lang}:`, error);
      throw error;
    }
    
    return data;
  }
}

export const settingsService = new SettingsService();
