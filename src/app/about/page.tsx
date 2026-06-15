import AboutHero     from '@/components/about/AboutHero'
import AboutStory    from '@/components/about/AboutStory'
import AboutStats    from '@/components/about/AboutStats'
import AboutPromises from '@/components/about/AboutPromises'
import AboutCta      from '@/components/about/AboutCta'
import ScrollReveal  from '@/components/ui/ScrollReveal'
import { sanityFetch, bagImageUrl } from '@/lib/sanity'
import { SITE_SETTINGS_QUERY }      from '@/lib/queries'
import type { SiteSettings }        from '@/lib/queries'

const STATIC_DATA = {
  heroIntro:
    'Fadelan was born from a belief that exceptional bags deserve a second life — and that the women who carry them deserve complete confidence in every piece.',
  storyHeadline: 'From passion to purpose',
  storyBody:
    'What started as a personal obsession with heritage leather goods grew into something larger. We saw a gap between the pre-loved market and the luxury standard our clients expected — so we built the bridge ourselves.\n\nEvery bag in our catalog has passed through our hands, our eyes, and our judgment. Nothing less.',
  stats: [
    { value: '500+', label: 'Bags authenticated',  description: 'Every piece personally verified before it reaches the catalog.' },
    { value: '98%',  label: 'Client satisfaction', description: 'Our clients return — and they send their friends.'              },
    { value: '30+',  label: 'Heritage brands',     description: 'From Hermès to Celine, we know the houses we carry.'           },
    { value: '3–5d', label: 'Avg. response time',  description: 'White-glove attention, not automated queues.'                  },
  ],
  promises: [
    { headline: 'Honest condition grading.',      body: 'We describe every flaw. Our photos show every angle. You will not be surprised.'                                      },
    { headline: 'Authentication before listing.', body: 'No bag enters the catalog without our full review — hardware, stitching, date codes, and provenance.'                },
    { headline: 'Personal inquiry handling.',     body: 'Your questions go to a real person who has held the bag. Never a chatbot, never a script.'                           },
    { headline: 'Fair pricing, always.',          body: 'We research the market carefully. Our prices reflect real value — for you and for the pieces we care about.'         },
  ],
  ctaHeadline: 'Ready to find your next piece?',
  ctaBody:     'Browse our current selection of authenticated pre-loved luxury bags — each one curated, verified, and one of a kind.',
}

export const metadata = {
  title:       'About — Fadelan',
  description: 'Learn the story behind Fadelan — a curated pre-loved luxury bag catalog built on authenticity, trust, and a genuine love for heritage leather.',
}

export default async function AboutPage() {
  const settings = await sanityFetch<SiteSettings>(
    SITE_SETTINGS_QUERY,
    {},
    { revalidate: 3600 }
  )

  const ownerPhotoUrl = settings?.ownerPhoto
    ? bagImageUrl(settings.ownerPhoto, { width: 600 })
    : undefined

  const data = STATIC_DATA

  return (
    <main className="min-h-screen bg-[#F5F1EC]">
      <AboutHero intro={data.heroIntro} />

      <ScrollReveal>
        <div className="mx-auto w-full px-0 md:max-w-[70%]">
          <AboutStory
            headline={data.storyHeadline}
            body={data.storyBody}
            ownerPhotoUrl={ownerPhotoUrl}
          />
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <AboutStats stats={data.stats} />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="bg-[#EDE6DC]">
          <div className="mx-auto w-full px-6 md:max-w-[70%] md:px-0">
            <AboutPromises promises={data.promises} />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={50}>
        <AboutCta headline={data.ctaHeadline} body={data.ctaBody} />
      </ScrollReveal>
    </main>
  )
}