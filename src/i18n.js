import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enTranslation from "./i18n/en.json"
import deTranslation from "./i18n/de.json"
import { getCookie, setCookie } from "./Components/GeneralMixins"

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation
    },
    de: {
      translation: deTranslation
    }
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false // React already escapes variables
  }
})

let lang = getCookie("language")
if (lang == null) {
    console.log("language not detected. set default language(en).")
    setCookie("language", "en")
    i18n.changeLanguage("en")
} else {
    console.log(`language detected. -> ${lang}`)
    i18n.changeLanguage("de")
}

export default i18n