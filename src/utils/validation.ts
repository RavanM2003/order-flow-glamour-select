import { useLanguage } from '@/context/LanguageContext';

// Duration validation
export const validateDuration = (duration: number): boolean => {
  return duration > 0 && duration <= 480; // Max 8 hours
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (Azerbaijan format)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+994[0-9]{9}$/;
  return phoneRegex.test(phone);
};

// Price validation
export const validatePrice = (price: number): boolean => {
  return price >= 0 && price <= 10000;
};

// Stock validation
export const validateStock = (stock: number): boolean => {
  return stock >= 0 && stock <= 1000;
};

// Format duration with multi-language support
export const formatDurationMultiLanguage = (minutes: number, t: any): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  const lang = t('common.currentLanguage') || 'en';
  
  if (hours === 0) {
    switch (lang) {
      case 'az':
        return `${remainingMinutes} dəqiqə`;
      case 'ru':
        return `${remainingMinutes}м`;
      default:
        return `${remainingMinutes}m`;
    }
  }
  
  if (remainingMinutes === 0) {
    switch (lang) {
      case 'az':
        return `${hours} saat`;
      case 'ru':
        return `${hours}ч`;
      default:
        return `${hours}h`;
    }
  }
  
  switch (lang) {
    case 'az':
      return `${hours} saat ${remainingMinutes} dəqiqə`;
    case 'ru':
      return `${hours}ч ${remainingMinutes}м`;
    default:
      return `${hours}h ${remainingMinutes}m`;
  }
};

// Date validation
export const validateAppointmentDate = (date: Date): boolean => {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);
  
  return date >= today && date <= maxDate;
};

// Time validation
export const validateAppointmentTime = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Discount validation
export const validateDiscount = (discount: number): boolean => {
  return discount >= 0 && discount <= 100;
};

// Get current date in YYYY-MM-DD format
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Check if time is within working hours
export const isWithinWorkingHours = (time: string, startTime: string, endTime: string): boolean => {
  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
};

// Helper function to convert time string to minutes
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
