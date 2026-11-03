import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import * as L from 'leaflet'
import centres from '../data/centres.json'
import PageShell from '../components/PageShell'

const SERVICES = ['Clinical breast exam', 'Ultrasound', 'Mammogram', 'Biopsy']
const COSTS = ['Free', '₹', '₹₹', '₹₹₹']

export default function Centres() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [view, setView] = useState<'list' | 'map'>('list')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [serviceFilter, setServiceFilter] = useState<string>('')
  const [costFilter, setCostFilter] = useState<string>('')
  const [selectedCentreId, setSelectedCentreId] = useState<string | null>(null)

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })
  }, [])

  const filtered = useMemo(() => {
    return centres.filter((c) => {
      if (verifiedOnly && !c.verified) return false
      if (serviceFilter && !c.services.includes(serviceFilter)) return false
      if (costFilter && c.costRange !== costFilter) return false
      return true
    })
  }, [verifiedOnly, serviceFilter, costFilter])

  const startReferral = (centre: (typeof centres)[number]) => {
    setSelectedCentreId(centre.id)
    navigate('/referral', { state: { centre } })
  }

  return (
    <PageShell>
      <div className="space-y-4 lg:space-y-6">
        <div className="lg:flex lg:items-start lg:justify-between lg:gap-6">
          <div>
            <h2 className="text-lg font-bold text-ink">{t('centres.title')}</h2>
            <p className="text-xs text-ink/40 italic mb-3">
              {t('centres.timingsChange')}
            </p>
          </div>
        </div>

        {/* Filters row - below lg */}
        <div className="lg:hidden space-y-3">
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => setView('list')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'bg-brand-pink text-white'
                  : 'bg-white/60 border border-pink-border text-ink hover:bg-pink-hover'
              }`}
            >
              {t('centres.list')}
            </button>
            <button
              type="button"
              onClick={() => setView('map')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                view === 'map'
                  ? 'bg-brand-pink text-white'
                  : 'bg-white/60 border border-pink-border text-ink hover:bg-pink-hover'
              }`}
            >
              {t('centres.map')}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`min-h-10 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                verifiedOnly
                  ? 'bg-brand-pink border-brand-pink text-white'
                  : 'bg-white/60 border-pink-border text-ink hover:bg-pink-hover'
              }`}
            >
              {t('centres.verifiedOnly')}
            </button>
            {SERVICES.map((svc) => (
              <button
                key={svc}
                type="button"
                onClick={() => setServiceFilter(serviceFilter === svc ? '' : svc)}
                className={`min-h-10 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  serviceFilter === svc
                    ? 'bg-brand-pink border-brand-pink text-white'
                    : 'bg-white/60 border-pink-border text-ink hover:bg-pink-hover'
                }`}
              >
                {svc}
              </button>
            ))}
            {COSTS.map((cost) => (
              <button
                key={cost}
                type="button"
                onClick={() => setCostFilter(costFilter === cost ? '' : cost)}
                className={`min-h-10 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  costFilter === cost
                    ? 'bg-brand-pink border-brand-pink text-white'
                    : 'bg-white/60 border-pink-border text-ink hover:bg-pink-hover'
                }`}
              >
                {cost}
              </button>
            ))}
          </div>
        </div>

        {/* Content - two columns at lg+ */}
        <div
          className={`lg:flex lg:gap-8 ${
            view === 'list' ? 'space-y-6 lg:space-y-0' : 'hidden lg:flex'
          }`}
        >
          {/* Left: filters + scrollable list */}
          <div className="lg:w-1/2 lg:shrink-0">
            {/* Filters at lg+ */}
            <div className="lg:block hidden space-y-3 mb-4">
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    view === 'list'
                      ? 'bg-brand-pink text-white'
                      : 'bg-white/60 border border-pink-border text-ink hover:bg-pink-hover'
                  }`}
                >
                  {t('centres.list')}
                </button>
                <button
                  type="button"
                  onClick={() => setView('map')}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    view === 'map'
                      ? 'bg-brand-pink text-white'
                      : 'bg-white/60 border border-pink-border text-ink hover:bg-pink-hover'
                  }`}
                >
                  {t('centres.map')}
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  type="button"
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`min-h-10 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    verifiedOnly
                      ? 'bg-brand-pink border-brand-pink text-white'
                      : 'bg-white/60 border-pink-border text-ink hover:bg-pink-hover'
                  }`}
                >
                  {t('centres.verifiedOnly')}
                </button>
                {SERVICES.map((svc) => (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => setServiceFilter(serviceFilter === svc ? '' : svc)}
                    className={`min-h-10 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      serviceFilter === svc
                        ? 'bg-brand-pink border-brand-pink text-white'
                        : 'bg-white/60 border-pink-border text-ink hover:bg-pink-hover'
                    }`}
                  >
                    {svc}
                  </button>
                ))}
                {COSTS.map((cost) => (
                  <button
                    key={cost}
                    type="button"
                    onClick={() => setCostFilter(costFilter === cost ? '' : cost)}
                    className={`min-h-10 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      costFilter === cost
                        ? 'bg-brand-pink border-brand-pink text-white'
                        : 'bg-white/60 border-pink-border text-ink hover:bg-pink-hover'
                    }`}
                  >
                    {cost}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="glass-card h-[70vh] overflow-y-auto p-4"
              style={{ position: 'sticky', top: '1rem' }}
            >
              {filtered.length === 0 ? (
                <p className="text-center text-ink/60 py-6">{t('centres.noCentres')}</p>
              ) : (
                <div className="space-y-3">
                  {filtered.map((c) => (
                    <div
                      key={c.id}
                      className="glass-card flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-ink">{c.name}</h3>
                          <p className="text-xs text-ink/60">{c.type}</p>
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            c.verified ? 'bg-[#6B946D]/20 text-[#6B946D]' : 'bg-[#D9363D]/20 text-[#D9363D]'
                          }`}
                        >
                          {c.verified ? t('centres.verified') : t('centres.notVerified')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-ink/70">
                        <span>💰 {c.costRange}</span>
                        <span>🕒 {c.timings}</span>
                        <span>📞 {c.phone}</span>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`tel:${c.phone.replace(/\s/g, '')}`}
                          className="flex-1 min-h-10 rounded-xl border border-pink-border bg-white/60 text-brand-pink font-semibold text-center transition hover:bg-pink-hover"
                        >
                          {t('centres.call')}
                        </a>
                        <button
                          type="button"
                          onClick={() => startReferral(c)}
                          className="flex-1 min-h-10 rounded-xl bg-brand-pink text-white font-semibold text-center transition active:scale-95"
                        >
                          {t('centres.chooseCentre')}
                        </button>
                      </div>
                      <div className="flex gap-1">
                        {c.services.map((s) => (
                          <span key={s} className="text-[10px] bg-pink-glass text-brand-pink px-2 py-0.5 rounded-md">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: sticky map */}
          <div className="lg:w-1/2 lg:shrink-0">
            <div className="glass-card h-[70vh] rounded-[20px] overflow-hidden" style={{ position: 'sticky', top: '1rem' }}>
              <MapContainer
                center={[28.6139, 77.2090]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {filtered.map((c) => (
                  <Marker
                    key={c.id}
                    position={[c.lat, c.lng]}
                  >
                    <Popup>
                      <div className="text-sm">
                        <div className="font-bold text-ink">{c.name}</div>
                        <div className="text-xs text-ink/60">{c.type}</div>
                        <div className="text-xs text-ink/60 mt-1">{c.costRange}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Below lg: map view */}
        <div className="lg:hidden">
          {view === 'map' && (
            <div className="space-y-4">
              <div className="leaflet-map h-[400px] rounded-[20px] overflow-hidden">
                <MapContainer
                  center={[28.6139, 77.2090]}
                  zoom={12}
                  style={{ height: '400px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  {filtered.map((c) => (
                    <Marker
                      key={c.id}
                      position={[c.lat, c.lng]}
                    >
                      <Popup>
                        <div className="text-sm">
                          <div className="font-bold text-ink">{c.name}</div>
                          <div className="text-xs text-ink/60">{c.type}</div>
                          <div className="text-xs text-ink/60 mt-1">{c.costRange}</div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <p className="text-center text-xs text-ink/50">
                {t('centres.verifiedOnly')}
              </p>
            </div>
          )}
        </div>

        {selectedCentreId && (
          <div className="mt-4 glass-card p-4">
            <p className="text-sm text-brand-pink font-semibold mb-1">
              {t('centres.referralStarted', { name: centres.find((c) => c.id === selectedCentreId)?.name || '' })}
            </p>
            <Link
              to="/referral"
              className="min-h-10 w-full rounded-xl bg-brand-pink text-white font-semibold text-center transition active:scale-95"
            >
              {t('referral.nextStep')}
            </Link>
          </div>
        )}
      </div>
    </PageShell>
  )
}
