import Link from 'next/link'
import { Facebook, Instagram, MapPin, Phone, Youtube, Zap } from 'lucide-react'

const footerLinks = {
  Shop: [
    { label: 'Bikes', href: '/#garage' },
    { label: 'Spare Parts', href: '/spare-parts' },
    { label: 'Service Packages', href: '/#service' },
  ],
  Company: [
    { label: 'Book a Slot', href: '/#book' },
    { label: 'Contact', href: '/#book' },
    { label: 'Checkout', href: '/checkout' },
  ],
}

const socials = [
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-pitlane text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Lyricz Motors home">
              <span className="flex h-10 w-10 items-center justify-center border border-volt/40 bg-volt/10 text-volt clip-panel">
                <Zap className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-black uppercase tracking-[0.28em] text-white">Lyricz</span>
                <span className="block text-xs uppercase tracking-[0.22em] text-volt">Motors Exclusive</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7">
              Premium bikes, performance spare parts, and a full-service workshop — built for serious riders who demand more from their machine and buying experience.
            </p>
            <div className="mt-5 flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-volt" />
              <span>Dhaka, Bangladesh</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 flex-shrink-0 text-volt" />
              <a href="tel:+8801700000000" className="hover:text-white">+880 17XX-XXXXXX</a>
            </div>
            {/* Social */}
            <div className="mt-5 flex items-center gap-3">
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

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-white">{section}</p>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm hover:text-volt transition">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Lyricz Motors Exclusive. All rights reserved.</p>
          <p className="text-slate-600">Premium Garage Console &bull; Dhaka, Bangladesh</p>
        </div>
      </div>
    </footer>
  )
}
