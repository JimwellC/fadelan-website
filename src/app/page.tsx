import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch, urlFor, bagImageUrl } from '@/lib/sanity'
import { HOMEPAGE_QUERY } from '@/lib/queries'
import type { BagListItem, SiteSettings } from '@/lib/queries'
import BagCard from '@/components/ui/BigCard'
import HeroSocials from '@/components/ui/HeroSocials'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { BRAND_LABELS } from '@/lib/sanity'

interface HomepageData {
  settings: Pick<SiteSettings, 'heroHeadline' | 'heroSubline' | 'tagline'> & {
    featuredBags?: BagListItem[]
    heroImage?: {
      asset: {
        _id:      string
        url:      string
        metadata: { dimensions: { width: number; height: number }; lqip: string }
      }
    }
  }
  fallbackBags: BagListItem[]
}

const stats = [
  { number: '100%', label: 'Authenticated' },
  { number: 'PH',   label: 'Based locally' },
]

const steps = [
  { step: '01', title: 'Browse',  body: 'Find a bag you love. Read the condition notes — we photograph every flaw honestly.' },
  { step: '02', title: 'Inquire', body: 'Message us on Instagram or Viber. We reply within the day.' },
  { step: '03', title: 'Reserve', body: 'Send a down payment to hold your bag. It comes off the market immediately.' },
  { step: '04', title: 'Receive', body: 'Pay the balance, choose pickup in Pampanga or nationwide shipping.' },
]

const brands = [
  'Chanel', 'Louis Vuitton', 'Hermès', 'Gucci',
  'Dior', 'Celine', 'Prada', 'Bottega Veneta',
  'Loewe', 'Balenciaga', 'Fendi', 'Givenchy',
]
export const revalidate = 0

