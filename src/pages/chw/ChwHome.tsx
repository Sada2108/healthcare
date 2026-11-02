import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useCHW } from '../../logic/chwStore'
import { useToast } from '../../components/Toast'
import PageShell from '../../components/PageShell'

export default function ChwHome() {
  const { t } = useTranslation()
  const { women, sendReminder } = useCHW()
  const { show } = useToast()

  const counts = {
    registered: women.filter((w) => w.status === 'Registered').length,
    pending: women.filter((w) => w.status === 'Pending').length,
    dropped: women.filter((w) => w.status === 'Dropped off').length,
  }

  const now = new Date()
  const dropOffs = women.filter((w) => {
    const days = (now.getTime() - new Date(w.lastUpdate).getTime()) / (1000 * 60 * 60 * 24)
    return days >= 7
  })

  const daysAgo = (iso: string) => {
    const days = (now.getTime() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)
    return Math.round(days)
  }

  return (
    <PageShell>
      <div className="space-y-5 lg:space-y-8">
        <h2 className="text-lg lg:text-xl font-bold text-ink">{t('chw.dashboard')}</h2>

        {/* count cards - one row at lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
          <div
            className="glass-card p-4 lg:p-6"
            style={{ borderLeft: `5px solid #6B946D` }}
          >
            <p className="text-xs text-ink/50 uppercase tracking-wider mb-1 lg:mb-2">
              {t('chw.registered')}
            </p>
            <p className="text-2xl lg:text-3xl font-bold text-ink">{counts.registered}</p>
          </div>
          <div
            className="glass-card p-4 lg:p-6"
            style={{ borderLeft: `5px solid #F2B134` }}
          >
            <p className="text-xs text-ink/50 uppercase tracking-wider mb-1 lg:mb-2">
              {t('chw.pending')}
            </p>
            <p className="text-2xl lg:text-3xl font-bold text-ink">{counts.pending}</p>
          </div>
          <div
            className="glass-card p-4 lg:p-6"
            style={{ borderLeft: `5px solid #D93636` }}
          >
            <p className="text-xs text-ink/50 uppercase tracking-wider mb-1 lg:mb-2">
              {t('chw.droppedOff')}
            </p>
            <p className="text-2xl lg:text-3xl font-bold text-ink">{counts.dropped}</p>
          </div>
        </div>

        {/* Two columns at lg+: women list left, drop-off right */}
        <div className="lg:flex lg:gap-8">
          <div className="lg:w-1/2 lg:shrink-0 space-y-4">
            <div className="glass-card">
              <div className="flex items-center justify-between p-4 lg:p-5 border-b border-[#FDEEF0]/60">
                <p className="font-semibold text-ink">{t('chw.womenList')}</p>
                <Link
                  to="/chw/add"
                  className="text-xs bg-brand-pink text-white px-2 py-1 rounded-md font-medium"
                >
                  {t('chw.addWoman')}
                </Link>
              </div>
              {women.length === 0 ? (
                <p className="text-center text-ink/60 py-6">{t('chw.noWomen')}</p>
              ) : (
                <div className="divide-y divide-[#FDEEF0]/60">
                  {women.map((w) => (
                    <div key={w.id} className="p-4 lg:p-5 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-ink">{w.name}</p>
                        <p className="text-xs text-ink/50">
                          {t('chw.lastSeen')}: {t('chw.daysAgo', { n: daysAgo(w.lastUpdate) })}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          w.status === 'Registered'
                            ? 'bg-[#6B946D]/20 text-[#6B946D]'
                            : w.status === 'Pending'
                            ? 'bg-[#F2B134]/20 text-[#F2B134]'
                            : 'bg-[#D93636]/20 text-[#D93636]'
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/2 lg:shrink-0 space-y-4">
            <div className="glass-card">
              <div className="p-4 lg:p-5 border-b border-[#FDEEF0]/60">
                <p className="font-semibold text-[#D93636]">{t('chw.dropOffTitle')}</p>
                <p className="text-xs text-ink/50">{t('chw.dropOffSub')}</p>
              </div>
              {dropOffs.length === 0 ? (
                <p className="text-center text-ink/60 py-4">
                  {t('chw.noDropOffs')}
                </p>
              ) : (
                <div className="divide-y divide-[#FDEEF0]/60">
                  {dropOffs.map((w) => (
                    <div key={w.id} className="p-4 lg:p-5 flex items-center justify-between bg-[#D93636]/10 rounded-xl">
                      <div>
                        <p className="font-medium text-[#D93636]">{w.name}</p>
                        <p className="text-xs text-[#D93636]/80">
                          {t('chw.lastSeen')}: {t('chw.daysAgo', { n: daysAgo(w.lastUpdate) })}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          sendReminder(w.id)
                          show(t('chw.reminderSent'))
                        }}
                        className="text-xs bg-[#D93636] text-white px-3 py-1.5 rounded-md font-medium"
                      >
                        {t('chw.sendReminder')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
