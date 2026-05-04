import Link from 'next/link'
import { Facebook, Heart, Instagram, MapPin, Phone, Youtube } from 'lucide-react'
import SiteLogo from '@/components/SiteLogo'
import type { SiteSettings } from '@/lib/site-settings'

const quickLinks = [
  { label: 'Bikes', href: '/bikes' },
  { label: 'Spare Parts', href: '/spare-parts' },
  { label: 'Service', href: '/service' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book a Slot', href: '/#book' },
]

interface FooterProps {
  siteSettings?: SiteSettings
}

export default function Footer({ siteSettings }: FooterProps) {
  const phone = siteSettings?.phone || '+880 17XX-XXXXXX'
  const whatsapp = siteSettings?.whatsapp || phone
  const address = siteSettings?.address || 'Dhaka, Bangladesh'
  const year = new Date().getFullYear()
  const copyright = siteSettings?.copyright_text || `© ${year} ${siteSettings?.site_name ?? 'Lyricz Motors Exclusive'}. All rights reserved.`

  const socials = [
    siteSettings?.facebook_url && { label: 'Facebook', href: siteSettings.facebook_url, icon: Facebook },
    siteSettings?.instagram_url && { label: 'Instagram', href: siteSettings.instagram_url, icon: Instagram },
    siteSettings?.youtube_url && { label: 'YouTube', href: siteSettings.youtube_url, icon: Youtube },
  ].filter(Boolean) as { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[]

  const displaySocials = socials.length > 0 ? socials : [
    { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
    { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
    { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
  ]
  return (
    <footer className="border-t border-white/10 bg-pitlane text-slate-400">

      {/* ── Mobile CTA strip ── */}
      <div className="border-b border-white/10 sm:hidden">
        <a
          href={`tel:${phone.replace(/\s/g, '')}`}
          className="flex items-center justify-center gap-3 bg-volt/10 px-4 py-4 text-sm font-black uppercase tracking-[0.18em] text-volt active:bg-volt/20"
        >
          <Phone className="h-4 w-4" /> Call / WhatsApp
        </a>
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

        {/* Brand row */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="Lyricz Motors home">
            <SiteLogo
              siteName={siteSettings?.site_name}
              tagline={siteSettings?.tagline}
              logoUrl={siteSettings?.logo_url || undefined}
            />
          </Link>
          {/* Social icons */}
          <div className="flex items-center gap-2">
            {displaySocials.map(({ label, href, icon: Icon }) => (
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

        {/* Quick links — wrapping grid */}
        <nav className="mt-7">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Quick Links</p>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-300 clip-panel hover:border-volt/30 hover:text-volt transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Address + phone — desktop only */}
        <div className="mt-7 hidden items-center gap-6 text-sm sm:flex">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-volt" /> {address}
          </span>
          <span className="h-4 w-px bg-white/10" />
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-volt transition">
            <Phone className="h-4 w-4 text-volt" /> {phone}
          </a>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-5 text-[11px] sm:flex-row">
          <p>{copyright}</p>
          <p className="flex items-center gap-1 text-slate-500">
            Developed with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> by Lyricz Softwares &amp; Technology Limited
          </p>
        </div>
      </div>
    </footer>
  )
}
