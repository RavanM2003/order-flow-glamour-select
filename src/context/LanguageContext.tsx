
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available languages
export type Language = 'az' | 'ru' | 'en' | 'uz';

// Define the context type
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define translations for each language
const translations: Record<Language, Record<string, string>> = {
  az: {
    // Navigation
    'nav.home': 'Ana səhifə',
    'nav.services': 'Xidmətlər',
    'nav.products': 'Məhsullar',
    'nav.about': 'Haqqımızda',
    'nav.contact': 'Əlaqə',
    'nav.bookNow': 'İndi rezervasiya et',
    
    // Common
    'common.loading': 'Yüklənir...',
    'common.error': 'Xəta baş verdi',
    'common.save': 'Yadda saxla',
    'common.cancel': 'Ləğv et',
    'common.submit': 'Təsdiq et',
    'common.view': 'Bax',
    'common.viewAll': 'Hamısına bax',
    'common.status': 'Status',
    'common.date': 'Tarix',
    'common.time': 'Vaxt',

    // Home
    'home.title': 'Gözəllik salonunuz üçün mükəmməl idarəetmə həlli',
    'home.subtitle': 'Müştərilər, təyinatlar və inventarınızı vahid platformada asanlıqla idarə edin.',
    'home.makeAppointment': 'Təyinat edin',
    'home.viewServices': 'Xidmətlərə baxın',
    'home.platform': 'Bizim platforma üstünlükləri',
    'home.services': 'Xidmətlər',
    'home.products': 'Məhsullar',

    // Booking
    'booking.title': 'Təyinat rezervasiyası',
    'booking.customerInfo': 'Müştəri məlumatı',
    'booking.services': 'Xidmət və məhsullar',
    'booking.payment': 'Ödəniş',
    'booking.confirmation': 'Təsdiq',
    'booking.total': 'Ümumi',
    'booking.bookingDetails': 'Rezervasiya detalları',
    'booking.name': 'Ad',
    'booking.email': 'E-poçt',
    'booking.phone': 'Telefon',
    'booking.gender': 'Cins',
    'booking.notes': 'Qeydlər',
    'booking.inTime': 'Giriş vaxtı',
    'booking.outTime': 'Çıxış vaxtı',
    'booking.paymentMethod': 'Ödəniş üsulu',
    'booking.cash': 'Nağd',
    'booking.card': 'Kart',
    'booking.status': 'Status',
    'booking.cancel': 'Sifarişi ləğv et',
    'booking.canceled': 'Sifariş artıq ləğv edilib',
    'booking.successCancel': 'Sifariş uğurla ləğv edildi.',

    // Admin
    'admin.dashboard': 'İdarəetmə paneli',
    'admin.customers': 'Müştərilər',
    'admin.services': 'Xidmətlər',
    'admin.products': 'Məhsullar',
    'admin.appointments': 'Təyinatlar',
    'admin.staff': 'İşçilər',
    'admin.settings': 'Tənzimləmələr',
    'admin.login': 'Admin panelə daxil ol',
    'admin.backToSite': 'Sayta qayıt',
    'admin.profile': 'Profil',
  },
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.services': 'Услуги',
    'nav.products': 'Продукты',
    'nav.about': 'О нас',
    'nav.contact': 'Контакты',
    'nav.bookNow': 'Записаться',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Произошла ошибка',
    'common.save': 'Сохранить',
    'common.cancel': 'Отменить',
    'common.submit': 'Подтвердить',
    'common.view': 'Посмотреть',
    'common.viewAll': 'Смотреть все',
    'common.status': 'Статус',
    'common.date': 'Дата',
    'common.time': 'Время',

    // Home
    'home.title': 'Идеальное решение для управления вашим салоном красоты',
    'home.subtitle': 'Легко управляйте клиентами, записями и инвентарем на единой платформе.',
    'home.makeAppointment': 'Записаться',
    'home.viewServices': 'Посмотреть услуги',
    'home.platform': 'Преимущества нашей платформы',
    'home.services': 'Услуги',
    'home.products': 'Продукты',

    // Booking
    'booking.title': 'Запись на прием',
    'booking.customerInfo': 'Информация о клиенте',
    'booking.services': 'Услуги и продукты',
    'booking.payment': 'Оплата',
    'booking.confirmation': 'Подтверждение',
    'booking.total': 'Итого',
    'booking.bookingDetails': 'Детали записи',
    'booking.name': 'Имя',
    'booking.email': 'Эл. почта',
    'booking.phone': 'Телефон',
    'booking.gender': 'Пол',
    'booking.notes': 'Примечания',
    'booking.inTime': 'Время начала',
    'booking.outTime': 'Время окончания',
    'booking.paymentMethod': 'Способ оплаты',
    'booking.cash': 'Наличные',
    'booking.card': 'Карта',
    'booking.status': 'Статус',
    'booking.cancel': 'Отменить заказ',
    'booking.canceled': 'Заказ уже отменен',
    'booking.successCancel': 'Заказ успешно отменен.',

    // Admin
    'admin.dashboard': 'Панель управления',
    'admin.customers': 'Клиенты',
    'admin.services': 'Услуги',
    'admin.products': 'Продукты',
    'admin.appointments': 'Записи',
    'admin.staff': 'Персонал',
    'admin.settings': 'Настройки',
    'admin.login': 'Войти в админ панель',
    'admin.backToSite': 'Вернуться на сайт',
    'admin.profile': 'Профиль',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.products': 'Products',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.bookNow': 'Book Now',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.view': 'View',
    'common.viewAll': 'View All',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.time': 'Time',

    // Home
    'home.title': 'Perfect management solution for your beauty salon',
    'home.subtitle': 'Easily manage customers, appointments, and inventory in a single platform.',
    'home.makeAppointment': 'Make Appointment',
    'home.viewServices': 'View Services',
    'home.platform': 'Our Platform Benefits',
    'home.services': 'Services',
    'home.products': 'Products',

    // Booking
    'booking.title': 'Book Your Appointment',
    'booking.customerInfo': 'Customer Info',
    'booking.services': 'Services & Products',
    'booking.payment': 'Payment',
    'booking.confirmation': 'Confirmation',
    'booking.total': 'Total',
    'booking.bookingDetails': 'Booking Details',
    'booking.name': 'Name',
    'booking.email': 'Email',
    'booking.phone': 'Phone',
    'booking.gender': 'Gender',
    'booking.notes': 'Notes',
    'booking.inTime': 'In time',
    'booking.outTime': 'Out time',
    'booking.paymentMethod': 'Payment Method',
    'booking.cash': 'Cash',
    'booking.card': 'Card',
    'booking.status': 'Status',
    'booking.cancel': 'Cancel Order',
    'booking.canceled': 'Order already canceled',
    'booking.successCancel': 'Order successfully canceled.',

    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.customers': 'Customers',
    'admin.services': 'Services',
    'admin.products': 'Products',
    'admin.appointments': 'Appointments',
    'admin.staff': 'Staff',
    'admin.settings': 'Settings',
    'admin.login': 'Log in to Admin',
    'admin.backToSite': 'Back to Site',
    'admin.profile': 'Profile',
  },
  uz: {
    // Navigation
    'nav.home': 'Asosiy',
    'nav.services': 'Xizmatlar',
    'nav.products': 'Mahsulotlar',
    'nav.about': 'Biz haqimizda',
    'nav.contact': 'Aloqa',
    'nav.bookNow': 'Hozir band qiling',
    
    // Common
    'common.loading': 'Yuklanmoqda...',
    'common.error': 'Xatolik yuz berdi',
    'common.save': 'Saqlash',
    'common.cancel': 'Bekor qilish',
    'common.submit': 'Tasdiqlash',
    'common.view': 'Ko\'rish',
    'common.viewAll': 'Hammasini ko\'rish',
    'common.status': 'Holat',
    'common.date': 'Sana',
    'common.time': 'Vaqt',

    // Home
    'home.title': 'Go\'zallik saloningiz uchun mukammal boshqaruv yechimlari',
    'home.subtitle': 'Mijozlar, tayinlangan vaqt va inventarni bir platformada osongina boshqaring.',
    'home.makeAppointment': 'Tayinlash',
    'home.viewServices': 'Xizmatlarni ko\'rish',
    'home.platform': 'Platformamizning afzalliklari',
    'home.services': 'Xizmatlar',
    'home.products': 'Mahsulotlar',

    // Booking
    'booking.title': 'Tayinlashni band qilish',
    'booking.customerInfo': 'Mijoz ma\'lumotlari',
    'booking.services': 'Xizmatlar va mahsulotlar',
    'booking.payment': 'To\'lov',
    'booking.confirmation': 'Tasdiqlash',
    'booking.total': 'Jami',
    'booking.bookingDetails': 'Buyurtma tafsilotlari',
    'booking.name': 'Ism',
    'booking.email': 'Elektron pochta',
    'booking.phone': 'Telefon',
    'booking.gender': 'Jins',
    'booking.notes': 'Izohlar',
    'booking.inTime': 'Kirish vaqti',
    'booking.outTime': 'Chiqish vaqti',
    'booking.paymentMethod': 'To\'lov usuli',
    'booking.cash': 'Naqd pul',
    'booking.card': 'Karta',
    'booking.status': 'Holat',
    'booking.cancel': 'Buyurtmani bekor qilish',
    'booking.canceled': 'Buyurtma allaqachon bekor qilingan',
    'booking.successCancel': 'Buyurtma muvaffaqiyatli bekor qilindi.',

    // Admin
    'admin.dashboard': 'Boshqaruv paneli',
    'admin.customers': 'Mijozlar',
    'admin.services': 'Xizmatlar',
    'admin.products': 'Mahsulotlar',
    'admin.appointments': 'Tayinlashlar',
    'admin.staff': 'Xodimlar',
    'admin.settings': 'Sozlamalar',
    'admin.login': 'Admin paneliga kirish',
    'admin.backToSite': 'Saytga qaytish',
    'admin.profile': 'Profil',
  }
};

// Create provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get stored language from localStorage or default to 'az'
  const [language, setLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    return storedLanguage ? storedLanguage : 'az';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
