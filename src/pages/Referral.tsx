import { useTranslation } from 'react-i18next'
import { useLocation, Link } from 'react-router-dom'
import ProgressRing from '../components/ProgressRing'
import women from '../data/women.json'
import { nextStep, referralProgress, stepIndex, REFERRAL_STEPS, type ReferralStep } from '../logic/referral'
import PageShell from '../components/PageShell'

const STEP_LABELS: Record<ReferralStep, string> = {
  Referred: 'referral.steps.Referred',
  Booked: 'referral.steps.Booked',
  Screened: 'referral.steps.Screened',
  Result: 'referral.steps.Result',
  'Follow-up': 'referral.steps.Follow-up',
}

const DATE_FIELD: Record<ReferralStep, string> = {
  Referred: 'referredOn',
  Booked: 'bookedOn',
  Screened: 'screenedOn',
  Result: 'resultOn',
  'Follow-up': 'followUpOn',
}

const STEP_DATES: Record<ReferralStep, string> = {
  Referred: 'referral.referredOn',
  Booked: 'referral.bookedOn',
  Screened: 'referral.screenedOn',
  Result: 'referral.resultOn',
  'Follow-up': 'referral.followUpOn',
}

export default function Referral() {
  const { t } = useTranslation()
  const location = useLocation()

  const centre = (location.state as { centre?: { name?: string } })?.centre
  const woman = women[0]

  const step = (woman.status as ReferralStep) ?? 'Referred'
  const { current, total } = referralProgress(step)
  const next = nextStep(step)

  return (
    <PageShell>
      <div className="space-y-6 lg:space-y-8">
        <h2 className="text-lg lg:text-xl font-bold text-ink">{t('referral.title')}</h2>

        {/* Two columns at lg+ */}
        <div className="lg:flex lg:gap-8">
          {/* Left: woman card + next step */}
          <div className="lg:w-1/2 lg:shrink-0 space-y-6">
            <div className="glass-card p-5 lg:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm lg:text-base font-semibold text-ink">
                    {woman.name}, {woman.age}
                  </p>
                  <p className="text-xs text-ink/60">
                    {t('centres.centre')}: {centre?.name || woman.centre}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    step === 'Follow-up'
                      ? 'bg-[#6B946D]/20 text-[#6B946D]'
                      : 'bg-brand-pink/20 text-brand-pink'
                  }`}
                >
                  {t(STEP_LABELS[step])}
                </span>
              </div>
            </div>

            {next && (
              <div className="glass-card p-5 lg:p-6">
                <p className="text-sm font-semibold text-brand-pink mb-2">
                  {t('referral.nextStep')}: {t(STEP_LABELS[next])}
                </p>
                <Link
                  to="/centres"
                  className="min-h-10 w-full rounded-xl border border-pink-border bg-white/60 text-brand-pink font-semibold text-center transition hover:bg-pink-hover"
                >
                  {t('referral.complete')}
                </Link>
              </div>
            )}
          </div>

          {/* Right: timeline */}
          <div className="lg:w-1/2 lg:shrink-0">
            <div className="glass-card p-5 lg:p-6">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <span className="text-sm font-semibold text-ink">
                  {t('referral.nextStep')}
                </span>
                <ProgressRing value={current} total={total} size={90} />
              </div>

              <div className="space-y-3 lg:space-y-4">
                {REFERRAL_STEPS.map((s, i) => {
                  const done = stepIndex(s) < stepIndex(step)
                  const active = s === step
                  const date = woman[DATE_FIELD[s] as keyof typeof woman] as
                    | string
                    | undefined
                  return (
                    <div
                      key={s}
                      className={`flex items-center gap-3 pl-4 relative ${
                        done ? 'text-[#6B946D]' : 'text-ink/50'
                      }`}
                    >
                      {i > 0 && (
                        <div className={`absolute left-2 top-3 bottom-3 w-0.5 ${
                          done ? 'bg-[#6B946D]' : 'bg-[#FDEEF0]/60'
                        }`} />
                      )}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md z-10 ${
                          active
                            ? 'bg-brand-pink text-white border-2 border-white'
                            : done
                            ? 'bg-[#6B946D] text-white border-2 border-white'
                            : 'bg-white/60 border border-pink-border text-ink/50'
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          active ? 'text-ink' : 'text-ink/60'
                        }`}>{t(STEP_LABELS[s])}</p>
                        {date && (
                          <p className="text-xs text-ink/40">
                            {t(STEP_DATES[s])}: {date}
                          </p>
                        )}
                        {!date && active && (
                          <p className="text-xs text-ink/40">
                            {t('referral.pending')}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 text-center lg:pt-0 lg:hidden">
          <p className="text-xs text-ink/50">{t('app.privacyLine')}</p>
        </div>
      </div>
    </PageShell>
  )
}
