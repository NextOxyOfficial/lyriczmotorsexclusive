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
  hero_media_type: 'image' | 'video'
  hero_image_url: string
  hero_video_url: string
  service_hero_media_type: 'image' | 'video'
  service_hero_image_url: string
  service_hero_video_url: string
  modification_hero_media_type: 'image' | 'video'
  modification_hero_image_url: string
  modification_hero_video_url: string
  map_lat: string | null
  map_lng: string | null
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
  hero_media_type: 'image',
  hero_image_url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=2200&q=85',
  hero_video_url: '',
  service_hero_media_type: 'image',
  service_hero_image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=2000&q=85',
  service_hero_video_url: '',
  modification_hero_media_type: 'image',
  modification_hero_image_url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=2000&q=85',
  modification_hero_video_url: '',
  map_lat: null,
  map_lng: null,
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
