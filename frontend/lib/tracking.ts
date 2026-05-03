type EventPayload = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
  }
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api'
const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const googleAdsConversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL

export function buildEventId(eventName: string) {
  return `${eventName}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export async function trackMarketingEvent(eventName: string, metadata: EventPayload = {}) {
  if (typeof window === 'undefined') {
    return
  }

  const eventId = buildEventId(eventName)
  const params = new URLSearchParams(window.location.search)
  const payload = {
    event_name: eventName,
    event_id: eventId,
    page_url: window.location.href,
    metadata,
    fbp: getCookie('_fbp'),
    fbc: getCookie('_fbc'),
    gclid: params.get('gclid') || '',
  }

  window.fbq?.('track', eventName, metadata, { eventID: eventId })
  window.gtag?.('event', eventName, metadata)

  if (eventName === 'Lead' && googleAdsId && googleAdsConversionLabel) {
    window.gtag?.('event', 'conversion', {
      send_to: `${googleAdsId}/${googleAdsConversionLabel}`,
      value: metadata.value || 1,
      currency: metadata.currency || 'BDT',
    })
  }

  try {
    await fetch(`${apiBaseUrl}/marketing-events/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  } catch {
    // Browser pixels still run if the backend tracker is unavailable locally.
  }
}

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : ''
}