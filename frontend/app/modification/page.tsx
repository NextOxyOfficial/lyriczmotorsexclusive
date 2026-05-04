'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  CalendarClock,
  CheckCircle,
  Palette,
  Sparkles,
  Star,
  Sticker,
  Wrench,
  Zap,
} from 'lucide-react'
import BookingModal, { type BookingItem } from '@/components/BookingModal'

const MOD_FALLBACK_HERO_IMG = 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=2000&q=85'

function toYouTubeEmbed(url: string): string {
  const id = url.match(/(?:[?&]v=|youtu\.be\/|embed\/)([^?&\s]+)/)?.[1]
  if (!id) return url
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0`
}

function getYouTubeId(url: string): string | null {
  return url.match(/(?:[?&]v=|youtu\.be\/|embed\/)([^?&\s]+)/)?.[1] ?? null
}

function toYouTubeModalEmbed(url: string): string {
  const id = getYouTubeId(url)
  if (!id) return url
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
}

// ── Types ──────────────────────────────────────────────────────────────────
interface ModService {
  id: number
  title: string
  tag: string
  price_display: string
  duration: string
  description: string
  perks: string[]
  accent_color: string
}

interface GalleryItem {
  id: number
  label: string
  media_type: 'image' | 'video'
  image: string | null
  image_url: string
  video_url: string
}

// ── Helpers ────────────────────────────────────────────────────────────────
const ACCENT_MAP: Record<string, { color: string; border: string; bg: string }> = {
  volt:      { color: 'text-volt',      border: 'border-volt/30',      bg: 'bg-volt/5'       },
  ignition:  { color: 'text-ignition',  border: 'border-ignition/30',  bg: 'bg-ignition/5'   },
  boost:     { color: 'text-boost',     border: 'border-boost/30',     bg: 'bg-boost/5'      },
  slate:     { color: 'text-slate-300', border: 'border-white/20',     bg: 'bg-white/[0.04]' },
}

function accentFor(key: string) {
  return ACCENT_MAP[key] ?? ACCENT_MAP.slate
}

function IconFor({ accent }: { accent: string }) {
  const cls = 'h-5 w-5'
  if (accent === 'volt')     return <Sticker className={cls} />
  if (accent === 'ignition') return <Palette className={cls} />
  if (accent === 'boost')    return <Wrench className={cls} />
  return <Star className={cls} />
}

// ── Component ──────────────────────────────────────────────────────────────
export default function ModificationPage() {
  const [services, setServices] = useState<ModService[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loadingSvc, setLoadingSvc] = useState(true)
  const [loadingGallery, setLoadingGallery] = useState(true)
  const [heroMediaType, setHeroMediaType] = useState<'image' | 'video'>('image')
  const [heroImageUrl, setHeroImageUrl] = useState(MOD_FALLBACK_HERO_IMG)
  const [heroVideoUrl, setHeroVideoUrl] = useState('')
  const [modalVideoUrl, setModalVideoUrl] = useState<string | null>(null)

  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingItem, setBookingItem] = useState<BookingItem | null>(null)

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

    // fetch site settings for hero
    fetch(`${base}/site-settings/`)
      .then((r) => r.json())
      .then((d) => {
        setHeroMediaType(d.modification_hero_media_type || 'image')
        setHeroImageUrl(d.modification_hero_image_url || MOD_FALLBACK_HERO_IMG)
        setHeroVideoUrl(d.modification_hero_video_url || '')
      })
      .catch(() => {})
    fetch(`${base}/modification-services/`)
      .then((r) => r.json())
      .then((data) => setServices(Array.isArray(data) ? data : (data.results ?? [])))
      .catch(() => setServices([]))
      .finally(() => setLoadingSvc(false))

    fetch(`${base}/modification-gallery/`)
      .then((r) => r.json())
      .then((data) => setGallery(Array.isArray(data) ? data : (data.results ?? [])))
      .catch(() => setGallery([]))
      .finally(() => setLoadingGallery(false))
  }, [])

  function handleBook(title: string) {
    setBookingItem({ name: title, product_type: 'service' })
    setBookingOpen(true)
  }

  return (
    <>
      <main className="min-h-screen bg-asphalt text-slate-50">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 overflow-hidden">
            {heroMediaType === 'video' && heroVideoUrl ? (
              <iframe
                src={toYouTubeEmbed(heroVideoUrl)}
                className="pointer-events-none absolute inset-0 h-full w-full scale-[1.15]"
                style={{ border: 0 }}
                allow="autoplay; encrypted-media"
                title="Modification hero background"
              />
            ) : (
              <img
                src={heroImageUrl}
                alt="Bike modification and custom design"
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,11,16,0.55)_0%,rgba(9,11,16,0.92)_60%,rgba(9,11,16,1)_100%)]" />
            <div className="absolute inset-0 hud-grid opacity-25" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
              <div className="flex-1">
                <p className="inline-flex items-center gap-2 border border-ignition/30 bg-ignition/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-ignition clip-panel">
                  <Sparkles className="h-3.5 w-3.5" /> Modification Center
                </p>
                <h1 className="mt-3 text-2xl font-black uppercase leading-tight text-white sm:text-4xl lg:text-5xl">
                  Make It Yours.<br className="hidden sm:block" /> Stickers, Wraps &amp; Beyond.
                </h1>
                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                  From full vinyl wraps and custom sticker kits to airbrushed paintwork and LED upgrades — we transform stock bikes into statements.
                </p>
                <div className="mt-6 flex flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => handleBook('Modification Consultation')}
                    className="inline-flex flex-1 items-center justify-center gap-2 bg-ignition px-5 py-3.5 text-xs font-black uppercase text-white clip-panel hover:bg-ignition/90 transition sm:flex-none sm:px-6 sm:text-sm"
                  >
                    <CalendarClock className="h-4 w-4" /> Book a Schedule
                  </button>
                  <Link
                    href="/service"
                    className="inline-flex flex-1 items-center justify-center gap-2 border border-white/25 bg-white/[0.15] px-5 py-3.5 text-xs font-black uppercase text-white clip-panel hover:bg-white/20 transition sm:flex-none sm:px-6 sm:text-sm"
                  >
                    <Wrench className="h-4 w-4" /> Service Center
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden flex-col gap-3 text-right sm:flex sm:pb-2">
                {[
                  { val: '500+', label: 'Bikes Modified' },
                  { val: '50+', label: 'Design Templates' },
                  { val: '1-Day', label: 'Wrap Turnaround' },
                ].map(({ val, label }) => (
                  <div key={label} className="border border-white/10 bg-black/40 px-5 py-3 clip-panel text-right">
                    <p className="text-2xl font-black text-ignition">{val}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Gallery ── */}
        <section className="border-b border-white/10 bg-pitlane py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-1 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-ignition">Our Work</p>
              <h2 className="mt-2 text-2xl font-black uppercase text-white sm:text-3xl">Modification Gallery</h2>
            </div>

            {loadingGallery ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-40 animate-pulse bg-white/5 clip-panel sm:h-52" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                {gallery.map((item) => {
                  const imgSrc = item.image ?? item.image_url
                  if (item.media_type === 'video') {
                    const ytId = getYouTubeId(item.video_url)
                    const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setModalVideoUrl(item.video_url)}
                        className="group relative overflow-hidden clip-panel bg-black/40 text-left focus:outline-none"
                      >
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={item.label}
                            className="h-40 w-full object-cover brightness-75 transition duration-300 group-hover:brightness-90 sm:h-52"
                          />
                        ) : (
                          <div className="flex h-40 w-full items-center justify-center bg-white/5 sm:h-52">
                            <Zap className="h-8 w-8 text-slate-500" />
                          </div>
                        )}
                        {/* Play icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 ring-2 ring-white/30 transition duration-200 group-hover:bg-ignition/80 group-hover:ring-ignition/50">
                            <svg className="h-5 w-5 translate-x-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <p className="absolute bottom-2 left-3 text-[10px] font-black uppercase tracking-[0.18em] text-white">{item.label}</p>
                      </button>
                    )
                  }
                  return (
                    <div key={item.id} className="group relative overflow-hidden clip-panel">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={item.label}
                          className="h-40 w-full object-cover brightness-90 transition duration-500 group-hover:scale-105 group-hover:brightness-100 sm:h-52"
                        />
                      ) : (
                        <div className="h-40 bg-white/5 sm:h-52" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <p className="absolute bottom-2 left-3 text-[10px] font-black uppercase tracking-[0.18em] text-white">{item.label}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Services Grid ── */}
        <section className="mx-auto max-w-7xl px-1 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-ignition">What We Do</p>
            <h2 className="mt-2 text-2xl font-black uppercase text-white sm:text-3xl">Modification Services</h2>
          </div>

          {loadingSvc ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-56 animate-pulse bg-white/5 clip-panel" />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((svc) => {
                const { color, border, bg } = accentFor(svc.accent_color)
                return (
                  <article
                    key={svc.id}
                    className={`relative flex flex-col border ${border} ${bg} p-5 clip-panel shadow-hud`}
                  >
                    {svc.tag && (
                      <span className="absolute right-3 top-3 border border-white/10 bg-black/50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-slate-400 clip-panel">
                        {svc.tag}
                      </span>
                    )}
                    <div className={`mb-4 flex h-10 w-10 items-center justify-center border border-white/10 bg-black/30 clip-panel ${color}`}>
                      <IconFor accent={svc.accent_color} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{svc.duration}</p>
                    <h3 className="mt-1 text-base font-black uppercase text-white">{svc.title}</h3>
                    <p className="mt-1 flex-1 text-sm leading-5 text-slate-400">{svc.description}</p>
                    <ul className="mt-3 space-y-1.5">
                      {(svc.perks ?? []).map((perk) => (
                        <li key={perk} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle className="h-3 w-3 flex-shrink-0 text-volt" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-4">
                      <p className="text-xl font-black text-ignition">৳{svc.price_display}</p>
                      <button
                        type="button"
                        onClick={() => handleBook(svc.title)}
                        className="inline-flex items-center gap-1.5 border border-ignition/40 bg-ignition/10 px-3 py-2 text-[11px] font-black uppercase text-ignition clip-panel hover:bg-ignition/20 transition"
                      >
                        <CalendarClock className="h-3.5 w-3.5" /> Book
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        {/* ── CTA strip ── */}
        <section className="border-t border-white/10 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-ignition">Ready to Transform?</p>
            <h2 className="mt-2 text-2xl font-black uppercase text-white sm:text-3xl">
              Walk In. Ride Out Different.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              Book a free consultation and our design team will walk you through every option — stickers, wraps, paint, and more.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleBook('Modification Consultation')}
                className="inline-flex items-center gap-2 bg-ignition px-8 py-4 text-sm font-black uppercase text-white clip-panel hover:bg-ignition/90 transition"
              >
                <CalendarClock className="h-4 w-4" /> Book Free Schedule
              </button>
              <Link
                href="/spare-parts"
                className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.06] px-8 py-4 text-sm font-black uppercase text-white clip-panel hover:border-volt/30 hover:text-volt transition"
              >
                <Sparkles className="h-4 w-4" /> Browse Spare Parts
              </Link>
            </div>
          </div>
        </section>

      </main>
      <BookingModal open={bookingOpen} item={bookingItem} onClose={() => setBookingOpen(false)} />

      {/* ── Video Modal ── */}
      {modalVideoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setModalVideoUrl(null)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalVideoUrl(null)}
              className="absolute -top-10 right-0 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
            {(modalVideoUrl.includes('youtube.com') || modalVideoUrl.includes('youtu.be')) ? (
              <iframe
                src={toYouTubeModalEmbed(modalVideoUrl)}
                className="aspect-video w-full"
                style={{ border: 0 }}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title="Video player"
              />
            ) : (
              <video
                src={modalVideoUrl}
                autoPlay
                controls
                className="w-full max-h-[75vh]"
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
