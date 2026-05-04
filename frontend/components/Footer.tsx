import Link from 'next/link'
import { Facebook, Heart, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import SiteLogo from '@/components/SiteLogo'
import type { SiteSettings } from '@/lib/site-settings'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.121 1.535 5.856L.057 23.882a.5.5 0 0 0 .614.635l6.224-1.634A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.953 9.953 0 0 1-5.17-1.438l-.371-.22-3.844 1.01 1.03-3.746-.242-.384A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
  )
}

const quickLinks = [
  { label: 'Bikes', href: '/bikes' },
  { label: 'Spare Parts', href: '/spare-parts' },
  { label: 'Service', href: '/service' },
  { label: 'Modification', href: '/modification' },
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
        <div className="grid grid-cols-2 divide-x divide-white/10">
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="flex items-center justify-center gap-2 bg-volt/10 px-4 py-4 text-xs font-black uppercase tracking-[0.16em] text-volt active:bg-volt/20"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25d366]/10 px-4 py-4 text-xs font-black uppercase tracking-[0.16em] text-[#25d366] active:bg-[#25d366]/20"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-7xl px-2 py-10 sm:px-6 sm:py-12 lg:px-8">

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

        {/* Contact block — single border */}
        <div className="mt-7 border border-white/10 bg-white/[0.03]">
          {/* Phone row */}
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Call &amp; WhatsApp</p>
              <p className="mt-0.5 text-sm font-bold text-slate-200">{phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <a href={`tel:${phone.replace(/\s/g, '')}`} aria-label="Call" className="text-volt hover:text-volt/70 transition">
                <Phone className="h-5 w-5" />
              </a>
              <a href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-[#25d366] hover:text-[#25d366]/70 transition">
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Email row */}
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Support Email</p>
              <p className="mt-0.5 text-sm font-bold text-slate-200">support@lyriczmotors.com</p>
            </div>
            <a href="mailto:support@lyriczmotors.com" aria-label="Email" className="text-boost hover:text-boost/70 transition">
              <Mail className="h-5 w-5" />
            </a>
          </div>

          {/* Address row */}
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Address</p>
              <p className="mt-0.5 text-sm font-bold text-slate-200">{address}</p>
            </div>
            <MapPin className="h-5 w-5 flex-shrink-0 text-volt" />
          </div>
        </div>

        {/* Google Maps embed */}
        {siteSettings?.map_lat && siteSettings?.map_lng && (
          <div className="mt-7 overflow-hidden border border-white/10 clip-panel">
            <iframe
              src={`https://maps.google.com/maps?q=${siteSettings.map_lat},${siteSettings.map_lng}&z=17&output=embed`}
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lyricz Motors location"
            />
            <a
              href={`https://www.google.com/maps?q=${siteSettings.map_lat},${siteSettings.map_lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border-t border-white/10 bg-white/[0.04] py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-300 transition hover:bg-white/[0.08] hover:text-volt"
            >
              <MapPin className="h-3.5 w-3.5" /> Open in Google Maps
            </a>
          </div>
        )}

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
