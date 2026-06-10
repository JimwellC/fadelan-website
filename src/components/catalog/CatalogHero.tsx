import ScrollReveal from "../ui/ScrollReveal"

export default function CatalogHero() {
  return (
    <section className="relative overflow-hidden bg-[#1A1A1A]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,111,71,0.07) 0%, transparent 100%)',
        }}
      />

      <div className="relative mx-auto flex min-h-[65vh] w-full flex-col items-center justify-center px-6 py-12 text-center md:max-w-[70%] md:px-0">

        <ScrollReveal delay={0}>
          <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#8B6F47]">
            The collection
          </p>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <h1 className="font-['Cormorant_Garamond'] text-[clamp(2rem,6vw,3.75rem)] font-normal leading-[1.2] text-[#F5F1EC]">
            Pre-loved luxury,
            <br />
            <em className="italic">authenticated with care</em>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={220}>
          <div className="my-6 h-px w-8 bg-[#8B6F47]" />
        </ScrollReveal>

        <ScrollReveal delay={320}>
          <p className="mx-auto max-w-[380px] text-sm leading-[1.85] text-[#8C8275]">
            Every piece is one of a kind. Browse our current selection of curated heritage bags.
          </p>
        </ScrollReveal>

      </div>
    </section>
  )
}