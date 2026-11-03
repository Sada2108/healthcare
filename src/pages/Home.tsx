import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, MapPin, FileText } from 'lucide-react'
import PageShell from '../components/PageShell'

const cards = [
  { to: '/learn', label: 'nav.learn', sub: 'home.learnSub', Icon: BookOpen },
  { to: '/check', label: 'nav.check', sub: 'home.checkSub', Icon: CheckCircle },
  { to: '/centres', label: 'nav.findCentre', sub: 'home.findCentreSub', Icon: MapPin },
  { to: '/referral', label: 'nav.myReferral', sub: 'home.myReferralSub', Icon: FileText },
] as const

export default function Home() {
  const { t } = useTranslation()

  return (
    <PageShell>
      <div className="relative">
        <div
          className="absolute top-[-40px] left-[-20px] w-64 h-64 bg-brand-pink/20 blur-[64px] rounded-full pointer-events-none"
        />
        <div
          className="absolute top-[-20px] right-[-10px] w-48 h-48 bg-lavender/20 blur-[48px] rounded-full pointer-events-none"
        />

        <div className="relative z-10 pt-6 pb-8 lg:pt-10 lg:pb-0">
          <div className="lg:flex lg:items-start lg:gap-12">
            <div className="lg:w-1/2 flex flex-col gap-6">
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.svg" alt="MammoCare" className="w-6 h-6" />
                <h1 className="text-3xl lg:text-4xl font-bold text-ink leading-tight">
                  {t('home.heading')}
                </h1>
              </div>
              <p className="text-lg text-ink/70 leading-relaxed max-w-prose">
                {t('home.subheading')}
              </p>
              <img
                src="/hero-illustration.svg"
                alt="Breast health illustration"
                className="w-full max-w-xs lg:max-w-none mt-6 lg:mt-0 mx-auto lg:mx-0"
              />
            </div>

            <div className="lg:w-1/2 mt-6 lg:mt-0">
              <nav className="flex flex-col gap-4">
                {cards.map((card) => {
                  const Icon = card.Icon
                  return (
                    <Link
                      key={card.to}
                      to={card.to}
                      className="glass-card flex items-center justify-between group cursor-pointer transition-transform active:scale-[0.98]"
                    >
                      <div>
                        <span className="block text-lg font-bold text-ink">
                          {t(card.label)}
                        </span>
                        <span className="text-sm text-ink/60">{t(card.sub)}</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-pink-glass flex items-center justify-center text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors">
                        <Icon size={18} strokeWidth={2.5} />
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>

        <p className="mt-8 lg:mt-12 text-center">
          <Link
            to="/chw"
            className="inline-flex items-center gap-1.5 min-h-11 px-4 py-2 text-sm text-brand-pink font-medium underline decoration-brand-pink/40"
          >
            {t('app.forHealthWorkers')}
          </Link>
        </p>
      </div>
    </PageShell>
  )
}
