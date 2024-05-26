import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enTranslation from "./i18n/en.json"
import deTranslation from "./i18n/de.json"
import krTranslation from "./i18n/kr.json"
import ruTranslation from "./i18n/ru.json"
import idTranslation from "./i18n/id.json"
import jpTranslation from "./i18n/jp.json"
import vnTranslation from "./i18n/vn.json"

import { getCookie, setCookie } from "./lib/GeneralMixins"

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation
    },
    de: {
      translation: deTranslation
    },
    kr: {
      translation: krTranslation
    },
    ru: {
      translation: ruTranslation
    },
    id: {
      translation: idTranslation
    },
    jp: {
      translation: jpTranslation
    },
    vn: {
      translation: vnTranslation
    },
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
})

let lang = getCookie("language")
if (lang == null) {
    console.log("language not detected. set default language(en).")
    setCookie("language", "en")
    i18n.changeLanguage("en")
} else {
    console.log(`language detected. -> ${lang}`)
    i18n.changeLanguage(lang)
}

export default i18n