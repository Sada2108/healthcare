import { useEffect, useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { LEARN_SECTIONS, LEARN_SOURCES } from '../data/learn'
import PageShell from '../components/PageShell'

const sourceById = new Map(LEARN_SOURCES.map((s) => [s.id, s]))

const sectionImages: Record<string, { src: string; alt: string }> = {
  'about-breast-cancer': {
    src: '/10-things-about-breast-cancer-s2-what-is-breast-cancer.webp',
    alt: 'Illustration of breast cancer awareness and education',
  },
  'normal-breasts': {
    src: '/Lobules_and_ducts_of_the_breast.jpg',
    alt: 'Diagram of lobules and ducts in breast tissue',
  },
  'warning-signs': {
    src: '/blog-breast-symptoms.webp',
    alt: 'Illustration of breast cancer warning signs and symptoms',
  },
  'when-to-see-a-doctor': {
    src: '/eh-symptoms-of-early-breast-cancer-seo-graphicddfbff18-eb70-43a6-80e6-8ea838900032.webp',
    alt: 'Early breast cancer warning signs and when to seek care',
  },
}

export default function Learn() {
  const { t } = useTranslation()
  const [activeId, setActiveId] = useState<string | null>(LEARN_SECTIONS[0]?.id ?? null)
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())

  const registerRef = useCallback((id: string) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(id, el)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { threshold: 0.3, rootMargin: '-20% 0% -60% 0%' },
    )

    sectionRefs.current.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <PageShell>
      <div className="space-y-6 lg:space-y-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">
          {t('learn.pageTitle')}
        </h1>
        <p className="text-sm lg:text-base text-ink/70 leading-relaxed max-w-prose">
          {t('learn.intro')}
        </p>

        {/* Topic chips - below lg */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {LEARN_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                const el = document.getElementById(section.id)
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                activeId === section.id
                  ? 'bg-brand-pink border-brand-pink text-white'
                  : 'bg-white/60 border-pink-border text-ink hover:bg-pink-hover'
              }`}
            >
              {section.title.en}
            </button>
          ))}
        </div>

        {/* Article - single centered reading column */}
        <div className="max-w-prose mx-auto">
          {LEARN_SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              ref={registerRef(section.id)}
              className="mb-12"
            >
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-ink mb-3">
                  {section.title.en}
                </h2>
                {section.blocks.en.map((block, bi) => (
                  <div key={bi} className="mb-4">
                    {block.length === 1 ? (
                      <p className="text-base text-ink/70 leading-relaxed">
                        {block[0]}
                      </p>
                    ) : (
                      <ul className="space-y-2 text-base text-ink/70 leading-relaxed list-disc list-inside">
                        {block.map((item, ii) => (
                          <li key={ii}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                {sectionImages[section.id] && (
                  <img
                    src={sectionImages[section.id].src}
                    alt={sectionImages[section.id].alt}
                    className="w-full rounded-xl shadow-[0_8px_24px_rgba(236,106,143,0.25)] object-cover object-center"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <p className="mt-4 text-xs text-ink/50">
                  <span className="font-semibold text-brand-pink">
                    {t('learn.source')}:{' '}
                  </span>
                  {section.sources.map((sid, si) => {
                    const src = sourceById.get(sid)
                    if (!src) return null
                    return (
                      <>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-pink underline underline-offset-2 hover:no-underline"
                        >
                          {src.label}
                        </a>
                        {si < section.sources.length - 1 && ', '}
                      </>
                    )
                  })}
                </p>
              </div>
            </section>
          ))}

          {/* Sources section */}
          <section id="sources" className="mb-8">
            <h2 className="text-lg font-bold text-ink mb-3">
              {t('learn.sourcesTitle')}
            </h2>
            <ol className="space-y-2 text-sm text-ink/70 list-decimal list-inside">
              {LEARN_SOURCES.map((s) => (
                <li key={s.id} className="mb-2">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-pink underline underline-offset-2 hover:no-underline"
                  >
                    {s.label}
                  </a>{' '}
                  <span className="text-ink/50">(Accessed 2 Nov 2026)</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-ink/50 italic leading-relaxed">
              {t('learn.disclaimer')}
            </p>
            <p className="text-xs text-ink/40 italic">
              {t('learn.medicalReview')}
            </p>
          </section>

          {/* Action buttons */}
          <div className="mt-8 grid gap-3">
            <Link
              to="/check"
              className="min-h-12 rounded-xl flex items-center justify-center bg-brand-pink text-white font-semibold transition active:scale-95"
            >
              {t('learn.checkYourself')}
            </Link>
            <Link
              to="/centres"
              className="min-h-12 rounded-xl flex items-center justify-center border border-pink-border bg-white/60 text-brand-pink font-semibold transition hover:bg-pink-hover"
            >
              {t('learn.findCentre')}
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
