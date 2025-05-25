
import React, { useState, useEffect, useContext, createContext } from "react";

type Language = "az" | "en" | "ru" | "uz";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create context
export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

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
          value = undefined;
          break;
        }
      }

      // If value found and is string, return it
      if (typeof value === "string") {
        return value;
      }

      // Try English fallback
      if (language !== "en") {
        let fallback: any = translations.en;
        for (const fallbackKeyPart of keys) {
          if (fallback && typeof fallback === "object") {
            fallback = fallback[fallbackKeyPart];
          } else {
            fallback = undefined;
            break;
          }
        }
        if (typeof fallback === "string") {
          console.warn(`Using English fallback for key: ${key}`);
          return fallback;
        }
      }

      console.warn(`Translation key not found: ${key} for language: ${language}`);
      return key;
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
