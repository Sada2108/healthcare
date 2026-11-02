import { useTranslation } from 'react-i18next'

export default function PlaceholderPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <h1 className="text-2xl font-bold">{t('placeholder.title')}</h1>
      <p className="text-rose-soft-700">{t('placeholder.text')}</p>
    </div>
  )
}
