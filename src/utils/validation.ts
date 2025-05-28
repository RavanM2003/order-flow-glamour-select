
import { useLanguage } from '@/context/LanguageContext';

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

export function getCurrentDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function isWithinWorkingHours(time: string, startTime: string, endTime: string): boolean {
  if (!time || !startTime || !endTime) return false;
  
  const timeMinutes = convertTimeToMinutes(time);
  const startMinutes = convertTimeToMinutes(startTime);
  const endMinutes = convertTimeToMinutes(endTime);
  
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
}

function convertTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}min`;
  }
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
}

export function formatDurationMultiLanguage(minutes: number, t: any): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  // Get current language from context or default to 'en'
  const currentLang = t('booking.language') || 'en';
  
  if (hours === 0) {
    switch (currentLang) {
      case 'az':
        return `${remainingMinutes}d`;
      case 'ru':
        return `${remainingMinutes}м`;
      default:
        return `${remainingMinutes}m`;
    }
  }
  
  if (remainingMinutes === 0) {
    switch (currentLang) {
      case 'az':
        return `${hours}s`;
      case 'ru':
        return `${hours}ч`;
      default:
        return `${hours}h`;
    }
  }
  
  switch (currentLang) {
    case 'az':
      return `${hours}s ${remainingMinutes}d`;
    case 'ru':
      return `${hours}ч ${remainingMinutes}м`;
    default:
      return `${hours}h ${remainingMinutes}m`;
  }
}

export function validateBookingData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.customer?.name) {
    errors.push('Customer name is required');
  }
  
  if (!data.customer?.email || !validateEmail(data.customer.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.customer?.phone || !validatePhone(data.customer.phone)) {
    errors.push('Valid phone number is required');
  }
  
  if (!data.appointmentDate) {
    errors.push('Appointment date is required');
  }
  
  if (!data.appointmentTime) {
    errors.push('Appointment time is required');
  }
  
  if (!data.selectedServices?.length && !data.selectedProducts?.length) {
    errors.push('At least one service or product must be selected');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function canCancelAppointment(appointmentDateTime: Date): boolean {
  const now = new Date();
  const timeDifference = appointmentDateTime.getTime() - now.getTime();
  const hoursUntilAppointment = timeDifference / (1000 * 60 * 60);
  
  return hoursUntilAppointment >= 2;
}
