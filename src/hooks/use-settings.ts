
import { useQuery } from '@tanstack/react-query';
import { settingsService, Setting } from '@/services/settings.service';
import { useLanguage } from '@/context/LanguageContext';

export const useSettings = () => {
  const { language } = useLanguage();
  
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getAllSettings(),
  });

  const getSetting = (key: string, lang?: string): Setting | null => {
    const targetLang = lang || language;
    return settings?.find(setting => setting.key === key && setting.lang === targetLang) || null;
  };

  const getLocalizedSetting = (key: string, fallbackKey?: string): string => {
    if (!settings) return '';
    return settingsService.getLocalizedValue(settings, key, language, fallbackKey);
  };

  return {
    settings,
    isLoading,
    error,
    getSetting,
    getLocalizedSetting,
  };
};

export const useSettingByKey = (key: string) => {
  const { language } = useLanguage();
  
  const { data: setting, isLoading, error } = useQuery({
    queryKey: ['setting', key, language],
    queryFn: () => settingsService.getSettingByKey(key, language),
  });

  return {
    setting,
    localizedValue: setting?.value || '',
    isLoading,
    error,
  };
};
