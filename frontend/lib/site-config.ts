/**
 * Central site configuration.
 * To update logo: replace /public/logo.png
 * To update favicon: replace /public/favicon.ico  (or favicon.png)
 * Change logoSrc to null to fall back to the icon-based text logo.
 */
const siteConfig = {
  name: 'Lyricz Motors Exclusive',
  tagline: 'Motors Exclusive',
  shortName: 'Lyricz',

  /** Path relative to /public. Set to null to use the fallback icon logo. */
  logoSrc: '/logo.png' as string | null,

  /** Alt text for the logo image */
  logoAlt: 'Lyricz Motors Exclusive',

  /** Favicon paths (placed in /public) */
  faviconIco: '/favicon.ico',
  faviconPng: '/favicon.png',

  /** Open Graph / social sharing image */
  ogImage: '/og-image.png',
}

export default siteConfig
