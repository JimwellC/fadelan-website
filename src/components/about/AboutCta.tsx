import Link from 'next/link'
import ScrollReveal from '../ui/ScrollReveal'

interface AboutCtaProps {
  headline: string
  body: string
}

export default function AboutCta({ headline, body }: AboutCtaProps) {
  return (
    <section className="bg-[#EDE6DC] px-4 py-10 md:px-10 md:py-16">
      <div className="mx-auto w-full md:max-w-[70%]">
        <div
          className="relative overflow-hidden rounded-2xl px-6 py-8 md:px-14 md:py-12"
          style={{ background: '#2C2420' }}
        >
          {/* Glow layers (no animation needed, just visual) */}
          <div className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2">
            <div
              className="h-[300px] w-[300px] rounded-full opacity-20"
              style={{
                background: 'radial-gradient(ellipse, #8B6F47 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
          </div>

          <div className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2">
            <div
              className="h-[300px] w-[300px] rounded-full opacity-20"
              style={{
                background: 'radial-gradient(ellipse, #8B6F47 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
          </div>

          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2">
            <div
              className="h-[200px] w-[200px] rounded-full opacity-10"
              style={{
                background: 'radial-gradient(ellipse, #8B6F47 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-10">

            {/* Copy */}
            <div>
              <ScrollReveal delay={0}>
                <p className="mb-3 font-sans text-[11px] uppercase tracking-[0.18em] text-[#8C8275]">
                  The collection
                </p>
              </ScrollReveal>

              <ScrollReveal delay={120}>
                <h2 className="mb-3 font-['Cormorant_Garamond'] text-[clamp(1.5rem,4vw,2rem)] font-normal leading-tight text-[#F5F1EC]">
                  {headline}
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={220}>
                <p className="max-w-md text-sm leading-relaxed text-[#A89880]">
                  {body}
                </p>
              </ScrollReveal>
            </div>

            {/* Buttons */}
            <div className="flex w-full flex-col gap-2.5 md:w-auto md:shrink-0">
              <ScrollReveal delay={320}>
                <Link
                  href="/catalog"
                  className="flex items-center justify-center whitespace-nowrap border border-[#8B6F47] px-8 py-3.5 font-sans text-[11px] uppercase tracking-[0.16em] text-[#EDE6DC] transition-colors duration-300 hover:bg-[#8B6F47] hover:text-[#F5F1EC]"
                >
                  Browse the catalog
                </Link>
              </ScrollReveal>

              <ScrollReveal delay={420}>
                <Link
                  href="/contact"
                  className="flex items-center justify-center whitespace-nowrap border border-[rgba(245,241,236,0.35)] px-8 py-3.5 font-sans text-[11px] uppercase tracking-[0.16em] text-[rgba(245,241,236,0.7)] transition-colors duration-300 hover:border-[rgba(245,241,236,0.6)] hover:text-[#F5F1EC]"
                >
                  Get in touch
                </Link>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}