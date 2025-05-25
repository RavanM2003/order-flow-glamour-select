
import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "./context";

type Language = "az" | "en" | "ru" | "uz";

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

// Import all locale files
import azTranslations from "@/locales/az.json";
import enTranslations from "@/locales/en.json";
import ruTranslations from "@/locales/ru.json";
import uzTranslations from "@/locales/uz.json";

const translations = {
  az: azTranslations,
  en: enTranslations,
  ru: ruTranslations,
  uz: uzTranslations,
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
      let value: any = translations[language];

      for (const keyPart of keys) {
        if (value && typeof value === "object") {
          value = value[keyPart];
        } else {
          // Try English fallback first
          if (language !== "en") {
            let fallback: any = translations.en;
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
