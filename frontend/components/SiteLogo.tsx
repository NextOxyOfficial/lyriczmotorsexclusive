'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Zap } from 'lucide-react'
import siteConfig from '@/lib/site-config'

interface SiteLogoProps {
  /** Extra classes on the outer wrapper */
  className?: string
  /** Show the text name beside the icon/image */
  showText?: boolean
}

export default function SiteLogo({ className = '', showText = true }: SiteLogoProps) {
  const [imgError, setImgError] = useState(false)
  const useImage = Boolean(siteConfig.logoSrc) && !imgError

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      {useImage ? (
        /* ── Image logo ── */
        <Image
          src={siteConfig.logoSrc!}
          alt={siteConfig.logoAlt}
          width={120}
          height={40}
          className="h-10 w-auto object-contain"
          onError={() => setImgError(true)}
          priority
        />
      ) : (
        /* ── Fallback icon + text logo ── */
        <>
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-volt/40 bg-volt/10 text-volt clip-panel">
            <Zap className="h-5 w-5" />
          </span>
          {showText && (
            <span className="leading-tight">
              <span className="block text-sm font-black uppercase tracking-[0.28em] text-white">
                {siteConfig.shortName}
              </span>
              <span className="block text-xs uppercase tracking-[0.22em] text-volt">
                {siteConfig.tagline}
              </span>
            </span>
          )}
        </>
      )}
    </span>
  )
}
