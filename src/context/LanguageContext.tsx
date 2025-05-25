
import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "./context";

type Language = "az" | "en" | "ru" | "uz";

type TranslationValue = string | { [key: string]: TranslationValue };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Updated translations with corrected formatting
const translations: Record<Language, TranslationValue> = {
  az: {
    // Navigation
    "nav.home": "Ana səhifə",
    "nav.services": "Xidmətlər",
    "nav.products": "Məhsullar",
    "nav.about": "Haqqımızda",
    "nav.contact": "Əlaqə",
    "nav.bookNow": "Rezerv et",

    // Booking
    "booking.title": "Təyinat Rezervasiyası",
    "booking.customerInfo": "Müştəri məlumatları",
    "booking.services": "Xidmətlər",
    "booking.products": "Məhsullar",
    "booking.payment": "Ödəniş",
    "booking.confirmation": "Təsdiq",
    "booking.gender": "Cins",
    "booking.male": "Kişi",
    "booking.female": "Qadın",
    "booking.fullName": "Tam ad",
    "booking.fullNamePlaceholder": "Məsələn: Əli Məmmədov",
    "booking.fullNameValidation": "Tam ad ən azı 10 simvol olmalıdır",
    "booking.genderRequired": "Cins seçilməlidir",
    "booking.email": "E-poçt",
    "booking.emailPlaceholder": "məsələn@example.com",
    "booking.emailValidation": "Düzgün e-poçt ünvanı daxil edin",
    "booking.phone": "Telefon",
    "booking.phonePlaceholder": "+994 XX XXX XX XX",
    "booking.phoneRequired": "Telefon nömrəsi tələb olunur",
    "booking.notes": "Qeydlər",
    "booking.notesPlaceholder": "Əlavə qeydlərinizi daxil edin",
    "booking.date": "Tarix",
    "booking.dateRequired": "Tarix seçilməlidir",
    "booking.time": "Vaxt",
    "booking.timeRequired": "Vaxt seçilməlidir",
    "booking.next": "Növbəti",
    "booking.previous": "Əvvəlki",
    "booking.searchServices": "Xidmətləri axtar...",
    "booking.minutes": "dəqiqə",
    "booking.selectStaff": "İşçi seçin",
    "booking.selectedServices": "Seçilmiş xidmətlər",
    "booking.servicesTotal": "Xidmətlər cəmi",
    "booking.totalDuration": "Ümumi müddət",
    "booking.duration": "Müddət",
    "booking.endTime": "Bitmə vaxtı",
    "booking.servicesRequired": "Ən azı bir xidmət seçilməlidir",
    "booking.staffRequired": "Bütün xidmətlər üçün işçi seçilməlidir",
    "booking.loadMore": "Daha çox",
    "booking.searchProducts": "Məhsulları axtar...",
    "booking.recommendedProducts": "Tövsiyə olunan məhsullar",
    "booking.allProducts": "Bütün məhsullar",
    "booking.selectedProducts": "Seçilmiş məhsullar",
    "booking.cardPayment": "Kartla ödəniş",
    "booking.detailed": "Ətraflı məlumat",
    
    // Time units
    "time.seconds": "saniyə",
    "time.minutes": "dəqiqə",
    "time.hours": "saat",
    "time.days": "gün",

    // Common
    "common.discount": "ENDİRİM",
    "common.search": "Axtar...",
    "common.loadMore": "Daha çox",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services", 
    "nav.products": "Products",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.bookNow": "Book Now",

    // Booking
    "booking.title": "Appointment Booking",
    "booking.customerInfo": "Customer Information",
    "booking.services": "Services",
    "booking.products": "Products", 
    "booking.payment": "Payment",
    "booking.confirmation": "Confirmation",
    "booking.gender": "Gender",
    "booking.male": "Male",
    "booking.female": "Female",
    "booking.fullName": "Full Name",
    "booking.fullNamePlaceholder": "e.g. John Smith",
    "booking.fullNameValidation": "Full name must be at least 10 characters",
    "booking.genderRequired": "Gender must be selected",
    "booking.email": "Email",
    "booking.emailPlaceholder": "example@example.com",
    "booking.emailValidation": "Please enter a valid email address",
    "booking.phone": "Phone",
    "booking.phonePlaceholder": "+1 XXX XXX XXXX",
    "booking.phoneRequired": "Phone number is required",
    "booking.notes": "Notes",
    "booking.notesPlaceholder": "Enter additional notes",
    "booking.date": "Date",
    "booking.dateRequired": "Date must be selected",
    "booking.time": "Time",
    "booking.timeRequired": "Time must be selected",
    "booking.next": "Next",
    "booking.previous": "Previous",
    "booking.searchServices": "Search services...",
    "booking.minutes": "minutes",
    "booking.selectStaff": "Select Staff",
    "booking.selectedServices": "Selected Services",
    "booking.servicesTotal": "Services Total",
    "booking.totalDuration": "Total Duration",
    "booking.duration": "Duration",
    "booking.endTime": "End Time",
    "booking.servicesRequired": "At least one service must be selected",
    "booking.staffRequired": "Staff must be selected for all services",
    "booking.loadMore": "Load More",
    "booking.searchProducts": "Search products...",
    "booking.recommendedProducts": "Recommended Products",
    "booking.allProducts": "All Products",
    "booking.selectedProducts": "Selected Products",
    "booking.cardPayment": "Card Payment",
    "booking.detailed": "Detailed Information",

    // Time units
    "time.seconds": "seconds",
    "time.minutes": "minutes", 
    "time.hours": "hours",
    "time.days": "days",

    // Common
    "common.discount": "DISCOUNT",
    "common.search": "Search...",
    "common.loadMore": "Load More",
  },
  ru: {
    // Navigation
    "nav.home": "Главная",
    "nav.services": "Услуги",
    "nav.products": "Продукты",
    "nav.about": "О нас",
    "nav.contact": "Контакты",
    "nav.bookNow": "Записаться",

    // Booking
    "booking.title": "Запись на прием",
    "booking.customerInfo": "Информация о клиенте",
    "booking.services": "Услуги",
    "booking.products": "Продукты",
    "booking.payment": "Оплата",
    "booking.confirmation": "Подтверждение",
    "booking.gender": "Пол",
    "booking.male": "Мужской",
    "booking.female": "Женский",
    "booking.fullName": "Полное имя",
    "booking.fullNamePlaceholder": "например: Иван Петров",
    "booking.fullNameValidation": "Полное имя должно содержать минимум 10 символов",
    "booking.genderRequired": "Необходимо выбрать пол",
    "booking.email": "Email",
    "booking.emailPlaceholder": "example@example.com",
    "booking.emailValidation": "Введите корректный email адрес",
    "booking.phone": "Телефон",
    "booking.phonePlaceholder": "+7 XXX XXX XX XX",
    "booking.phoneRequired": "Номер телефона обязателен",
    "booking.notes": "Заметки",
    "booking.notesPlaceholder": "Введите дополнительные заметки",
    "booking.date": "Дата",
    "booking.dateRequired": "Дата должна быть выбрана",
    "booking.time": "Время",
    "booking.timeRequired": "Время должно быть выбрано",
    "booking.next": "Далее",
    "booking.previous": "Назад",
    "booking.searchServices": "Поиск услуг...",
    "booking.minutes": "минут",
    "booking.selectStaff": "Выберите сотрудника",
    "booking.selectedServices": "Выбранные услуги",
    "booking.servicesTotal": "Итого услуги",
    "booking.totalDuration": "Общая продолжительность",
    "booking.duration": "Продолжительность",
    "booking.endTime": "Время окончания",
    "booking.servicesRequired": "Необходимо выбрать хотя бы одну услугу",
    "booking.staffRequired": "Необходимо выбрать сотрудника для всех услуг",
    "booking.loadMore": "Загрузить еще",
    "booking.searchProducts": "Поиск продуктов...",
    "booking.recommendedProducts": "Рекомендуемые продукты", 
    "booking.allProducts": "Все продукты",
    "booking.selectedProducts": "Выбранные продукты",
    "booking.cardPayment": "Оплата картой",
    "booking.detailed": "Подробная информация",

    // Time units
    "time.seconds": "секунд",
    "time.minutes": "минут",
    "time.hours": "часов",
    "time.days": "дней",

    // Common
    "common.discount": "СКИДКА",
    "common.search": "Поиск...",
    "common.loadMore": "Загрузить еще",
  },
  uz: {
    // Navigation
    "nav.home": "Bosh sahifa",
    "nav.services": "Xizmatlar",
    "nav.products": "Mahsulotlar",
    "nav.about": "Biz haqimizda",
    "nav.contact": "Aloqa",
    "nav.bookNow": "Buyurtma berish",

    // Booking
    "booking.title": "Rezervatsiya",
    "booking.customerInfo": "Mijoz ma'lumotlari",
    "booking.services": "Xizmatlar",
    "booking.products": "Mahsulotlar",
    "booking.payment": "To'lov",
    "booking.confirmation": "Tasdiqlash",
    "booking.gender": "Jins",
    "booking.male": "Erkak",
    "booking.female": "Ayol",
    "booking.fullName": "To'liq ism",
    "booking.fullNamePlaceholder": "masalan: Alisher Navoiy",
    "booking.fullNameValidation": "To'liq ism kamida 10 ta belgidan iborat bo'lishi kerak",
    "booking.genderRequired": "Jins tanlanishi shart",
    "booking.email": "Email",
    "booking.emailPlaceholder": "example@example.com",
    "booking.emailValidation": "To'g'ri email manzilini kiriting",
    "booking.phone": "Telefon",
    "booking.phonePlaceholder": "+998 XX XXX XX XX",
    "booking.phoneRequired": "Telefon raqami talab qilinadi",
    "booking.notes": "Izohlar",
    "booking.notesPlaceholder": "Qo'shimcha izohlarni kiriting",
    "booking.date": "Sana",
    "booking.dateRequired": "Sana tanlanishi kerak",
    "booking.time": "Vaqt",
    "booking.timeRequired": "Vaqt tanlanishi kerak",
    "booking.next": "Keyingi",
    "booking.previous": "Oldingi",
    "booking.searchServices": "Xizmatlarni qidirish...",
    "booking.minutes": "daqiqa",
    "booking.selectStaff": "Xodimni tanlang",
    "booking.selectedServices": "Tanlangan xizmatlar",
    "booking.servicesTotal": "Xizmatlar jami",
    "booking.totalDuration": "Umumiy davomiylik",
    "booking.duration": "Davomiylik",
    "booking.endTime": "Tugash vaqti",
    "booking.servicesRequired": "Kamida bitta xizmat tanlanishi kerak",
    "booking.staffRequired": "Barcha xizmatlar uchun xodim tanlanishi kerak",
    "booking.loadMore": "Ko'proq yuklash",
    "booking.searchProducts": "Mahsulotlarni qidirish...",
    "booking.recommendedProducts": "Tavsiya etilgan mahsulotlar",
    "booking.allProducts": "Barcha mahsulotlar",
    "booking.selectedProducts": "Tanlangan mahsulotlar",
    "booking.cardPayment": "Karta bilan to'lov",
    "booking.detailed": "Batafsil ma'lumot",

    // Time units
    "time.seconds": "soniya",
    "time.minutes": "daqiqa",
    "time.hours": "soat", 
    "time.days": "kun",

    // Common
    "common.discount": "CHEGIRMA",
    "common.search": "Qidirish...",
    "common.loadMore": "Ko'proq yuklash",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("az");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["az", "en", "ru", "uz"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const translate = (key: string): string => {
    try {
      const keys = key.split(".");
      let value: TranslationValue = translations[language];

      for (const keyPart of keys) {
        if (value && typeof value === "object") {
          value = value[keyPart];
        } else {
          // Try English fallback first
          if (language !== "en") {
            let fallback: TranslationValue = translations.en;
            for (const fallbackKeyPart of keys) {
              if (fallback && typeof fallback === "object") {
                fallback = fallback[fallbackKeyPart];
              } else {
                break;
              }
            }
            if (fallback && typeof fallback === "string") {
              console.warn(`Using English fallback for key: ${key}`);
              return fallback;
            }
          }
          console.warn(
            `Translation key not found: ${key} for language: ${language}`
          );
          return key;
        }
      }

      return typeof value === "string" ? value : key;
    } catch (error) {
      console.error(`Error translating key ${key}:`, error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t: translate }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
