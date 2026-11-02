import { useTranslation } from 'react-i18next'
import { changeLanguage, languages } from '../i18n'

export default function LanguageSelector() {
  const { i18n } = useTranslation()

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex gap-1 rounded-full bg-pink-glass p-1 border border-pink-border"
    >
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => changeLanguage(lang.code)}
          aria-pressed={i18n.language === lang.code}
          className={`min-h-11 rounded-full px-4 text-base font-semibold transition-colors ${
            i18n.language === lang.code
              ? 'bg-brand-pink text-white'
              : 'text-ink/60 hover:bg-pink-hover'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
