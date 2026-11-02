import { useLocation } from 'react-router-dom'
import { Home, BookOpen, CheckCircle, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'nav.home', Icon: Home },
  { path: '/learn', label: 'nav.learn', Icon: BookOpen },
  { path: '/check', label: 'nav.check', Icon: CheckCircle },
  { path: '/centres', label: 'nav.findCentre', Icon: MapPin },
] as const

export default function BottomNav({
  className,
}: { className?: string }) {
  const { pathname } = useLocation()

  const isChw = pathname.startsWith('/chw')
  const isActive = (path: string) => pathname === path

  if (isChw) return null

  return (
    <nav
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-white/70 backdrop-blur-md px-6 py-3 shadow-sm border border-white/60 flex items-center gap-1 ${className ?? ''}`}
    >
      {navItems.map((item) => {
        const active = isActive(item.path)
        const Icon = item.Icon
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`p-2.5 rounded-full transition-colors ${
              active
                ? 'bg-brand-pink text-white shadow-[0_2px_8px_rgba(236,106,143,0.35)]'
                : 'text-ink/50 hover:text-brand-pink hover:bg-pink-glass'
            }`}
            aria-label={item.label}
          >
            <Icon size={20} strokeWidth={active ? 3 : 2} />
          </Link>
        )
      })}
    </nav>
  )
}
