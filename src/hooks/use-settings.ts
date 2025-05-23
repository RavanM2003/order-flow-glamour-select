
import { useQuery } from '@tanstack/react-query';
import { settingsService, Setting } from '@/services/settings.service';
import { useLanguage } from '@/context/LanguageContext';

export const useSettings = () => {
  const { language } = useLanguage();
  
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getAllSettings(),
  });

  const getSetting = (key: string): Setting | null => {
    return settings?.find(setting => setting.key === key) || null;
  };

  const getLocalizedSetting = (key: string, fallbackKey?: string): string => {
    const setting = getSetting(key);
    return settingsService.getLocalizedValue(setting, language, fallbackKey);
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
    queryKey: ['setting', key],
    queryFn: () => settingsService.getSettingByKey(key),
  });

  const localizedValue = setting ? settingsService.getLocalizedValue(setting, language) : '';

  return {
    setting,
    localizedValue,
    isLoading,
    error,
  };
};
