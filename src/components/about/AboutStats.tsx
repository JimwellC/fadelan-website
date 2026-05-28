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
      className="relative overflow-hidden bg-[#2C2118] px-10 py-16 md:py-20"
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
            'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(139,111,71,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-[70%]">
        {/* Header row */}
        <div className="mb-10 flex items-center gap-4">
          <p className="shrink-0 text-[10px] uppercase tracking-[0.22em] text-[rgba(245,241,236,0.4)]">
            By the numbers
          </p>
          <div className="h-px flex-1 bg-[rgba(245,241,236,0.1)]" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative border border-[rgba(245,241,236,0.08)] p-7"
            >
              {/* Bronze corner accent */}
              <span className="absolute left-0 top-0 h-px w-5 bg-[rgba(139,111,71,0.5)]" />
              <span className="absolute left-0 top-0 h-5 w-px bg-[rgba(139,111,71,0.5)]" />

              <p className="font-['Cormorant_Garamond'] text-[3.5rem] font-light leading-none tracking-[-0.01em] text-[#F5F1EC]">
                {stat.value}
              </p>
              <p className="mt-2.5 text-[10px] uppercase tracking-[0.14em] text-[rgba(245,241,236,0.5)]">
                {stat.label}
              </p>
              <p className="mt-2 text-xs leading-[1.7] text-[rgba(245,241,236,0.35)]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}