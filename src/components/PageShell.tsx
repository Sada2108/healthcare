import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, Link, NavLink } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../logic/authStore'
import LanguageSelector from './LanguageSelector'
import BottomNav from './BottomNav'

const NAV_LINKS: { path: string; label: string }[] = [
  { path: '/', label: 'nav.home' },
  { path: '/learn', label: 'nav.learn' },
  { path: '/check', label: 'nav.check' },
  { path: '/centres', label: 'nav.findCentre' },
  { path: '/referral', label: 'nav.myReferral' },
]

export default function PageShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isChw = pathname.startsWith('/chw')
  const isLogin = pathname === '/login'
  const isHome = pathname === '/'

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Top navbar - lg and up */}
      <header
        className="lg:flex lg:items-center lg:justify-between gap-2 px-4 py-3 lg:px-8"
      >
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="MammoCare" className="w-5 h-5" />
          <span className="text-base font-bold text-brand-pink">
            {t('app.name')}
          </span>
        </div>
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'px-3 py-2 rounded-full bg-brand-pink text-white'
                  : 'text-ink/60 hover:text-brand-pink hover:bg-pink-glass'
              }
            >
              {t(link.label)}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink/70 hidden sm:inline">
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm text-brand-pink font-medium underline decoration-brand-pink/40 hover:no-underline"
              >
                {t('login.signOut')}
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/chw"
                className="text-sm text-brand-pink font-medium underline decoration-brand-pink/40 hover:no-underline"
              >
                {t('app.forHealthWorkers')}
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Bottom header for mobile - app name + language selector */}
      <header className="flex items-center justify-between gap-2 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="MammoCare" className="w-4 h-4" />
          <span className="text-base font-bold text-brand-pink">
            {t('app.name')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          {user && (
            <button
              type="button"
              onClick={handleSignOut}
              className="text-xs text-brand-pink font-medium underline decoration-brand-pink/40 hover:no-underline"
            >
              {t('login.signOut')}
            </button>
          )}
        </div>
      </header>

      {!isHome && (
        <div className="px-4 lg:px-8 py-2">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 min-h-11 px-4 py-2 text-sm text-brand-pink font-medium underline decoration-brand-pink/40 hover:no-underline"
          >
            ← {t('check.back')}
          </button>
        </div>
      )}

      <main
        className={`mx-auto w-full max-w-6xl px-4 md:px-8 lg:px-10 flex-1 ${
          !isChw ? 'pb-28 lg:pb-0' : 'pb-8 lg:pb-0'
        }`}
      >
        {children}
      </main>

      <footer className="px-4 pt-2 text-center">
        <p className="text-sm text-ink/60">{t('app.privacyLine')}</p>
      </footer>

      {!isChw && !isLogin && <BottomNav className="lg:hidden" />}
    </div>
  )
}
