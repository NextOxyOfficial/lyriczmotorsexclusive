'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarClock, Menu, ShoppingCart, X } from 'lucide-react'
import { useCart } from '@/lib/cart'
import SiteLogo from '@/components/SiteLogo'
import type { SiteSettings } from '@/lib/site-settings'

const navItems = [
  { label: 'Bikes', href: '/bikes' },
  { label: 'Spare Parts', href: '/spare-parts' },
  { label: 'Service', href: '/service' },
  { label: 'Modification', href: '/modification' },
  { label: 'Contact', href: '/contact' },
]

interface HeaderProps {
  siteSettings?: SiteSettings
}

export default function Header({ siteSettings }: HeaderProps) {
  const { count, openDrawer } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [menuOpen])

  return (
    <header ref={headerRef} className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-asphalt/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" aria-label={`${siteSettings?.site_name ?? 'Lyricz Motors Exclusive'} home`}>
          <SiteLogo
            siteName={siteSettings?.site_name}
            tagline={siteSettings?.tagline}
            logoUrl={siteSettings?.logo_url || undefined}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const active =
              (item.href === '/spare-parts' && pathname === '/spare-parts') ||
              (item.href === '/bikes' && pathname === '/bikes') ||
              (item.href === '/service' && pathname === '/service') ||
              (item.href === '/modification' && pathname === '/modification') ||
              (item.href === '/contact' && pathname === '/contact')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] transition ${
                  active ? 'text-volt' : 'text-slate-300 hover:text-volt'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={openDrawer}
            className="relative flex items-center gap-2 border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white clip-panel transition hover:border-volt/40"
            aria-label={`Open cart — ${count} items`}
          >
            <ShoppingCart className="h-4 w-4 text-boost" />
            <span className={`font-black ${count > 0 ? 'text-ignition' : 'text-slate-300'}`}>{count}</span>
          </button>
          <Link
            href="/#book"
            className="inline-flex items-center gap-2 bg-ignition px-4 py-2 text-sm font-black uppercase text-white clip-panel hover:bg-ignition/90 transition"
          >
            <CalendarClock className="h-4 w-4" /> Book
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={openDrawer}
            className="relative flex items-center gap-1.5 border border-white/10 bg-white/[0.05] px-3 py-2 text-white md:hidden"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-4 w-4 text-boost" />
            <span className={`text-sm font-black ${count > 0 ? 'text-ignition' : 'text-slate-300'}`}>{count}</span>
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center border border-white/15 bg-white/5"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav className="border-t border-white/10 bg-asphalt px-4 py-4 md:hidden" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-200 hover:text-volt"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#book"
            onClick={() => setMenuOpen(false)}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 bg-ignition py-3 text-sm font-black uppercase text-white clip-panel"
          >
            <CalendarClock className="h-4 w-4" /> Book a Service
          </Link>
        </nav>
      )}
    </header>
  )
}
