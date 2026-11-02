import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { QUESTIONS } from '../data/questions'
import type { Question, Step } from '../data/questions'
import ProgressRing from '../components/ProgressRing'
import OtherBox from '../components/OtherBox'
import LanguageSelector from '../components/LanguageSelector'

const STEP_TITLES: Record<Step, string> = {
  1: 'check.step1',
  2: 'check.step2',
  3: 'check.step3',
  4: 'check.step4',
}

interface PainState {
  breast: 'left' | 'right' | null
  zone: string | null
  intensity: number
  timing: 'constant' | 'comesAndGoes' | null
}

const TOUCH_CARDS = ['check.touch.card1', 'check.touch.card2', 'check.touch.card3', 'check.touch.card4', 'check.touch.card5']

export default function Check() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>(1)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [pain, setPain] = useState<PainState>({
    breast: null,
    zone: null,
    intensity: 0,
    timing: null,
  })
  const [felt, setFelt] = useState<string[]>([])
  const [feltOther, setFeltOther] = useState('')

  const setAnswer = (id: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const currentQuestions = QUESTIONS.filter((q) => q.step === step)

  const isSelected = (id: string, value: unknown) => answers[id] === value
  const isFeltSelected = (value: string) => felt.includes(value)

  const goNext = () => {
    if (step === 4) {
      const finalAnswers = {
        ...answers,
        pain,
        felt,
        feltOther,
      }
      navigate('/result', { state: { answers: finalAnswers } })
      return
    }
    setStep((s) => (s === 4 ? 4 : (s + 1) as Step))
  }

  const goBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step)
  }

  const renderOption = (q: Question, optKey: string) => {
    const selected = isSelected(q.id, optKey)
    const handleSelect = () => {
      setAnswer(q.id, optKey)
    }
    return (
      <button
        key={optKey}
        type="button"
        onClick={handleSelect}
        className={`w-full min-h-11 rounded-xl border px-3 py-2 text-base text-left transition-colors ${
          selected
            ? 'bg-brand-pink border-brand-pink text-white'
            : 'bg-white/60 border-pink-border text-ink hover:bg-pink-hover'
        }`}
      >
        {t(optKey)}
      </button>
    )
  }

  const renderQuestion = (q: Question) => {
    if (q.dependsOn) {
      const depVal = answers[q.dependsOn.id]
      if (depVal !== q.dependsOn.value) return null
    }

    const otherVal = answers[`${q.id}__other`] as string | undefined

    return (
      <div key={q.id} className="mb-6">
        <p className="text-sm font-semibold text-ink mb-2">{t(q.label)}</p>

        {q.id === 'felt' && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {q.options?.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  if (isFeltSelected(opt)) {
                    setFelt(felt.filter((f) => f !== opt))
                  } else {
                    setFelt([...felt, opt])
                  }
                }}
                className={`min-h-11 rounded-xl border px-3 py-2 text-sm text-center transition-colors ${
                  isFeltSelected(opt)
                    ? 'bg-brand-pink border-brand-pink text-white'
                    : 'bg-white/60 border-pink-border text-ink hover:bg-pink-hover'
                }`}
              >
                {t(opt)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                if (isFeltSelected('check.opt.other')) {
                  setFelt(felt.filter((f) => f !== 'check.opt.other'))
                } else {
                  setFelt([...felt, 'check.opt.other'])
                }
              }}
              className={`min-h-11 rounded-xl border px-3 py-2 text-sm text-center transition-colors ${
                isFeltSelected('check.opt.other')
                  ? 'bg-brand-pink border-brand-pink text-white'
                  : 'bg-white/60 border-pink-border text-ink hover:bg-pink-hover'
              }`}
            >
              {t('check.opt.other')}
            </button>
          </div>
        )}
        {q.id === 'felt' && isFeltSelected('check.opt.other') && (
          <OtherBox
            value={feltOther}
            onChange={(v) => setFeltOther(v)}
            placeholderKey="check.otherPlaceholder"
          />
        )}

        {q.id !== 'felt' && q.options && q.type !== 'number' && q.type !== 'text' && (
          <div className="space-y-1.5">
            {q.options.map((opt) => renderOption(q, opt))}
            {q.other && (
              <button
                type="button"
                onClick={() => setAnswer(q.id, 'check.opt.other')}
                className={`w-full min-h-11 rounded-xl border px-3 py-2 text-base text-left transition-colors ${
                  isSelected(q.id, 'check.opt.other')
                    ? 'bg-brand-pink border-brand-pink text-white'
                    : 'bg-white/60 border-pink-border text-ink hover:bg-pink-hover'
                }`}
              >
                {t('check.opt.other')}
              </button>
            )}
            {q.preferNotToSay && (
              <button
                type="button"
                onClick={() => setAnswer(q.id, 'preferNotToSay')}
                className="w-full min-h-11 rounded-xl border border-ink/20 px-3 py-2 text-base text-left text-ink/50 transition hover:bg-pink-hover"
              >
                {t('check.preferNotToSay')}
              </button>
            )}
            {(isSelected(q.id, 'check.opt.other') || isFeltSelected('check.opt.other')) && q.other && (
              <OtherBox
                value={otherVal ?? ''}
                onChange={(v) => setAnswer(`${q.id}__other`, v)}
              />
            )}
          </div>
        )}

        {(q.type === 'number' || q.type === 'text') && (
          <input
            type={q.type === 'number' ? 'number' : 'text'}
            min={q.min}
            max={q.max}
            value={String(answers[q.id] ?? '')}
            onChange={(e) => {
              let val = e.target.value
              if (q.type === 'number') val = val === '' ? '' : String(Math.floor(Number(val) || 0))
              setAnswer(q.id, q.type === 'number' && val !== '' ? Number(val) : val)
            }}
            placeholder={q.unit}
            className="w-full min-h-11 rounded-xl border border-pink-border bg-white/60 backdrop-blur-sm px-4 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
          />
        )}
      </div>
    )
  }

  const renderStep1 = () => (
    <div className="space-y-6">{currentQuestions.map(renderQuestion)}</div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">{currentQuestions.map(renderQuestion)}</div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <p className="text-sm lg:text-base font-semibold text-ink mb-4">
        {t('check.painTitle')}
      </p>
      <div className="lg:flex lg:items-start lg:gap-8">
        <div className="lg:w-[420px] lg:shrink-0">
          <svg
            width="260"
            height="320"
            viewBox="0 0 260 320"
            className="mx-auto lg:mx-0 mb-4 lg:mb-0"
          >
            <defs>
              <radialGradient id="breastGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="100%" stopColor="#fdeef0" />
              </radialGradient>
            </defs>
            <path
              d="M60 20 C60 20 100 20 120 60 C140 100 140 180 120 220 C100 260 60 260 40 220 C20 180 20 100 40 60 C60 20 60 20 60 20 Z"
              fill="url(#breastGrad)"
              stroke="#f9dce3"
              strokeWidth="3"
            />
            <line x1="130" y1="60" x2="130" y2="220" stroke="#f9dce3" strokeWidth="2" />
            <g className="cursor-pointer" onClick={() => setPain({ ...pain, breast: 'left', zone: null })}>
              <circle cx="75" cy="140" r="30" fill="#fdeef0" stroke="#ec6a8f" strokeWidth="2" />
              <text x="75" y="40" text-anchor="middle" fill="#ec6a8f" fontSize="12" fontWeight="bold">
                {t('check.breastLeft')}
              </text>
            </g>
            <g className="cursor-pointer" onClick={() => setPain({ ...pain, breast: 'right', zone: null })}>
              <circle cx="185" cy="140" r="30" fill="#fdeef0" stroke="#ec6a8f" strokeWidth="2" />
              <text x="185" y="40" text-anchor="middle" fill="#ec6a8f" fontSize="12" fontWeight="bold">
                {t('check.breastRight')}
              </text>
            </g>
            <g onClick={() => setPain({ ...pain, breast: 'left', zone: 'check.zoneUpper' })}>
              <circle cx="75" cy="115" r="9" fill={pain.breast === 'left' && pain.zone === 'check.zoneUpper' ? '#ec6a8f' : '#d98bc9'} />
            </g>
            <g onClick={() => setPain({ ...pain, breast: 'left', zone: 'check.zoneLower' })}>
              <circle cx="75" cy="165" r="9" fill={pain.breast === 'left' && pain.zone === 'check.zoneLower' ? '#ec6a8f' : '#d98bc9'} />
            </g>
            <g onClick={() => setPain({ ...pain, breast: 'left', zone: 'check.zoneNipple' })}>
              <circle cx="75" cy="140" r="9" fill={pain.breast === 'left' && pain.zone === 'check.zoneNipple' ? '#ec6a8f' : '#d98bc9'} />
            </g>
            <g onClick={() => setPain({ ...pain, breast: 'left', zone: 'check.zoneArmpit' })}>
              <circle cx="50" cy="140" r="9" fill={pain.breast === 'left' && pain.zone === 'check.zoneArmpit' ? '#ec6a8f' : '#d98bc9'} />
            </g>
            <g onClick={() => setPain({ ...pain, breast: 'right', zone: 'check.zoneUpper' })}>
              <circle cx="185" cy="115" r="9" fill={pain.breast === 'right' && pain.zone === 'check.zoneUpper' ? '#ec6a8f' : '#d98bc9'} />
            </g>
            <g onClick={() => setPain({ ...pain, breast: 'right', zone: 'check.zoneLower' })}>
              <circle cx="185" cy="165" r="9" fill={pain.breast === 'right' && pain.zone === 'check.zoneLower' ? '#ec6a8f' : '#d98bc9'} />
            </g>
            <g onClick={() => setPain({ ...pain, breast: 'right', zone: 'check.zoneNipple' })}>
              <circle cx="185" cy="140" r="9" fill={pain.breast === 'right' && pain.zone === 'check.zoneNipple' ? '#ec6a8f' : '#d98bc9'} />
            </g>
            <g onClick={() => setPain({ ...pain, breast: 'right', zone: 'check.zoneArmpit' })}>
              <circle cx="210" cy="140" r="9" fill={pain.breast === 'right' && pain.zone === 'check.zoneArmpit' ? '#ec6a8f' : '#d98bc9'} />
            </g>
          </svg>

          <p className="text-sm text-ink/70 text-center mb-6 lg:mb-0">
            {pain.breast && pain.zone
              ? `${t('check.breastLeft').split(' ')[0]} ${t(pain.zone)}`
              : 'Tap a breast and a zone'}
          </p>
        </div>

        <div className="lg:flex-1 space-y-6">
          <div className="mb-4">
            <p className="text-xs text-ink/60 mb-1">{t('check.intensity')}</p>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={pain.intensity}
              onChange={(e) => setPain({ ...pain, intensity: Number(e.target.value) })}
              className="w-full accent-brand-pink"
            />
            <p className="text-xs text-ink/50 text-center mt-1">{pain.intensity}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPain({ ...pain, timing: 'constant' })}
              className={`min-h-11 rounded-xl border px-3 py-2 text-sm transition-colors ${
                pain.timing === 'constant'
                  ? 'bg-brand-pink border-brand-pink text-white'
                  : 'bg-white/60 border-pink-border text-ink hover:bg-pink-hover'
              }`}
            >
              {t('check.constant')}
            </button>
            <button
              type="button"
              onClick={() => setPain({ ...pain, timing: 'comesAndGoes' })}
              className={`min-h-11 rounded-xl border px-3 py-2 text-sm transition-colors ${
                pain.timing === 'comesAndGoes'
                  ? 'bg-brand-pink border-brand-pink text-white'
                  : 'bg-white/60 border-pink-border text-ink hover:bg-pink-hover'
              }`}
            >
              {t('check.comesAndGoes')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-4">
      <p className="text-sm lg:text-base font-semibold text-brand-pink mb-4">
        {t('check.touchTitle')}
      </p>
      <div className="space-y-3">
        {TOUCH_CARDS.map((cardKey, i) => (
          <div key={i} className="glass-card flex items-start gap-3 p-4">
            <div className="w-10 h-10 rounded-full bg-pink-glass flex items-center justify-center text-brand-pink font-bold text-base flex-shrink-0">
              {i + 1}
            </div>
            <p className="text-sm lg:text-base text-ink leading-relaxed">{t(cardKey)}</p>
          </div>
        ))}
      </div>

      {currentQuestions.map(renderQuestion)}

      <div className="pt-4 bg-white/40 rounded-2xl p-4">
        <p className="text-xs text-ink/50 text-center italic">{t('check.touchNote')}</p>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (step) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      default:
        return renderStep4()
    }
  }

  const isLast = step === 4

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#FDEEF0] to-[#F9DCE3] relative">
      <header className="flex items-center justify-between gap-2 px-4 py-3">
        <span className="text-base font-bold text-brand-pink">
          {t('app.name')}
        </span>
        <LanguageSelector />
      </header>

      <main className="mx-auto w-full max-w-3xl lg:max-w-3xl px-4 lg:px-8 pb-32 lg:pb-0 flex-1">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <ProgressRing value={step} total={4} size={120} label={`Step ${step} of 4`} />
        </div>
        <h2 className="text-center lg:text-left text-lg lg:text-xl font-bold text-ink mb-1">
          {t(STEP_TITLES[step])}
        </h2>

        <div className="space-y-6 mt-4 lg:mt-8">{renderContent()}</div>

        <div className="mt-8 lg:mt-12 flex justify-between gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              disabled={false}
              className="min-h-11 px-6 rounded-xl border border-pink-border bg-white/60 text-brand-pink font-semibold transition hover:bg-pink-hover"
            >
              {t('check.back')}
            </button>
          )}
          <button
            type="button"
            onClick={goNext}
            className="min-h-11 px-6 rounded-xl bg-brand-pink text-white font-semibold transition active:scale-95"
          >
            {isLast ? t('check.submit') : t('check.next')}
          </button>
        </div>

        <footer className="px-4 pt-6 text-center">
          <p className="text-sm text-ink/50">{t('app.privacyLine')}</p>
        </footer>
      </main>
    </div>
  )
}
