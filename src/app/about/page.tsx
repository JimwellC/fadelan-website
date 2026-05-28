// app/about/page.tsx
// Server component — no "use client"
//
// TODO (after Jimwell sets up Sanity):
//   1. Import ABOUT_QUERY from "@/lib/queries"
//   2. Import AboutQueryResult from "@/lib/sanity.types"
//   3. Import sanityFetch from "@/lib/sanity"
//   4. Replace STATIC_DATA with: const data = await sanityFetch<AboutQueryResult>(ABOUT_QUERY)
//   5. Pass data fields as props instead of STATIC_DATA fields

import AboutHero from '@/components/about/AboutHero'
import AboutQuote from '@/components/about/AboutQuote'
import AboutStory from '@/components/about/AboutStory'
import AboutStats from '@/components/about/AboutStats'
import AboutPromises from '@/components/about/AboutPromises'
import AboutCta from '@/components/about/AboutCta'

const STATIC_DATA = {
  heroIntro:
    'Fadelan was born from a belief that exceptional bags deserve a second life — and that the women who carry them deserve complete confidence in every piece.',

  quote:
    'Every bag has been somewhere. We make sure its next chapter is just as beautiful.',
  quoteAttribution: '— Fadelan, est. 2023',

  storyHeadline: 'From passion to purpose',
  storyBody:
    'What started as a personal obsession with heritage leather goods grew into something larger. We saw a gap between the pre-loved market and the luxury standard our clients expected — so we built the bridge ourselves.\n\nEvery bag in our catalog has passed through our hands, our eyes, and our judgment. Nothing less.',

  stats: [
    {
      value: '500+',
      label: 'Bags authenticated',
      description: 'Every piece personally verified before it reaches the catalog.',
    },
    {
      value: '98%',
      label: 'Client satisfaction',
      description: 'Our clients return — and they send their friends.',
    },
    {
      value: '30+',
      label: 'Heritage brands',
      description: 'From Hermès to Celine, we know the houses we carry.',
    },
    {
      value: '3–5d',
      label: 'Avg. response time',
      description: 'White-glove attention, not automated queues.',
    },
  ],

  promises: [
    {
      headline: 'Honest condition grading.',
      body: 'We describe every flaw. Our photos show every angle. You will not be surprised.',
    },
    {
      headline: 'Authentication before listing.',
      body: 'No bag enters the catalog without our full review — hardware, stitching, date codes, and provenance.',
    },
    {
      headline: 'Personal inquiry handling.',
      body: 'Your questions go to a real person who has held the bag. Never a chatbot, never a script.',
    },
    {
      headline: 'Fair pricing, always.',
      body: 'We research the market carefully. Our prices reflect real value — for you and for the pieces we care about.',
    },
  ],

  ctaHeadline: 'Ready to find your next piece?',
  ctaBody:
    'Browse our current selection of authenticated pre-loved luxury bags — each one curated, verified, and one of a kind.',
}

export const metadata = {
  title: 'About — Fadelan',
  description:
    'Learn the story behind Fadelan — a curated pre-loved luxury bag catalog built on authenticity, trust, and a genuine love for heritage leather.',
}

export default function AboutPage() {
  const data = STATIC_DATA

  return (
    <main className="min-h-screen bg-[#F5F1EC]">
      {/* Dark hero — full width */}
      <AboutHero intro={data.heroIntro} />

        {/* Story — full width, internal bg handled by component */}
      <div className="max-w-[70%] mx-auto">
        <AboutStory
          headline={data.storyHeadline}
          body={data.storyBody}
        />
      </div>

      {/* Ivory quote — full width
      <div className="max-w-[70%] mx-auto">
        <AboutQuote
          quote={data.quote}
          attribution={data.quoteAttribution}
        />
      </div> */}

      

      {/* Dark stats band — full width */}
      <AboutStats stats={data.stats} />

      {/* Cream promises — full width */}
      <div className="bg-[#EDE6DC]">
        <div className="max-w-[70%] mx-auto">
          <AboutPromises promises={data.promises} />
        </div>
      </div>

      {/* CTA banner — full width with inner padding */}
      <AboutCta
        headline={data.ctaHeadline}
        body={data.ctaBody}
      />
    </main>
  )
}