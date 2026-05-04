import { fetchSiteSettings } from '@/lib/site-settings'
import ContactBody from './ContactBody'

export default async function ContactPage() {
  const settings = await fetchSiteSettings()
  return <ContactBody settings={settings} />
}
