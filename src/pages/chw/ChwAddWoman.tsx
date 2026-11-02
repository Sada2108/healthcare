import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useCHW } from '../../logic/chwStore'
import PageShell from '../../components/PageShell'

const LANGUAGES = ['English', 'हिन्दी']

export default function ChwAddWoman() {
  const { t } = useTranslation()
  const { addWoman } = useCHW()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    age: '',
    phone: '',
    language: 'English',
    village: '',
  })
  const [error, setError] = useState('')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.age || !form.phone || !form.village) {
      setError('Please fill all fields.')
      return
    }
    addWoman({
      name: form.name,
      age: Number(form.age),
      phone: form.phone,
      language: form.language,
      village: form.village,
      status: 'Registered',
      lastUpdate: new Date().toISOString(),
    })
    navigate('/chw')
  }

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-lg lg:text-xl font-bold text-ink mb-5 lg:mb-6">
          {t('chw.addWoman')}
        </h2>
        <form onSubmit={handleSave} className="glass-card p-5 lg:p-6 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
          {error && (
            <p className="text-sm text-[#D93636] lg:col-span-2">
              {error}
            </p>
          )}
          <div className="space-y-3">
            <label className="block text-sm text-ink/70">
              {t('chw.name')}
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full min-h-11 rounded-xl border border-pink-border bg-white/60 backdrop-blur-sm px-4 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm text-ink/70">{t('chw.age')}</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="w-full min-h-11 rounded-xl border border-pink-border bg-white/60 backdrop-blur-sm px-4 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm text-ink/70">{t('chw.phone')}</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full min-h-11 rounded-xl border border-pink-border bg-white/60 backdrop-blur-sm px-4 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
              required
            />
          </div>
          <div className="space-y-3 lg:col-span-2">
            <label className="block text-sm text-ink/70">{t('chw.language')}</label>
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              className="w-full min-h-11 rounded-xl border border-pink-border bg-white/60 backdrop-blur-sm px-4 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-3 lg:col-span-2">
            <label className="block text-sm text-ink/70">{t('chw.village')}</label>
            <input
              type="text"
              value={form.village}
              onChange={(e) => setForm({ ...form, village: e.target.value })}
              className="w-full min-h-11 rounded-xl border border-pink-border bg-white/60 backdrop-blur-sm px-4 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
              required
            />
          </div>
          <div className="flex gap-3 pt-2 lg:col-span-2">
            <button
              type="submit"
              className="flex-1 min-h-11 rounded-xl bg-brand-pink text-white font-semibold transition active:scale-95"
            >
              {t('chw.save')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/chw')}
              className="flex-1 min-h-11 rounded-xl border border-pink-border bg-white/60 text-brand-pink font-semibold transition hover:bg-pink-hover"
            >
              {t('chw.cancel')}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  )
}
