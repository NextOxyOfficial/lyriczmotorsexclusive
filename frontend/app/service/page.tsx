'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarClock, Shield, Star, Wrench, Zap } from 'lucide-react'
import BookingModal, { type BookingItem } from '@/components/BookingModal'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

type HeroMedia = { media_type: 'image' | 'video'; image_url: string; video_url: string }

const SERVICE_FALLBACK_HERO: HeroMedia = {
  media_type: 'image',
  image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=2000&q=85',
  video_url: '',
}

function toYouTubeEmbed(url: string): string {
  const id = url.match(/(?:[?&]v=|youtu\.be\/|embed\/)([^?&\s]+)/)?.[1]
  if (!id) return url
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0`
}

type TeamMember = {
  id: number
  name: string
  role: string
  specialty: string
  experience: string
  certifications: string[]
  image_url: string
  status: 'available' | 'on_duty' | 'off_duty'
  bikes_serviced: number
}

type ServicePackage = {
  title: string
  tier: string
  price: string
  duration: string
  description: string
  perks: string[]
}

const team: TeamMember[] = [
  {
    id: 1,
    name: 'Rafiqul Islam',
    role: 'Head Mechanic',
    specialty: 'Engine Rebuild & Performance Tuning',
    experience: '12 years',
    certifications: ['Yamaha Certified', 'Honda Authorized', 'ABS Systems'],
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    status: 'on_duty',
    bikes_serviced: 1840,
  },
  {
    id: 2,
    name: 'Tanvir Ahmed',
    role: 'Senior Technician',
    specialty: 'Suspension Setup & Brake Systems',
    experience: '8 years',
    certifications: ['Brembo Certified', 'Suspension Specialist', 'KTM Trained'],
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
    status: 'on_duty',
    bikes_serviced: 1120,
  },
  {
    id: 3,
    name: 'Mahbub Hossain',
    role: 'Electricals & Diagnostics',
    specialty: 'ECU Mapping, FI Systems & Wiring',
    experience: '6 years',
    certifications: ['Bosch Diagnostics', 'FI Specialist', 'Digital Systems'],
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
    status: 'available',
    bikes_serviced: 740,
  },
  {
    id: 4,
    name: 'Sakib Al Hasan',
    role: 'Detailing & Ceramic Specialist',
    specialty: 'Ceramic Coating, Paint Correction & Detailing',
    experience: '5 years',
    certifications: ['Ceramic Pro Certified', 'IDA Detailing', 'Paint Protection'],
    image_url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&q=80',
    status: 'available',
    bikes_serviced: 620,
  },
  {
    id: 5,
    name: 'Arif Hossain',
    role: 'Track & Race Prep Technician',
    specialty: 'Race Setup, Torque Audit & Safety Checks',
    experience: '9 years',
    certifications: ['FIM Certified', 'Race Prep Specialist', 'Tire & Wheel Expert'],
    image_url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&q=80',
    status: 'on_duty',
    bikes_serviced: 980,
  },
  {
    id: 6,
    name: 'Nahid Rahman',
    role: 'Service Advisor',
    specialty: 'Customer Consultation & Service Planning',
    experience: '4 years',
    certifications: ['Customer Excellence', 'Parts Specialist', 'Warranty Expert'],
    image_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&q=80',
    status: 'available',
    bikes_serviced: 0,
  },
]

const packages: ServicePackage[] = [
  {
    title: 'Pit Boss Premium Tune',
    tier: 'Performance',
    price: '12,500',
    duration: '3 hours',
    description: 'Full diagnostic, oil, chain, brake, throttle, and ride-mode calibration for premium bikes.',
    perks: ['Digital inspection report', 'Priority bay', 'Road test', 'Service reminder'],
  },
  {
    title: 'Armor Wash & Ceramic Shield',
    tier: 'Detailing',
    price: '8,500',
    duration: '2 hours',
    description: 'Premium wash, degrease, polish, and ceramic shield for showroom-level delivery.',
    perks: ['Ceramic finish', 'Chain clean', 'Photo-ready delivery', 'Pickup slot'],
  },
  {
    title: 'Track Day Readiness Check',
    tier: 'Race Prep',
    price: '18,500',
    duration: 'Half day',
    description: 'Suspension, brake, tire, cooling, and safety inspection for aggressive performance riding.',
    perks: ['Torque audit', 'Suspension baseline', 'Brake heat check', 'Mechanic notes'],
  },
]

const statusConfig = {
  on_duty: { label: 'On Duty', color: 'bg-volt text-asphalt' },
  available: { label: 'Available', color: 'bg-boost/20 text-boost border border-boost/40' },
  off_duty: { label: 'Off Duty', color: 'bg-white/10 text-slate-400' },
}

export default function ServicePage() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingItem, setBookingItem] = useState<BookingItem | null>(null)
  const [hero, setHero] = useState<HeroMedia>(SERVICE_FALLBACK_HERO)

  useEffect(() => {
    fetch(`${API}/site-settings/`)
      .then((r) => r.json())
      .then((d) => {
        setHero({
          media_type: d.service_hero_media_type || 'image',
          image_url: d.service_hero_image_url || SERVICE_FALLBACK_HERO.image_url,
          video_url: d.service_hero_video_url || '',
        })
      })
      .catch(() => {})
  }, [])

  function handleBookService() {
    setBookingItem({ name: 'Service Booking', product_type: 'service' })
    setBookingOpen(true)
  }

  return (
    <>
    <main className="min-h-screen bg-asphalt text-slate-50">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* Background image/video */}
        <div className="absolute inset-0 overflow-hidden">
          {hero.media_type === 'video' && hero.video_url ? (
            <iframe
              src={toYouTubeEmbed(hero.video_url)}
              className="pointer-events-none absolute inset-0 h-full w-full scale-[1.15]"
              style={{ border: 0 }}
              allow="autoplay; encrypted-media"
              title="Service hero background"
            />
          ) : (
            <img
              src={hero.image_url}
              alt="Service center"
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,11,16,0.6)_0%,rgba(9,11,16,0.92)_60%,rgba(9,11,16,1)_100%)]" />
          <div className="absolute inset-0 hud-grid opacity-30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            {/* Left: badge + heading */}
            <div className="flex-1">
              <p className="inline-flex items-center gap-2 border border-volt/30 bg-volt/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-volt clip-panel">
                <Wrench className="h-3.5 w-3.5" /> Service Center
              </p>
              <h1 className="mt-3 text-2xl font-black uppercase leading-tight text-white sm:text-4xl lg:text-5xl">
                Our Team. Your Machine.<br className="hidden sm:block" /> Done Right.
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                Certified technicians behind every service bay. Real expertise, real accountability — every time your bike enters our shop.
              </p>
            </div>

            {/* Right: CTA */}
            <div className="flex flex-col items-start gap-3 sm:items-end sm:pb-2">
              <button
                type="button"
                onClick={handleBookService}
                className="inline-flex items-center gap-2 bg-ignition px-6 py-3.5 text-sm font-black uppercase text-white clip-panel hover:bg-ignition/90 transition"
              >
                <CalendarClock className="h-4 w-4" /> Book a Service Slot
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team Grid ── */}
      <section className="mx-auto max-w-7xl px-2 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-ignition">The Crew</p>
          <h2 className="mt-2 text-3xl font-black uppercase text-white sm:text-4xl">Service Team</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => {
            const s = statusConfig[member.status]
            return (
              <article key={member.id} className="border border-white/10 bg-white/[0.04] clip-panel shadow-hud">
                {/* Photo */}
                <div className="relative overflow-hidden">
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="h-80 w-full object-contain object-top"
                  />
                  <span className={`absolute right-3 top-3 px-3 py-1 text-[10px] font-black uppercase tracking-wider clip-panel ${s.color}`}>
                    {s.label}
                  </span>
                  {member.bikes_serviced > 0 && (
                    <span className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 px-3 py-1 text-[10px] font-black uppercase text-volt clip-panel">
                      <Zap className="h-3 w-3" /> {member.bikes_serviced.toLocaleString()} jobs
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-ignition">{member.role}</p>
                  <h3 className="mt-1 text-lg font-black uppercase text-white">{member.name}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{member.specialty}</p>

                  <div className="mt-3 flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 flex-shrink-0 text-volt" />
                    <span className="text-xs text-slate-300">{member.experience} experience</span>
                  </div>

                  {/* Certifications */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {member.certifications.map((cert) => (
                      <span key={cert} className="border border-white/10 bg-white/[0.05] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-300 clip-panel">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── Service Packages ── */}
      <ServicePackagesSection packages={packages} onBookNow={handleBookService} />

    </main>
    <BookingModal open={bookingOpen} item={bookingItem} onClose={() => setBookingOpen(false)} />
    </>
  )
}

// ===========================================================================
// SERVICE PACKAGES SECTION — tab layout on mobile, grid on desktop
// ===========================================================================
function ServicePackagesSection({ packages, onBookNow }: { packages: ServicePackage[]; onBookNow: () => void }) {
  const [activeTab, setActiveTab] = useState(0)
  const active = packages[activeTab]

  return (
    <section className="border-t border-white/10 bg-pitlane py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-1 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-ignition">What We Offer</p>
          <h2 className="mt-2 text-3xl font-black uppercase text-white sm:text-4xl">Service Packages</h2>
        </div>

        {/* ── Mobile: Tab UI ── */}
        <div className="sm:hidden">
          {/* Tab strip */}
          <div className="flex overflow-x-auto scrollbar-none border border-white/10 bg-white/[0.03] clip-panel">
            {packages.map((pkg, i) => (
              <button
                key={pkg.title}
                type="button"
                onClick={() => setActiveTab(i)}
                className={`flex-1 min-w-[80px] px-3 py-3 text-[10px] font-black uppercase tracking-[0.15em] transition border-r last:border-r-0 border-white/10 ${
                  activeTab === i
                    ? 'bg-volt text-asphalt'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {pkg.tier}
              </button>
            ))}
          </div>

          {/* Active panel */}
          <div className="mt-1 border border-white/10 bg-white/[0.04] p-5 clip-panel shadow-hud">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-volt">{active.tier}</p>
            <h3 className="mt-1 text-lg font-black uppercase text-white">{active.title}</h3>
            <div className="mt-2 flex items-end gap-2">
              <p className="text-2xl font-black text-ignition">৳{active.price}</p>
              <p className="mb-0.5 text-xs text-slate-500">{active.duration}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{active.description}</p>
            <ul className="mt-4 space-y-2">
              {active.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-xs text-slate-300">
                  <Star className="h-3 w-3 flex-shrink-0 text-volt" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Desktop: 3-column grid ── */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <div key={pkg.title} className="border border-white/10 bg-white/[0.04] p-5 clip-panel shadow-hud">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-volt">{pkg.tier}</p>
              <h3 className="mt-1 text-lg font-black uppercase text-white">{pkg.title}</h3>
              <p className="mt-2 text-2xl font-black text-ignition">৳{pkg.price}</p>
              <p className="mt-1 text-xs text-slate-500">{pkg.duration}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{pkg.description}</p>
              <ul className="mt-4 space-y-1.5">
                {pkg.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-xs text-slate-300">
                    <Star className="h-3 w-3 flex-shrink-0 text-volt" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={onBookNow}
            className="inline-flex items-center gap-2 bg-volt px-8 py-4 text-sm font-black uppercase text-asphalt clip-panel hover:bg-volt/90 transition"
          >
            <CalendarClock className="h-4 w-4" /> Book Your Service Now
          </button>
        </div>
      </div>
    </section>
  )
}
