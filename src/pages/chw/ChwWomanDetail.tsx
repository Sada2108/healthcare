import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
import { useCHW } from '../../logic/chwStore'
import { useToast } from '../../components/Toast'
import {
  REFERRAL_STEPS,
  stepIndex,
  type ReferralStep,
} from '../../logic/referral'
import PageShell from '../../components/PageShell'

const RESULT_COLOR: Record<string, string> = {
  green: '#6B946D',
  yellow: '#F2B134',
  red: '#D93636',
  'red-urgent': '#D93636',
}

const STEP_LABELS: Record<ReferralStep, string> = {
  Referred: 'referral.steps.Referred',
  Booked: 'referral.steps.Booked',
  Screened: 'referral.steps.Screened',
  Result: 'referral.steps.Result',
  'Follow-up': 'referral.steps.Follow-up',
}

export default function ChwWomanDetail() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { getWoman, updateStatus, addNote, sendReminder } = useCHW()
  const { show } = useToast()

  const [noteText, setNoteText] = useState('')

  const woman = getWoman(id ?? '')

  if (!woman) {
    return (
      <PageShell>
        <div className="py-16 text-center">
          <h1 className="text-2xl font-bold text-ink">{t('chw.womanProfile')}</h1>
          <p className="mt-3 text-ink/60">{t('chw.womanNotFound')}</p>
          <Link to="/chw" className="text-brand-pink underline">
            {t('nav.home')}
          </Link>
        </div>
      </PageShell>
    )
  }

  const statuses: CHWStatus[] = ['Registered', 'Pending', 'Dropped off']

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteText.trim()) return
    addNote(woman.id, noteText.trim())
    setNoteText('')
  }

  const handleReminder = () => {
    sendReminder(woman.id)
    show(t('chw.reminderSent'))
  }

  const step = (woman.referralStep as ReferralStep) ?? 'Referred'

  return (
    <PageShell>
      <div className="space-y-5 lg:space-y-8">
        <Link to="/chw" className="text-sm text-brand-pink underline">
          ← {t('nav.home')}
        </Link>

        <h2 className="text-lg lg:text-xl font-bold text-ink">{woman.name}</h2>

        {/* Two columns at lg+ */}
        <div className="lg:flex lg:gap-8">
          {/* Left: details + her own words */}
          <div className="lg:w-1/2 lg:shrink-0 space-y-6">
            <div className="glass-card p-5 lg:p-6">
              <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-4">
                <div>
                  <p className="text-xs text-ink/50">{t('chw.age')}</p>
                  <p className="text-base text-ink">{woman.age}</p>
                </div>
                <div>
                  <p className="text-xs text-ink/50">{t('chw.phone')}</p>
                  <p className="text-base text-ink">{woman.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-ink/50">{t('chw.language')}</p>
                  <p className="text-base text-ink">{woman.language}</p>
                </div>
                <div>
                  <p className="text-xs text-ink/50">{t('chw.village')}</p>
                  <p className="text-base text-ink">{woman.village}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <p className="text-xs font-semibold text-ink/70">
                  {t('chw.resultColour')}
                </p>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      RESULT_COLOR[woman.resultLevel ?? 'green'] ?? '#6B946D',
                  }}
                />
                <span className="text-xs text-ink/60">
                  {woman.resultLevel ?? t('chw.notSet')}
                </span>
              </div>

              <div className="border border-pink-border bg-pink-glass rounded-xl p-4">
                <p className="text-xs font-semibold text-brand-pink mb-2">
                  {t('chw.otherText')}
                </p>
                <p className="text-sm text-ink max-w-prose">
                  {woman.otherText ? (
                    <span>{`“${woman.otherText}”`}</span>
                  ) : (
                    <span className="text-ink/40 italic">{t('check.feltNothing')}</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right: timeline + notes + actions */}
          <div className="lg:w-1/2 lg:shrink-0 space-y-6">
            {/* referral timeline */}
            <div className="glass-card p-5 lg:p-6">
              <p className="text-sm font-semibold text-brand-pink mb-3">
                {t('chw.referralTimeline')}
              </p>
              <div className="space-y-3 lg:space-y-4">
                {REFERRAL_STEPS.map((s, i) => {
                  const done = stepIndex(s) < stepIndex(step)
                  const active = s === step
                  return (
                    <div
                      key={s}
                      className={`flex items-center gap-3 pl-4 relative ${
                        done ? 'text-[#6B946D]' : 'text-ink/50'
                      }`}
                    >
                      {i > 0 && (
                        <div className={`absolute left-3 top-2 bottom-2 w-0.5 ${
                          done ? 'bg-[#6B946D]' : 'bg-[#FDEEF0]/60'
                        }`} />
                      )}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md z-10 ${
                          active
                            ? 'bg-brand-pink text-white border-2 border-white'
                            : done
                            ? 'bg-[#6B946D] text-white border-2 border-white'
                            : 'bg-white/60 border border-pink-border text-ink/50'
                        }`}
                      >
                        {i + 1}
                      </div>
                      <p className={`text-sm ${
                        active ? 'font-bold text-ink' : 'text-ink/60'
                      }`}>{t(STEP_LABELS[s])}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* notes */}
            <div className="glass-card p-5 lg:p-6">
              <p className="text-sm font-semibold text-brand-pink mb-3">
                {t('chw.notes')}
              </p>
              {woman.notes.length === 0 ? (
                <p className="text-xs text-ink/50 italic">No notes yet.</p>
              ) : (
                <div className="space-y-2">
                  {woman.notes.map((n, i) => (
                    <p key={i} className="text-sm text-ink/70">
                      • {n}
                    </p>
                  ))}
                </div>
              )}
              <form onSubmit={handleAddNote} className="mt-4">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={t('chw.notePlaceholder')}
                  className="w-full min-h-11 rounded-xl border border-pink-border bg-white/60 backdrop-blur-sm px-4 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
                />
                <button
                  type="submit"
                  className="mt-3 min-h-10 rounded-xl bg-brand-pink text-white text-sm font-semibold"
                >
                  {t('chw.addNote')}
                </button>
              </form>
            </div>

            {/* actions */}
            <div className="glass-card p-5 lg:p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-ink/70">
                  {t('chw.updateStatus')}
                </p>
                <button
                  type="button"
                  onClick={handleReminder}
                  className="text-xs text-[#D93636] underline"
                >
                  {t('chw.sendReminder')}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {statuses.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateStatus(woman.id, s)}
                    className={`min-h-10 rounded-xl border px-2 py-1 text-xs font-medium transition-colors ${
                      woman.status === s
                        ? 'bg-brand-pink border-brand-pink text-white'
                        : 'bg-white/60 border-pink-border text-ink hover:bg-pink-hover'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}

type CHWStatus = 'Registered' | 'Pending' | 'Dropped off'
