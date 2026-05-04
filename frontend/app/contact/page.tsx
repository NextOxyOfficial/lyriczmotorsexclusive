'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import {
  CalendarClock,
  CheckCircle,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Youtube,
} from 'lucide-react'

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api'

const contactInfo = [
  {
    icon: MapPin,
    label: 'Showroom',
    value: 'Dhaka, Bangladesh',
    sub: 'Visit us anytime during business hours',
  },
  {
    icon: Phone,
    label: 'Phone / WhatsApp',
    value: '+880 17XX-XXXXXX',
    href: 'tel:+8801700000000',
    sub: 'Available 10AM – 8PM, Saturday–Thursday',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@lyriczmotors.com',
    href: 'mailto:hello@lyriczmotors.com',
    sub: 'We reply within 24 hours',
  },
]

const socials = [
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
]

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const fd = new FormData(e.currentTarget)
    const payload = {
      name: String(fd.get('name') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      email: String(fd.get('email') ?? ''),
      intent: String(fd.get('intent') ?? 'general'),
      message: String(fd.get('message') ?? ''),
      source: 'contact_page',
    }
    try {
      const res = await fetch(`${apiBaseUrl}/leads/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Server error')
      setStatus('success')
      ;(e.target as HTMLFormElement).reset()
    } catch {
      setStatus('error')
      setErrorMsg('কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।')
    }
  }

  return (
    <main className="min-h-screen bg-asphalt text-slate-50">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/10 py-8 sm:py-10">
        <div className="absolute inset-0 hud-grid opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(9,11,16,0.95),rgba(244,63,31,0.06))]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="flex-1">
              <p className="inline-flex items-center gap-2 border border-ignition/30 bg-ignition/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-ignition clip-panel">
                <MessageSquare className="h-3.5 w-3.5" /> Contact Us
              </p>
              <h1 className="mt-3 text-2xl font-black uppercase leading-tight sm:text-3xl lg:text-4xl">
                Get In Touch.<br className="hidden sm:block" /> We're Here For You.
              </h1>
            </div>
            <div className="flex flex-col items-start gap-4 sm:max-w-xs sm:items-end lg:max-w-sm">
              <p className="text-sm leading-6 text-slate-400 sm:text-right">
                Questions about a bike, spare part, or service? Drop us a message — our team responds fast.
              </p>
              <Link
                href="/#book"
                className="inline-flex items-center gap-2 bg-ignition px-5 py-3 text-xs font-black uppercase text-white clip-panel hover:bg-ignition/90 transition"
              >
                <CalendarClock className="h-4 w-4" /> Book a Service Slot
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <div className="mx-auto max-w-7xl px-2 py-5 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">

          {/* ── Left: Info + Socials ── */}
          <div className="flex flex-col gap-5">
            {contactInfo.map(({ icon: Icon, label, value, href, sub }) => (
              <div key={label} className="border border-white/10 bg-white/[0.04] p-4 clip-panel">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center border border-volt/30 bg-volt/10 text-volt clip-panel">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ignition">{label}</p>
                    {href ? (
                      <a href={href} className="mt-0.5 text-sm font-bold text-white hover:text-volt transition">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm font-bold text-white">{value}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">{sub}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Socials */}
            <div className="border border-white/10 bg-white/[0.04] p-4 clip-panel">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Follow Us</p>
              <div className="flex gap-2">
                {socials.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center border border-white/10 text-slate-400 clip-panel hover:border-volt/40 hover:text-volt transition"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="border border-white/10 bg-white/[0.04] p-5 clip-panel sm:p-7">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <CheckCircle className="h-12 w-12 text-volt" />
                <h2 className="text-xl font-black uppercase text-white">Message Received!</h2>
                <p className="max-w-xs text-sm text-slate-400">
                  আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব। ধন্যবাদ!
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-2 border border-white/10 px-6 py-2.5 text-xs font-black uppercase text-slate-300 clip-panel hover:border-volt/30 hover:text-volt transition"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-ignition">What We Offer</p>
                  <h2 className="text-xl font-black uppercase text-white">Send a Message</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Full Name <span className="text-ignition">*</span>
                    </label>
                    <input
                      name="name"
                      required
                      placeholder="Your name"
                      className="border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-volt/40 clip-panel transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Phone <span className="text-ignition">*</span>
                    </label>
                    <input
                      name="phone"
                      required
                      type="tel"
                      placeholder="+880..."
                      className="border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-volt/40 clip-panel transition"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-volt/40 clip-panel transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Topic</label>
                  <select
                    name="intent"
                    className="border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none focus:border-volt/40 clip-panel transition"
                  >
                    <option value="buy_bike">Buying a Bike</option>
                    <option value="buy_part">Spare Parts Inquiry</option>
                    <option value="service">Service / Repair</option>
                    <option value="finance">Finance / EMI</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us how we can help..."
                    className="border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-volt/40 clip-panel transition resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-ignition">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center justify-center gap-2 bg-volt px-6 py-4 text-sm font-black uppercase text-asphalt clip-panel hover:bg-volt/90 active:scale-95 transition disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

    </main>
  )
}
