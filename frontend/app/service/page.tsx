'use client'

import Link from 'next/link'
import { CalendarClock, Shield, Star, Wrench, Zap } from 'lucide-react'

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
  return (
    <main className="min-h-screen bg-asphalt text-slate-50">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/10 py-14 sm:py-20">
        <div className="absolute inset-0 hud-grid opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(9,11,16,0.95),rgba(40,242,156,0.06))]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 border border-volt/30 bg-volt/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-volt clip-panel">
            <Wrench className="h-4 w-4" /> Service Center
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black uppercase leading-tight sm:text-5xl lg:text-6xl">
            Our Team. Your Machine. Done Right.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
            Meet the certified technicians behind every service bay. Real expertise, real accountability — every time your bike enters our shop.
          </p>
          <Link
            href="/#book"
            className="mt-8 inline-flex items-center gap-2 bg-ignition px-6 py-4 text-sm font-black uppercase text-white clip-panel hover:bg-ignition/90 transition"
          >
            <CalendarClock className="h-4 w-4" /> Book a Service Slot
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-white/10 bg-pitlane py-5">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { label: 'Technicians', value: `${team.length}` },
            { label: 'On Duty Now', value: `${team.filter(m => m.status === 'on_duty').length}` },
            { label: 'Bikes Serviced', value: `${team.reduce((s, m) => s + m.bikes_serviced, 0).toLocaleString()}+` },
            { label: 'Service Bays', value: '3' },
          ].map((stat) => (
            <div key={stat.label} className="border border-white/10 bg-white/[0.04] px-4 py-4 clip-panel">
              <p className="text-2xl font-black text-volt">{stat.value}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team Grid ── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
                    className="h-52 w-full object-cover object-top"
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
      <section className="border-t border-white/10 bg-pitlane py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-ignition">What We Offer</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-white sm:text-4xl">Service Packages</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
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
            <Link
              href="/#book"
              className="inline-flex items-center gap-2 bg-volt px-8 py-4 text-sm font-black uppercase text-asphalt clip-panel hover:bg-volt/90 transition"
            >
              <CalendarClock className="h-4 w-4" /> Book Your Service Now
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
