
export const formatDuration = (minutes: number, t: (key: string) => string): string => {
  if (minutes < 60) {
    return `${minutes} ${t('time.minutes')}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ${t('time.hours')}`;
  }
  
  return `${hours} ${t('time.hours')} ${remainingMinutes} ${t('time.minutes')}`;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const isWorkingHours = (time: string): boolean => {
  const [hours] = time.split(':').map(Number);
  return hours >= 9 && hours <= 18; // 9:00 - 18:00 iş saatları
};
