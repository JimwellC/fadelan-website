import { sanityFetch } from '@/lib/sanity'
import { SITE_SETTINGS_QUERY, ALL_BAGS_DROPDOWN_QUERY } from '@/lib/queries'
import type { SiteSettings, BagDropdownItem } from '@/lib/queries'
import ContactHero from '@/components/contact/ContactHero'
import ContactChannels from '@/components/contact/ContactChannels'
import ContactInquiryForm from '@/components/contact/ContactInquiryForm'
import AboutCta from '@/components/about/AboutCta'

export const metadata = {
  title: 'Contact — Fadelan',
  description: 'Get in touch with Fadelan — ask about a bag, reserve a piece, or arrange an in-person viewing.',
}

export default async function ContactPage() {
  const [settings, bags] = await Promise.all([
    sanityFetch<SiteSettings>(SITE_SETTINGS_QUERY),
    sanityFetch<BagDropdownItem[]>(ALL_BAGS_DROPDOWN_QUERY),
  ])

  return (
    <main className="min-h-screen bg-[#F5F1EC]">
      <ContactHero />

      <div className="bg-[#F5F1EC]">
        <div className="mx-auto w-full px-6 md:max-w-[70%] md:px-0">
          <ContactChannels
            instagramHandle={settings.instagramHandle}
            contactEmail={settings.contactEmail}
            viberNumber={settings.viberNumber}
            locationDescription={settings.locationDescription}
          />
        </div>
      </div>

      <div className="bg-[#EDE6DC]">
        <div className="mx-auto w-full px-6 md:max-w-[70%] md:px-0">
          <ContactInquiryForm bags={bags} />
        </div>
      </div>

      <AboutCta
        headline="Ready to find your next piece?"
        body="Browse our current selection of authenticated pre-loved luxury bags — each one curated, verified, and one of a kind."
      />
    </main>
  )
}