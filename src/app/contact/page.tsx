import { sanityFetch } from '@/lib/sanity'
import { SITE_SETTINGS_QUERY, ALL_BAGS_DROPDOWN_QUERY } from '@/lib/queries'
import type { SiteSettings, BagDropdownItem } from '@/lib/queries'
import ContactHero from '@/components/contact/ContactHero'
import ContactChannels from '@/components/contact/ContactChannels'
import ContactInquiryForm from '@/components/contact/ContactInquiryForm'
import AboutCta from '@/components/about/AboutCta'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const metadata = {
  title: 'Contact — Fadelan',
  description: 'Get in touch with Fadelan — ask about a bag, reserve a piece, or arrange an in-person viewing.',
}

export const revalidate = 0

export default async function ContactPage() {
  const [settings, bags] = await Promise.all([
    sanityFetch<SiteSettings>(SITE_SETTINGS_QUERY),
    sanityFetch<BagDropdownItem[]>(ALL_BAGS_DROPDOWN_QUERY),
  ])

  return (
    <main className="min-h-screen bg-[#F5F1EC]">
      <ContactHero />

      <ScrollReveal>
        <div className="bg-[#F5F1EC]">
          {/* Was md:max-w-[70%] only — too narrow on tablet. Tablet (md:)
             now gets a wider 90% cap; desktop (xl:, 1280px+) keeps the
             original 70%, matching the CtaBanner/AboutStats/about-page
             pattern used elsewhere in the codebase. */}
          <div className="mx-auto w-full px-6 md:max-w-[90%] md:px-0 xl:max-w-[70%]">
            <ContactChannels
              instagramHandle={settings.instagramHandle}
              smsNumber={settings.smsNumber}
              locationDescription={settings.locationDescription}
            />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="bg-[#EDE6DC]">
          {/* Same fix — was md:max-w-[70%] only. */}
          <div className="mx-auto w-full px-6 md:max-w-[90%] md:px-0 xl:max-w-[70%]">
            <ContactInquiryForm bags={bags} />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={50}>
        <AboutCta
          headline="Ready to find your next piece?"
          body="Browse our current selection of authenticated pre-loved luxury bags — each one curated, verified, and one of a kind."
        />
      </ScrollReveal>
    </main>
  )
}