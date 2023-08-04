import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enTranslation from "./i18n/en.json"

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation
    }
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false // React already escapes variables
  }
})

export default i18n