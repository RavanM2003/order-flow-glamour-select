
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getCurrentDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const isWithinWorkingHours = (time: string, startTime: string, endTime: string): boolean => {
  if (!time || !startTime || !endTime) return false;
  
  const timeMinutes = convertTimeToMinutes(time);
  const startMinutes = convertTimeToMinutes(startTime);
  const endMinutes = convertTimeToMinutes(endTime);
  
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
};

export const isValidBookingDate = (date: Date | string): boolean => {
  const selectedDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  return selectedDate >= today;
};

export const formatDurationMultiLanguage = (minutes: number, t: (key: string) => string): string => {
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

const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
