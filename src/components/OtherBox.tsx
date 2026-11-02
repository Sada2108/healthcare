import { useTranslation } from 'react-i18next'

interface OtherBoxProps {
  value: string
  onChange: (value: string) => void
  placeholderKey?: string
  labelKey?: string
}

export default function OtherBox({
  value,
  onChange,
  placeholderKey = 'check.otherPlaceholder',
  labelKey,
}: OtherBoxProps) {
  const { t } = useTranslation()

  return (
    <div className="mt-2">
      {labelKey && <span className="block text-xs text-ink/40 mb-1">{t(labelKey)}</span>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t(placeholderKey)}
        className="w-full min-h-11 rounded-xl border border-pink-border bg-white/60 backdrop-blur-sm px-4 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
      />
    </div>
  )
}
