
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'az' | 'en' | 'ru' | 'uz';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Translations object with all missing keys added
const translations = {
  az: {
    // Navigation
    'nav.home': 'Ana səhifə',
    'nav.services': 'Xidmətlər',
    'nav.products': 'Məhsullar',
    'nav.about': 'Haqqımızda',
    'nav.contact': 'Əlaqə',
    'nav.bookNow': 'Rezerv et',
    
    // Home
    'home.title': 'Glamour Studio-ya xoş gəlmisiniz',
    'home.subtitle': 'Sizin gözəlliyiniz, bizim missiyamız',
    'home.makeAppointment': 'Təyinat rezerv et',
    'home.viewServices': 'Xidmətlərə bax',
    'home.services': 'Xidmətlərimiz',
    'home.products': 'Məhsullarımız',
    'home.viewDetails': 'Ətraflı bax',
    'home.viewAllProducts': 'Bütün məhsullara bax',
    'home.viewAllServices': 'Bütün xidmətlərə bax',
    
    // Admin
    'admin.login': 'İdarəçi girişi',
    
    // Common
    'common.discount': 'ENDİRİM',
    'common.viewDetails': 'Ətraflı bax',
    'common.viewAll': 'Hamısına bax',
    'common.search': 'Axtar...',
    'common.loadMore': 'Daha çox',
    'common.noData': 'Məlumat tapılmadı',
    
    // Services
    'services.title': 'Xidmətlərimiz',
    'services.description': 'Peşəkar komandamızla keyfiyyətli gözəllik xidmətləri',
    'services.search': 'Xidmətləri axtar...',
    'services.duration': 'Müddət',
    'services.minutes': 'dəqiqə',
    'services.benefits': 'Faydalar',
    'services.viewDetails': 'Ətraflı bax',
    'services.loadMore': 'Daha çox',
    'services.cta': 'Rezervasiya et',
    'services.bookNow': 'İndi rezerv et',
    'services.noDescription': 'Təsvir mövcud deyil',
    'services.noServicesAdded': 'Hələ heç bir xidmət əlavə edilməyib',
    'services.viewServicesPage': 'Xidmətlər səhifəsinə bax',
    'services.viewAllServices': 'Bütün xidmətlərə bax',
    
    // Products
    'products.title': 'Məhsullarımız',
    'products.description': 'Keyfiyyətli gözəllik məhsulları',
    'products.search': 'Məhsulları axtar...',
    'products.cta': 'Sifariş ver',
    'products.viewDetails': 'Ətraflı bax',
    'products.bookNow': 'Sifariş ver',
    'products.noDescription': 'Təsvir mövcud deyil',
    'products.noProductsAdded': 'Hələ heç bir məhsul əlavə edilməyib',
    'products.viewProductsPage': 'Məhsullar səhifəsinə bax',
    
    // Contact
    'contact.name': 'Ad',
    'contact.namePlaceholder': 'Adınızı daxil edin',
    'contact.email': 'E-poçt',
    'contact.emailPlaceholder': 'E-poçt ünvanınızı daxil edin',
    'contact.phone': 'Telefon',
    'contact.phonePlaceholder': 'Telefon nömrənizi daxil edin',
    'contact.subject': 'Mövzu',
    'contact.subjectPlaceholder': 'Mövzunu daxil edin',
    'contact.message': 'Mesaj',
    'contact.messagePlaceholder': 'Mesajınızı daxil edin',
    'contact.send': 'Göndər',
    'contact.address': 'Ünvan',
    'contact.phoneNumber': 'Telefon nömrəsi',
    'contact.emailAddress': 'E-poçt ünvanı',
    'contact.workingHours': 'İş saatları',
    
    // Booking
    'booking.title': 'Təyinat Rezervasiyası',
    'booking.customerInfo': 'Müştəri məlumatları',
    'booking.services': 'Xidmətlər',
    'booking.products': 'Məhsullar',
    'booking.payment': 'Ödəniş',
    'booking.confirmation': 'Təsdiq',
    'booking.gender': 'Cins',
    'booking.male': 'Kişi',
    'booking.female': 'Qadın',
    'booking.fullName': 'Tam ad',
    'booking.fullNamePlaceholder': 'Məsələn: Əli Məmmədov',
    'booking.fullNameValidation': 'Tam ad 10-100 simvol arasında olmalıdır',
    'booking.genderRequired': 'Cins seçilməlidir',
    'booking.email': 'E-poçt',
    'booking.emailPlaceholder': 'məsələn@example.com',
    'booking.emailValidation': 'Düzgün e-poçt ünvanı daxil edin',
    'booking.phone': 'Telefon',
    'booking.phonePlaceholder': '+994 XX XXX XX XX',
    'booking.phoneRequired': 'Telefon nömrəsi tələb olunur',
    'booking.notes': 'Qeydlər',
    'booking.notesPlaceholder': 'Əlavə qeydlərinizi daxil edin',
    'booking.date': 'Tarix',
    'booking.dateRequired': 'Tarix seçilməlidir',
    'booking.time': 'Vaxt',
    'booking.timeRequired': 'Vaxt seçilməlidir',
    'booking.availableForNextDays': 'Növbəti',
    'booking.days': 'gün ərzində mövcuddur',
    'booking.workingHours': 'İş saatları',
    'booking.next': 'Növbəti',
    'booking.previous': 'Əvvəlki',
    'booking.searchServices': 'Xidmətləri axtar...',
    'booking.minutes': 'dəqiqə',
    'booking.moreInfo': 'Ətraflı məlumat',
    'booking.noDescription': 'Təsvir mövcud deyil',
    'booking.selectStaff': 'İşçi seçin',
    'booking.chooseStaff': 'İşçi seçin',
    'booking.noServices': 'Xidmət tapılmadı',
    'booking.selectedServices': 'Seçilmiş xidmətlər',
    'booking.servicesTotal': 'Xidmətlər cəmi',
    'booking.totalDuration': 'Ümumi müddət',
    'booking.duration': 'Müddət',
    'booking.endTime': 'Bitmə vaxtı',
    'booking.servicesRequired': 'Ən azı bir xidmət seçilməlidir',
    'booking.staffRequired': 'Bütün xidmətlər üçün işçi seçilməlidir',
    'booking.loadMore': 'Daha çox',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.products': 'Products',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.bookNow': 'Book Now',
    
    // Home
    'home.title': 'Welcome to Glamour Studio',
    'home.subtitle': 'Your beauty, our mission',
    'home.makeAppointment': 'Make Appointment',
    'home.viewServices': 'View Services',
    'home.services': 'Our Services',
    'home.products': 'Our Products',
    'home.viewDetails': 'View Details',
    'home.viewAllProducts': 'View All Products',
    'home.viewAllServices': 'View All Services',
    
    // Admin
    'admin.login': 'Admin Login',
    
    // Common
    'common.discount': 'DISCOUNT',
    'common.viewDetails': 'View Details',
    'common.viewAll': 'View All',
    'common.search': 'Search...',
    'common.loadMore': 'Load More',
    'common.noData': 'No data found',
    
    // Services
    'services.title': 'Our Services',
    'services.description': 'Professional beauty services with our expert team',
    'services.search': 'Search services...',
    'services.duration': 'Duration',
    'services.minutes': 'minutes',
    'services.benefits': 'Benefits',
    'services.viewDetails': 'View Details',
    'services.loadMore': 'Load More',
    'services.cta': 'Book Now',
    'services.bookNow': 'Book Now',
    'services.noDescription': 'No description available',
    'services.noServicesAdded': 'No services have been added yet',
    'services.viewServicesPage': 'View Services Page',
    'services.viewAllServices': 'View All Services',
    
    // Products
    'products.title': 'Our Products',
    'products.description': 'Quality beauty products',
    'products.search': 'Search products...',
    'products.cta': 'Order Now',
    'products.viewDetails': 'View Details',
    'products.bookNow': 'Order Now',
    'products.noDescription': 'No description available',
    'products.noProductsAdded': 'No products have been added yet',
    'products.viewProductsPage': 'View Products Page',
    
    // Contact
    'contact.name': 'Name',
    'contact.namePlaceholder': 'Enter your name',
    'contact.email': 'Email',
    'contact.emailPlaceholder': 'Enter your email address',
    'contact.phone': 'Phone',
    'contact.phonePlaceholder': 'Enter your phone number',
    'contact.subject': 'Subject',
    'contact.subjectPlaceholder': 'Enter subject',
    'contact.message': 'Message',
    'contact.messagePlaceholder': 'Enter your message',
    'contact.send': 'Send',
    'contact.address': 'Address',
    'contact.phoneNumber': 'Phone Number',
    'contact.emailAddress': 'Email Address',
    'contact.workingHours': 'Working Hours',
    
    // Booking
    'booking.title': 'Appointment Booking',
    'booking.customerInfo': 'Customer Information',
    'booking.services': 'Services',
    'booking.products': 'Products',
    'booking.payment': 'Payment',
    'booking.confirmation': 'Confirmation',
    'booking.gender': 'Gender',
    'booking.male': 'Male',
    'booking.female': 'Female',
    'booking.fullName': 'Full Name',
    'booking.fullNamePlaceholder': 'e.g. John Smith',
    'booking.fullNameValidation': 'Full name must be between 10-100 characters',
    'booking.genderRequired': 'Gender must be selected',
    'booking.email': 'Email',
    'booking.emailPlaceholder': 'example@example.com',
    'booking.emailValidation': 'Please enter a valid email address',
    'booking.phone': 'Phone',
    'booking.phonePlaceholder': '+1 XXX XXX XXXX',
    'booking.phoneRequired': 'Phone number is required',
    'booking.notes': 'Notes',
    'booking.notesPlaceholder': 'Enter additional notes',
    'booking.date': 'Date',
    'booking.dateRequired': 'Date must be selected',
    'booking.time': 'Time',
    'booking.timeRequired': 'Time must be selected',
    'booking.availableForNextDays': 'Available for next',
    'booking.days': 'days',
    'booking.workingHours': 'Working Hours',
    'booking.next': 'Next',
    'booking.previous': 'Previous',
    'booking.searchServices': 'Search services...',
    'booking.minutes': 'minutes',
    'booking.moreInfo': 'More Info',
    'booking.noDescription': 'No description available',
    'booking.selectStaff': 'Select Staff',
    'booking.chooseStaff': 'Choose Staff',
    'booking.noServices': 'No services found',
    'booking.selectedServices': 'Selected Services',
    'booking.servicesTotal': 'Services Total',
    'booking.totalDuration': 'Total Duration',
    'booking.duration': 'Duration',
    'booking.endTime': 'End Time',
    'booking.servicesRequired': 'At least one service must be selected',
    'booking.staffRequired': 'Staff must be selected for all services',
    'booking.loadMore': 'Load More',
  },
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.services': 'Услуги',
    'nav.products': 'Продукты',
    'nav.about': 'О нас',
    'nav.contact': 'Контакты',
    'nav.bookNow': 'Записаться',
    
    // Home
    'home.title': 'Добро пожаловать в Glamour Studio',
    'home.subtitle': 'Ваша красота, наша миссия',
    'home.makeAppointment': 'Записаться',
    'home.viewServices': 'Услуги',
    'home.services': 'Наши услуги',
    'home.products': 'Наши продукты',
    'home.viewDetails': 'Подробнее',
    'home.viewAllProducts': 'Все продукты',
    'home.viewAllServices': 'Все услуги',
    
    // Admin
    'admin.login': 'Вход администратора',
    
    // Common
    'common.discount': 'СКИДКА',
    'common.viewDetails': 'Подробнее',
    'common.viewAll': 'Смотреть все',
    'common.search': 'Поиск...',
    'common.loadMore': 'Загрузить еще',
    'common.noData': 'Данные не найдены',
    
    // Services
    'services.title': 'Наши услуги',
    'services.description': 'Профессиональные косметические услуги',
    'services.search': 'Поиск услуг...',
    'services.duration': 'Продолжительность',
    'services.minutes': 'минут',
    'services.benefits': 'Преимущества',
    'services.viewDetails': 'Подробнее',
    'services.loadMore': 'Загрузить еще',
    'services.cta': 'Забронировать',
    'services.bookNow': 'Забронировать',
    'services.noDescription': 'Описание недоступно',
    'services.noServicesAdded': 'Услуги еще не добавлены',
    'services.viewServicesPage': 'Страница услуг',
    'services.viewAllServices': 'Все услуги',
    
    // Products
    'products.title': 'Наши продукты',
    'products.description': 'Качественные косметические продукты',
    'products.search': 'Поиск продуктов...',
    'products.cta': 'Заказать',
    'products.viewDetails': 'Подробнее',
    'products.bookNow': 'Заказать',
    'products.noDescription': 'Описание недоступно',
    'products.noProductsAdded': 'Продукты еще не добавлены',
    'products.viewProductsPage': 'Страница продуктов',
    
    // Contact
    'contact.name': 'Имя',
    'contact.namePlaceholder': 'Введите ваше имя',
    'contact.email': 'Email',
    'contact.emailPlaceholder': 'Введите email адрес',
    'contact.phone': 'Телефон',
    'contact.phonePlaceholder': 'Введите номер телефона',
    'contact.subject': 'Тема',
    'contact.subjectPlaceholder': 'Введите тему',
    'contact.message': 'Сообщение',
    'contact.messagePlaceholder': 'Введите сообщение',
    'contact.send': 'Отправить',
    'contact.address': 'Адрес',
    'contact.phoneNumber': 'Номер телефона',
    'contact.emailAddress': 'Email адрес',
    'contact.workingHours': 'Рабочие часы',
    
    // Booking
    'booking.title': 'Запись на прием',
    'booking.customerInfo': 'Информация о клиенте',
    'booking.services': 'Услуги',
    'booking.products': 'Продукты',
    'booking.payment': 'Оплата',
    'booking.confirmation': 'Подтверждение',
    'booking.gender': 'Пол',
    'booking.male': 'Мужской',
    'booking.female': 'Женский',
    'booking.fullName': 'Полное имя',
    'booking.fullNamePlaceholder': 'например: Иван Петров',
    'booking.fullNameValidation': 'Полное имя должно быть от 10 до 100 символов',
    'booking.genderRequired': 'Необходимо выбрать пол',
    'booking.email': 'Email',
    'booking.emailPlaceholder': 'example@example.com',
    'booking.emailValidation': 'Введите корректный email адрес',
    'booking.phone': 'Телефон',
    'booking.phonePlaceholder': '+7 XXX XXX XX XX',
    'booking.phoneRequired': 'Номер телефона обязателен',
    'booking.notes': 'Заметки',
    'booking.notesPlaceholder': 'Введите дополнительные заметки',
    'booking.date': 'Дата',
    'booking.dateRequired': 'Дата должна быть выбрана',
    'booking.time': 'Время',
    'booking.timeRequired': 'Время должно быть выбрано',
    'booking.availableForNextDays': 'Доступно на следующие',
    'booking.days': 'дней',
    'booking.workingHours': 'Рабочие часы',
    'booking.next': 'Далее',
    'booking.previous': 'Назад',
    'booking.searchServices': 'Поиск услуг...',
    'booking.minutes': 'минут',
    'booking.moreInfo': 'Подробнее',
    'booking.noDescription': 'Описание недоступно',
    'booking.selectStaff': 'Выберите сотрудника',
    'booking.chooseStaff': 'Выберите сотрудника',
    'booking.noServices': 'Услуги не найдены',
    'booking.selectedServices': 'Выбранные услуги',
    'booking.servicesTotal': 'Итого услуги',
    'booking.totalDuration': 'Общая продолжительность',
    'booking.duration': 'Продолжительность',
    'booking.endTime': 'Время окончания',
    'booking.servicesRequired': 'Необходимо выбрать хотя бы одну услугу',
    'booking.staffRequired': 'Необходимо выбрать сотрудника для всех услуг',
    'booking.loadMore': 'Загрузить еще',
  },
  uz: {
    // Navigation
    'nav.home': 'Bosh sahifa',
    'nav.services': 'Xizmatlar',
    'nav.products': 'Mahsulotlar',
    'nav.about': 'Biz haqimizda',
    'nav.contact': 'Aloqa',
    'nav.bookNow': 'Buyurtma berish',
    
    // Home
    'home.title': 'Glamour Studio-ga xush kelibsiz',
    'home.subtitle': 'Sizning go\'zalligingiz, bizning vazifamiz',
    'home.makeAppointment': 'Uchrashuv belgilash',
    'home.viewServices': 'Xizmatlarni ko\'rish',
    'home.services': 'Bizning xizmatlarimiz',
    'home.products': 'Bizning mahsulotlarimiz',
    'home.viewDetails': 'Batafsil',
    'home.viewAllProducts': 'Barcha mahsulotlar',
    'home.viewAllServices': 'Barcha xizmatlar',
    
    // Admin
    'admin.login': 'Administrator kirishi',
    
    // Common
    'common.discount': 'CHEGIRMA',
    'common.viewDetails': 'Batafsil',
    'common.viewAll': 'Barchasini ko\'rish',
    'common.search': 'Qidirish...',
    'common.loadMore': 'Ko\'proq yuklash',
    'common.noData': 'Ma\'lumot topilmadi',
    
    // Services and other keys continue with Uzbek translations...
    'services.title': 'Bizning xizmatlarimiz',
    'services.description': 'Professional go\'zallik xizmatlari',
    'services.search': 'Xizmatlarni qidirish...',
    'services.duration': 'Davomiyligi',
    'services.minutes': 'daqiqa',
    'services.benefits': 'Foydalari',
    'services.viewDetails': 'Batafsil',
    'services.loadMore': 'Ko\'proq yuklash',
    'services.cta': 'Buyurtma berish',
    'services.bookNow': 'Buyurtma berish',
    'services.noDescription': 'Tavsif mavjud emas',
    'services.noServicesAdded': 'Xizmatlar hali qo\'shilmagan',
    'services.viewServicesPage': 'Xizmatlar sahifasi',
    'services.viewAllServices': 'Barcha xizmatlar',
    
    // Additional translations for booking and other sections
    'booking.title': 'Rezervatsiya',
    'booking.customerInfo': 'Mijoz ma\'lumotlari',
    'booking.services': 'Xizmatlar',
    'booking.products': 'Mahsulotlar',
    'booking.payment': 'To\'lov',
    'booking.confirmation': 'Tasdiqlash',
    'booking.selectStaff': 'Xodimni tanlang',
    'booking.loadMore': 'Ko\'proq yuklash',
    'booking.minutes': 'daqiqa',
    'booking.next': 'Keyingi',
    'booking.previous': 'Oldingi',
    'booking.servicesRequired': 'Kamida bitta xizmat tanlanishi kerak',
    'booking.staffRequired': 'Barcha xizmatlar uchun xodim tanlanishi kerak',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('az');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['az', 'en', 'ru', 'uz'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key} for language: ${language}`);
        return key; // Return key if translation not found
      }
    }
    
    // If translation not found, try fallback to English
    if (!value && language !== 'en') {
      let fallback: any = translations.en;
      for (const k of keys) {
        if (fallback && typeof fallback === 'object') {
          fallback = fallback[k];
        } else {
          break;
        }
      }
      if (fallback) {
        console.warn(`Using English fallback for key: ${key}`);
        return fallback;
      }
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