export default async function HomePage() {
  const data = await sanityFetch<HomepageData>(HOMEPAGE_QUERY)

  const headline = data?.settings?.heroHeadline ?? 'Curated\npre-loved\nluxury.'
  const subline  = data?.settings?.heroSubline  ?? 'Each piece authenticated, priced fairly, and ready to find its next chapter.'
  const bags     = data?.settings?.featuredBags?.length
    ? data.settings.featuredBags
    : data?.fallbackBags ?? []

  const heroBag = bags.find(b => b.availability === 'available') ?? bags[0] ?? null

  const heroImageAsset = (data?.settings as any)?.heroImage?.asset
  const heroCoverUrl = heroImageAsset
    ? bagImageUrl(heroImageAsset)
    : heroBag?.coverPhoto?.asset
      ? bagImageUrl(heroBag.coverPhoto.asset)
      : null

  const heroBlur = heroImageAsset?.metadata?.lqip
    ?? heroBag?.coverPhoto?.asset?.metadata?.lqip
    ?? undefined

  return (
    <>

      {/* ══════════════════════════════════════════════════════════════════
          HERO — no scroll reveal, above the fold
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{
        position:        'relative',
        backgroundColor: '#1C1714',
        minHeight:       '100svh',
        display:         'flex',
        flexDirection:   'column',
        overflow:        'hidden',
      }}>
        <div style={{ position: 'absolute', left: '-20%', bottom: '-20%', width: 'clamp(500px, 90vw, 1100px)', height: 'clamp(500px, 90vw, 1100px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,111,71,0.35) 0%, rgba(139,111,71,0.12) 35%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '5%', top: '-5%', width: 'clamp(400px, 55vw, 700px)', height: 'clamp(400px, 55vw, 700px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,111,71,0.25) 0%, rgba(101,79,46,0.08) 45%, transparent 68%)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '25%', top: '30%', width: 'clamp(300px, 40vw, 560px)', height: 'clamp(300px, 40vw, 560px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,111,71,0.2) 0%, transparent 58%)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '-10%', top: '15%', width: 'clamp(300px, 45vw, 600px)', height: 'clamp(300px, 45vw, 600px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,111,71,0.15) 0%, transparent 58%)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '35%', top: '-15%', width: 'clamp(300px, 40vw, 560px)', height: 'clamp(300px, 40vw, 560px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,111,71,0.18) 0%, transparent 55%)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to bottom, rgba(28,23,20,0.95) 0%, rgba(28,23,20,0.4) 60%, transparent 100%)', zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, rgba(28,23,20,0.95) 0%, rgba(28,23,20,0.4) 60%, transparent 100%)', zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '30%', background: 'linear-gradient(to left, rgba(28,23,20,0.7) 0%, transparent 100%)', zIndex: 1, pointerEvents: 'none' }} />

        {/* Mobile layout */}
        <div className="hide-on-desktop" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minHeight: '100svh' }}>
          {heroCoverUrl && (
            <div style={{ position: 'relative' }}>
              <img src={heroCoverUrl} alt={heroBag?.name ?? 'Featured bag'} style={{ width: '100%', height: 'auto', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top, #1C1714 0%, transparent 100%)', pointerEvents: 'none' }} />
            </div>
          )}
          <div style={{ padding: '0 1.5rem 4rem', marginTop: heroCoverUrl ? '-4rem' : '6rem', position: 'relative', zIndex: 2 }}>
            {!heroImageAsset && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '1.5rem', height: '1px', backgroundColor: 'var(--color-bronze)', opacity: 0.5 }} />
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(245,241,236,0.38)' }}>New arrivals</p>
              </div>
            )}
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.01em', margin: 0, marginBottom: '1.25rem' }}>
              <span style={{ display: 'block', fontSize: 'clamp(3rem, 13vw, 4.5rem)', color: 'var(--color-bronze)' }}>Curated</span>
              <span style={{ display: 'block', fontSize: 'clamp(3rem, 13vw, 4.5rem)', color: 'var(--color-bronze)' }}>pre-loved</span>
              <span style={{ display: 'block', fontSize: 'clamp(3rem, 13vw, 4.5rem)', fontStyle: 'italic', color: 'rgba(245,241,236,0.88)' }}>luxury.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', lineHeight: 1.8, color: 'rgba(245,241,236,0.5)', marginBottom: '2rem', maxWidth: '280px' }}>{subline}</p>
            <Link href="/catalog" className="btn-hero" style={{ alignSelf: 'flex-start' }}>Shop Collection</Link>
            {!heroImageAsset && heroBag && (
              <div style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'rgba(28,23,20,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(139,111,71,0.2)', padding: '0.5rem 0.875rem' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-bronze)' }}>{BRAND_LABELS[heroBag.brand] ?? heroBag.brand}</span>
                <span style={{ color: 'rgba(245,241,236,0.15)', fontSize: '0.7rem' }}>/</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 300, color: 'rgba(245,241,236,0.5)', letterSpacing: '0.02em' }}>{heroBag.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="show-on-desktop" style={{ position: 'relative', zIndex: 2, width: '100%', flex: 1, flexDirection: 'column', minHeight: '100svh' }}>
          {heroCoverUrl ? (
            <div style={{ position: 'absolute', left: 0, bottom: 0, width: 'clamp(380px, 52vw, 720px)', height: '90%', borderTopRightRadius: 'clamp(120px, 18vw, 260px)', overflow: 'hidden', border: '1px solid rgba(139,111,71,0.35)', outline: '1px solid rgba(139,111,71,0.15)', outlineOffset: '6px' }}>
              <Image src={heroCoverUrl} alt={heroBag?.coverPhoto?.alt ?? heroBag?.name ?? 'Featured bag'} fill priority sizes="52vw" style={{ objectFit: 'contain', objectPosition: 'center bottom' }} placeholder={heroBag?.coverPhoto?.asset?.metadata?.lqip ? 'blur' : 'empty'} blurDataURL={heroBlur} />
            </div>
          ) : (
            <div style={{ position: 'absolute', left: 0, bottom: 0, width: 'clamp(300px, 42vw, 580px)', height: '95%', borderTopRightRadius: 'clamp(120px, 18vw, 260px)', overflow: 'hidden', border: '1px solid rgba(139,111,71,0.35)', outline: '1px solid rgba(139,111,71,0.15)', outlineOffset: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="100" height="136" viewBox="0 0 120 160" fill="none" opacity={0.2}><path d="M28 56 Q28 20 60 20 Q92 20 92 56 L100 136 Q101 146 90 146 L30 146 Q19 146 20 136Z" stroke="#8B6F47" strokeWidth="1.5" fill="none"/><path d="M40 56 Q40 10 60 10 Q80 10 80 56" stroke="#8B6F47" strokeWidth="1.5" fill="none" strokeLinecap="round"/><rect x="50" y="90" width="20" height="14" rx="2" stroke="#8B6F47" strokeWidth="1" fill="none"/><circle cx="60" cy="97" r="4" stroke="#8B6F47" strokeWidth="1" fill="none"/></svg>
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, #1C1714 0%, transparent 100%)', zIndex: 1, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', flexDirection: 'column', paddingTop: 'clamp(5rem, 10vw, 8rem)', paddingBottom: 'clamp(4rem, 8vw, 6rem)', paddingLeft: 'clamp(2rem, 5vw, 5rem)', paddingRight: 'clamp(2rem, 5vw, 5rem)', minHeight: '100svh', justifyContent: 'center' }}>
            {!heroImageAsset && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '2rem', marginLeft: 'clamp(320px, 50vw, 700px)' }}>
                <div style={{ width: '2rem', height: '1px', backgroundColor: 'var(--color-bronze)', opacity: 0.5 }} />
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(245,241,236,0.4)' }}>New arrivals</p>
              </div>
            )}
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: '2.5rem', paddingLeft: 'clamp(260px, 38vw, 540px)' }}>
              <span style={{ display: 'block', fontSize: 'clamp(4rem, 9.5vw, 8.5rem)', color: 'var(--color-bronze)' }}>Curated</span>
              <span style={{ display: 'block', fontSize: 'clamp(4rem, 9.5vw, 8.5rem)', color: 'var(--color-bronze)', paddingLeft: 'clamp(1rem, 4vw, 4rem)' }}>pre-loved</span>
              <span style={{ display: 'block', fontSize: 'clamp(4rem, 9.5vw, 8.5rem)', fontStyle: 'italic', color: 'rgba(245,241,236,0.9)', paddingLeft: 'clamp(2rem, 8vw, 8rem)' }}>luxury.</span>
            </h1>
            <div style={{ marginLeft: 'clamp(320px, 50vw, 700px)', maxWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.85, color: 'rgba(245,241,236,0.65)', marginBottom: '2.25rem' }}>{subline}</p>
              <Link href="/catalog" className="btn-hero">Shop Collection</Link>
              {!heroImageAsset && heroBag && (
                <div style={{ marginTop: '2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'rgba(28,23,20,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(139,111,71,0.2)', padding: '0.625rem 1rem' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-bronze)' }}>{BRAND_LABELS[heroBag.brand] ?? heroBag.brand}</span>
                  <span style={{ color: 'rgba(245,241,236,0.15)', fontSize: '0.7rem' }}>/</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 300, color: 'rgba(245,241,236,0.5)', letterSpacing: '0.02em' }}>{heroBag.name}</span>
                </div>
              )}
            </div>
          </div>
          <div style={{ position: 'absolute', top: '22%', right: '14%', color: 'var(--color-bronze)', opacity: 0.35, zIndex: 2 }}>
            <svg width="48" height="48" viewBox="0 0 40 40" fill="currentColor"><path d="M20 0 L22 18 L40 20 L22 22 L20 40 L18 22 L0 20 L18 18 Z"/><path d="M32 4 L33 11 L40 12 L33 13 L32 20 L31 13 L24 12 L31 11 Z" opacity="0.5"/></svg>
          </div>
          <HeroSocials />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          BRAND MARQUEE — no reveal (immediate after hero)
      ══════════════════════════════════════════════════════════════════ */}
      <div style={{ backgroundColor: 'var(--color-ink)', padding: '0.875rem 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', gap: '3rem', animation: 'marquee 22s linear infinite' }}>
          {[...brands, ...brands].map((brand, i) => (
            <span key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--color-bronze)', letterSpacing: '0.1em', display: 'inline-flex', alignItems: 'center', gap: '3rem' }}>
              {brand}
              <span style={{ display: 'inline-block', width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'rgba(139,111,71,0.4)' }} />
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          EDITORIAL INTRO — scroll reveal
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--color-cream)', padding: 'clamp(3rem, 8vw, 7rem) 0', overflow: 'hidden' }}>
        <div className="container-site">

          <ScrollReveal>
            <div className="editorial-headline">
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ display: 'inline-block', width: '1.5rem', height: '1px', backgroundColor: 'var(--color-muted)', opacity: 0.5 }} />
                Our promise
              </p>
              <h2 style={{ fontFamily: 'var(--font-hero)', fontWeight: 400, fontSize: 'clamp(1.75rem, 7vw, 5rem)', lineHeight: 1.0, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--color-ink)', margin: 0 }}>
                Timeless.<br />Sophisticated.<br />
                <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(1.5rem, 6vw, 4.25rem)', fontWeight: 300, color: 'var(--color-bronze)', letterSpacing: '0.02em', textTransform: 'none' }}>Pre-loved luxury.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="editorial-grid">
            <ScrollReveal delay={100}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '0 auto', width: '100%', maxWidth: '480px' }}>
                <p className="hidden lg:block" style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)', writingMode: 'vertical-rl' as const, transform: 'rotate(180deg)', opacity: 0.5, alignSelf: 'flex-start' }}>Fadelan — Pre-loved Luxury</p>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-ink)', marginBottom: '0.75rem' }}>About Fadelan</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', lineHeight: 1.8, color: 'var(--color-muted)' }}>Every bag carries provenance — sourced with care, verified for authenticity, and priced for the next collector who will love it as much as the last.</p>
                </div>
                <Link href="/about" style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--color-bronze)', textDecoration: 'none', letterSpacing: '0.03em' }}>( Learn more about us )</Link>
                <div className="lg:hidden" style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {stats.map((stat) => (
                    <div key={stat.label} style={{ textAlign: 'center' }}>
                      <p style={{ fontFamily: 'var(--font-hero)', fontSize: 'clamp(1.5rem, 6vw, 2.25rem)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1, marginBottom: '0.25rem' }}>{stat.number}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} className="hidden lg:block">
              <div style={{ margin: '0 auto', width: '100%', maxWidth: '480px', overflow: 'hidden' }}>
                {heroCoverUrl ? (
                  <img src={heroCoverUrl} alt={heroBag?.name ?? 'Featured bag'} style={{ width: '100%', height: 'auto', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '4 / 5', backgroundColor: 'var(--color-cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="80" height="110" viewBox="0 0 120 160" fill="none" opacity={0.2}><path d="M28 56 Q28 20 60 20 Q92 20 92 56 L100 136 Q101 146 90 146 L30 146 Q19 146 20 136Z" stroke="#8B6F47" strokeWidth="1.5" fill="none"/><path d="M40 56 Q40 10 60 10 Q80 10 80 56" stroke="#8B6F47" strokeWidth="1.5" fill="none" strokeLinecap="round"/><rect x="50" y="90" width="20" height="14" rx="2" stroke="#8B6F47" strokeWidth="1" fill="none"/><circle cx="60" cy="97" r="4" stroke="#8B6F47" strokeWidth="1" fill="none"/></svg>
                  </div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300} className="hidden lg:flex">
              <div style={{ flexDirection: 'column', gap: '2.5rem', paddingTop: '0.5rem', alignItems: 'center', display: 'flex' }}>
                {stats.map((stat) => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-hero)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1, marginBottom: '0.375rem' }}>{stat.number}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-muted)', lineHeight: 1.5 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CATALOG GRID — scroll reveal per card
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0 clamp(4rem, 8vw, 6rem)', backgroundColor: '#EDE6DC' }}>
        <div className="container-site">

          <ScrollReveal>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(26,26,26,0.08)', gap: '1rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 300, color: 'var(--color-ink)', letterSpacing: '-0.01em' }}>Current Collection</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {bags.length > 0 && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{bags.length} Pieces</span>}
                <Link href="/catalog" style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--color-bronze)', textDecoration: 'none' }}>( Shop Collection )</Link>
              </div>
            </div>
          </ScrollReveal>

          {bags.length > 0 ? (
            <div className="catalog-grid">
              {bags.slice(0, 8).map((bag, i) => (
                <ScrollReveal key={bag._id} delay={i * 60}>
                  <BagCard bag={bag} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <div style={{ textAlign: 'center', padding: '5rem 0', fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 300, color: 'var(--color-muted)' }}>
                The catalog is being curated. Check back soon.
              </div>
            </ScrollReveal>
          )}

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          PROCESS SECTION — scroll reveal
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--color-cream)', padding: 'clamp(4rem, 8vw, 7rem) 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container-site">

          <ScrollReveal>
            <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-bronze)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ display: 'inline-block', width: '1.5rem', height: '1px', backgroundColor: 'var(--color-bronze)' }} />
                4 Simple Steps
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.01em', color: 'var(--color-ink)', margin: 0, maxWidth: '520px' }}>
                Every bag has a{' '}<em style={{ fontStyle: 'italic', color: 'var(--color-bronze)' }}>story</em>{' '}worth telling twice.
              </h2>
            </div>
            <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(26,26,26,0.08)', marginBottom: 'clamp(2rem, 4vw, 3rem)' }} />
          </ScrollReveal>

          <div className="process-steps-layout" style={{ position: 'relative', gap: '1rem' }}>
            {steps.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 80}>
                <div className="process-step-item">
                  <p className="step-number" style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.12em', lineHeight: 1, marginBottom: '1.25rem' }}>{step.step}.</p>
                  <p className="step-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', fontWeight: 400, marginBottom: '0.875rem', letterSpacing: '0.01em', lineHeight: 1.2 }}>{step.title}</p>
                  <p className="step-body" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', lineHeight: 1.8, maxWidth: '220px' }}>{step.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={100}>
            <div style={{ marginTop: 'clamp(2.5rem, 5vw, 4rem)', paddingTop: 'clamp(1.5rem, 3vw, 2.5rem)', borderTop: '1px solid rgba(26,26,26,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-muted)', letterSpacing: '0.02em' }}>Questions? We reply the same day.</p>
              <Link href="/contact" className="process-cta" style={{ display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-ink)', border: '1px solid rgba(26,26,26,0.25)', padding: '0.75rem 1.75rem', textDecoration: 'none', transition: 'all 400ms ease' }}>Send an Inquiry</Link>
            </div>
          </ScrollReveal>

        </div>
      </section>
    </>
  )
}

function HeroBadge({ availability }: { availability: string }) {
  const config: Record<string, { label: string; color: string }> = {
    available: { label: 'Available Now', color: 'rgba(21,128,61,0.85)'   },
    reserved:  { label: 'Reserved',      color: 'rgba(217,119,6,0.85)'   },
    on_hold:   { label: 'On Hold',        color: 'rgba(234,88,12,0.85)'   },
    sold:      { label: 'Sold',           color: 'rgba(115,114,110,0.85)' },
  }
  const { label, color } = config[availability] ?? config.available
  return (
    <div style={{ display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-cream)', backgroundColor: color, padding: '0.3rem 0.75rem' }}>
      {label}
    </div>
  )
}