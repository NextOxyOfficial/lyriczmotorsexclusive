import Link from 'next/link'
import { Facebook, Instagram, MapPin, Phone, Youtube, Zap } from 'lucide-react'

const quickLinks = [
  { label: 'Bikes', href: '/#garage' },
  { label: 'Spare Parts', href: '/spare-parts' },
  { label: 'Service', href: '/#service' },
  { label: 'Book a Slot', href: '/#book' },
  { label: 'Checkout', href: '/checkout' },
]

const socials = [
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-pitlane text-slate-400">

      {/* ── Mobile CTA strip ── */}
      <div className="border-b border-white/10 sm:hidden">
        <a
          href="tel:+8801700000000"
          className="flex items-center justify-center gap-3 bg-volt/10 px-4 py-4 text-sm font-black uppercase tracking-[0.18em] text-volt active:bg-volt/20"
        >
          <Phone className="h-4 w-4" /> Call / WhatsApp
        </a>
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

        {/* Brand row */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Lyricz Motors home">
            <span className="flex h-9 w-9 items-center justify-center border border-volt/40 bg-volt/10 text-volt clip-panel">
              <Zap className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-black uppercase tracking-[0.28em] text-white">Lyricz</span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-volt">Motors Exclusive</span>
            </span>
          </Link>
          {/* Social icons — visible on all sizes */}
          <div className="flex items-center gap-2">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-slate-400 clip-panel hover:border-volt/40 hover:text-volt transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links — horizontal scroll on mobile, grid on desktop */}
        <nav className="mt-7">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Quick Links</p>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
            {quickLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex-shrink-0 border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-300 clip-panel hover:border-volt/30 hover:text-volt transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Address + phone — desktop only (mobile has the CTA strip above) */}
        <div className="mt-7 hidden items-center gap-6 text-sm sm:flex">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-volt" /> Dhaka, Bangladesh
          </span>
          <span className="h-4 w-px bg-white/10" />
          <a href="tel:+8801700000000" className="flex items-center gap-2 hover:text-volt transition">
            <Phone className="h-4 w-4 text-volt" /> +880 17XX-XXXXXX
          </a>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-5 text-[11px] sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Lyricz Motors Exclusive. All rights reserved.</p>
          <p className="text-slate-600">Premium Garage Console &bull; Dhaka, BD</p>
        </div>
      </div>
    </footer>
  )
}
