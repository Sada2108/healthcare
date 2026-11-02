import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, Link } from 'react-router-dom'
import { getResult, type ResultLevel } from '../logic/result'
import { getGuidance, type AiGuidance } from '../ai/realAi'
import i18n from '../i18n'

const LEVEL_COLOR: Record<ResultLevel, string> = {
  green: '#6B946D',
  yellow: '#F2B134',
  red: '#D93636',
  'red-urgent': '#D93636',
}

export default function Result() {
  const { t } = useTranslation()
  const location = useLocation()
  const answers = (location.state as { answers?: Record<string, unknown> })?.answers ?? {}

  const [guidance, setGuidance] = useState<AiGuidance | null>(null)
  const [loading, setLoading] = useState(true)

  const result = getResult(answers)
  const color = LEVEL_COLOR[result.level]

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    void getGuidance({
      level: result.level,
      answers,
      otherTexts: result.otherTexts,
      language: i18n.language,
    }).then((g) => {
      if (!cancelled) {
        setGuidance(g)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const messages: Record<ResultLevel, string> = {
    green: t('result.green'),
    yellow: t('result.yellow'),
    red: t('result.red'),
    'red-urgent': t('result.redUrgent'),
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#FDEEF0] to-[#F9DCE3] relative">
      <header className="flex items-center justify-between gap-2 px-4 py-3 lg:px-8">
        <span className="text-base font-bold text-brand-pink">
          {t('app.name')}
        </span>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 lg:px-8 pb-32 flex-1">
        <h1 className="text-center lg:text-left text-lg font-bold text-ink mb-6 lg:mb-8">
          {t('result.title')}
        </h1>

        <div className="lg:flex lg:gap-8">
          {/* Left column */}
          <div className="lg:w-1/2 space-y-6">
            <div className="glass-card mb-6 lg:mb-0" style={{ borderColor: color }}>
              <div className="flex items-start gap-3 p-5">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                  style={{ backgroundColor: color }}
                >
                  {result.level === 'green'
                    ? '✓'
                    : result.level === 'yellow'
                    ? '!'
                    : '!'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-ink">
                    {result.level === 'red-urgent'
                      ? t('result.redUrgent')
                      : result.level === 'red'
                      ? t('result.red')
                      : result.level === 'yellow'
                      ? t('result.yellow')
                      : t('result.green')}
                  </h2>
                  <p className="mt-2 text-base text-ink/80 leading-relaxed max-w-prose">
                    {messages[result.level]}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center lg:text-left text-sm text-ink/60 mb-6 lg:mb-0 italic">
              {t('result.safetyLine')}
            </p>

            {result.reasons.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-brand-pink mb-3">
                  {t('result.reasonsHeader')}
                </p>
                <ul className="space-y-2 text-sm text-ink/70">
                  {result.reasons.map((key, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="flex-shrink-0 mt-0.5">•</span>
                      <span>{t(key)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.otherTexts.length > 0 && (
              <div className="mb-6 glass-card p-4">
                <p className="text-sm font-semibold text-brand-pink mb-2">
                  {t('check.feltTitle')}
                </p>
                <ul className="space-y-1 text-sm text-ink/70">
                  {result.otherTexts.map((text, i) => (
                    <li key={i} className="text-ink">
                      “{text}”
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid gap-3 lg:grid-cols-2">
              <Link
                to="/centres"
                className="min-h-12 rounded-xl flex items-center justify-center bg-brand-pink text-white font-semibold transition active:scale-95"
              >
                {t('nav.findCentre')}
              </Link>
              <Link
                to="/chw"
                className="min-h-12 rounded-xl flex items-center justify-center border border-pink-border bg-white/60 text-brand-pink font-semibold transition hover:bg-pink-hover"
              >
                {t('result.talkHealthWorker')}
              </Link>
            </div>
          </div>

          {/* Right column - AI guidance */}
          <div className="lg:w-1/2 lg:shrink-0">
            {loading ? (
              <div className="glass-card p-5 text-center">
                <p className="text-sm text-ink/60">{t('result.loading')}</p>
              </div>
            ) : (
              <div className="glass-card p-5">
                <p className="text-sm font-semibold text-brand-pink mb-3">
                  {t('result.aiLabel')}
                </p>
                <p className="text-sm text-ink mb-3 max-w-prose">
                  {guidance?.summary ?? ''}
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-ink/50 uppercase tracking-wider mb-1">
                      {t('result.possibleReasons')}
                    </p>
                    <ul className="space-y-1 text-sm text-ink/70 list-disc list-inside">
                      {guidance?.possibleReasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-ink/50 uppercase tracking-wider mb-1">
                      {t('result.whatToWatch')}
                    </p>
                    <ul className="space-y-1 text-sm text-ink/70 list-disc list-inside">
                      {guidance?.whatToWatch.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-ink/50 uppercase tracking-wider mb-1">
                      {t('result.whatToTellDoctor')}
                    </p>
                    <ul className="space-y-1 text-sm text-ink/70 list-disc list-inside">
                      {guidance?.whatToTellDoctor.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-ink/50 uppercase tracking-wider mb-1">
                      {t('result.testsToAskAbout')}
                    </p>
                    <ul className="space-y-1 text-sm text-ink/70 list-disc list-inside">
                      {guidance?.testsToAskAbout.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-4 text-xs text-ink/40 italic text-center">
                  {guidance?.disclaimer ?? t('result.disclaimer')}
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="mt-8 lg:mt-0 text-center text-sm text-ink/60 italic">
          {t('result.disclaimer')}
        </p>
      </main>
    </div>
  )
}
