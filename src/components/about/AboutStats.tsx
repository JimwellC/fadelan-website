import ScrollReveal from "../ui/ScrollReveal"

interface Stat {
  value: string
  label: string
  description: string
}

interface AboutStatsProps {
  stats: Stat[]
}

export default function AboutStats({ stats }: AboutStatsProps) {
  return (
    <section
      className="relative overflow-hidden bg-[#2C2118] px-4 py-12 md:px-10 md:py-20"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      }}
    >
      {/* Warm glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(139,111,71,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Was md:max-w-[70%] only — too narrow on tablet. Tablet (md:) now
         gets a wider 90% cap; desktop (xl:, 1280px+) keeps the original
         70%, matching the CtaBanner/LayawayTerms/AboutCta pattern. */}
      <div className="relative mx-auto w-full md:max-w-[90%] xl:max-w-[70%]">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-8 flex items-center gap-4 md:mb-10">
            <p className="shrink-0 text-[10px] uppercase tracking-[0.22em] text-[rgba(245,241,236,0.4)]">
              By the numbers
            </p>
            <div className="h-px flex-1 bg-[rgba(245,241,236,0.1)]" />
          </div>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 items-stretch gap-4">
          {stats.map((stat, index) => (
            <ScrollReveal
              key={stat.label}
              delay={index * 140}
              className="h-full w-full flex"
            >
              <div className="h-full w-full flex">
                <div className="relative flex h-full w-full flex-col border border-[rgba(245,241,236,0.08)] p-4 md:p-7">

                  {/* Bronze corner accent */}
                  <span className="absolute left-0 top-0 h-px w-5 bg-[rgba(139,111,71,0.5)]" />
                  <span className="absolute left-0 top-0 h-5 w-px bg-[rgba(139,111,71,0.5)]" />

                  {/* Value */}
                  <p className="font-['Cormorant_Garamond'] text-[clamp(2rem,6vw,3.5rem)] font-light leading-none tracking-[-0.01em] text-[#F5F1EC]">
                    {stat.value}
                  </p>

                  {/* Label */}
                  <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-[rgba(245,241,236,0.5)] md:mt-2.5 md:text-[10px]">
                    {stat.label}
                  </p>

                  {/* Description pinned bottom */}
                  <div className="mt-auto pt-3">
                    <p className="text-[11px] leading-[1.7] text-[rgba(245,241,236,0.35)] md:text-xs">
                      {stat.description}
                    </p>
                  </div>

                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}