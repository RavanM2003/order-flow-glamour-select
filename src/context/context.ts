
import { createContext } from "react";

type Language = "az" | "en" | "ru" | "uz";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);
