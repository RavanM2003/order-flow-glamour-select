
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
