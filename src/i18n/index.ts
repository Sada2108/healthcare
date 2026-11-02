import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import hi from './hi.json'

export const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
] as const

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: localStorage.getItem('bh-lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export function changeLanguage(code: string) {
  localStorage.setItem('bh-lang', code)
  void i18n.changeLanguage(code)
  document.documentElement.lang = code
}

export default i18n
