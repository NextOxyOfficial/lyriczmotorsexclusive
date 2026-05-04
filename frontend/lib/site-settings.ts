const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

export interface SiteSettings {
  site_name: string
  tagline: string
  meta_description: string
  logo_url: string
  favicon_url: string
  og_image_url: string
  phone: string
  whatsapp: string
  email: string
  address: string
  facebook_url: string
  instagram_url: string
  youtube_url: string
  tiktok_url: string
  twitter_url: string
  copyright_text: string
}

const FALLBACK: SiteSettings = {
  site_name: 'Lyricz Motors Exclusive',
  tagline: 'Ride the Future',
  meta_description: 'Premium bikes, performance spare parts, and service center bookings.',
  logo_url: '',
  favicon_url: '',
  og_image_url: '',
  phone: '+880 17XX-XXXXXX',
  whatsapp: '',
  email: '',
  address: 'Dhaka, Bangladesh',
  facebook_url: 'https://facebook.com',
  instagram_url: 'https://instagram.com',
  youtube_url: 'https://youtube.com',
  tiktok_url: '',
  twitter_url: '',
  copyright_text: '',
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API}/site-settings/`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return FALLBACK
    return await res.json()
  } catch {
    return FALLBACK
  }
}
