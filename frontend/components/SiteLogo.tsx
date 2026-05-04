'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Zap } from 'lucide-react'

interface SiteLogoProps {
  className?: string
  showText?: boolean
  siteName?: string
  tagline?: string
  logoUrl?: string
}

export default function SiteLogo({
  className = '',
  showText = true,
  siteName = 'Lyricz Motors',
  tagline = 'Ride the Future',
  logoUrl,
}: SiteLogoProps) {
  const [imgError, setImgError] = useState(false)
  const useImage = Boolean(logoUrl) && !imgError

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      {useImage ? (
        <Image
          src={logoUrl!}
          alt={siteName}
          width={120}
          height={40}
          className="h-10 w-auto object-contain"
          onError={() => setImgError(true)}
          priority
          unoptimized
        />
      ) : (
        <>
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-volt/40 bg-volt/10 text-volt clip-panel">
            <Zap className="h-5 w-5" />
          </span>
          {showText && (
            <span className="leading-tight">
              <span className="block text-sm font-black tracking-[0.1em] text-white">
                {siteName}
              </span>
              <span className="block text-xs tracking-[0.14em] text-volt">
                {tagline}
              </span>
            </span>
          )}
        </>
      )}
    </span>
  )
}
