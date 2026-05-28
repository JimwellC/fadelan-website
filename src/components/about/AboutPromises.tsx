interface Promise {
  headline: string
  body: string
}

interface AboutPromisesProps {
  promises: Promise[]
}

export default function AboutPromises({ promises }: AboutPromisesProps) {
  return (
    <section className="bg-[#EDE6DC] py-16 md:py-20">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-[#8B6F47]">
          Our standard
        </p>
        <h2 className="font-['Cormorant_Garamond'] text-[2.2rem] font-normal leading-[1.2] text-[#1A1A1A]">
          What we promise you
        </h2>
        <div className="mx-auto mt-4 h-px w-8 bg-[#8B6F47]" />
      </div>

      {/* Timeline list */}
      <ul className="relative">
        {/* Vertical line */}
        <div className="absolute bottom-0 left-[11px] top-0 w-px bg-[rgba(139,111,71,0.2)]" />

        {promises.map((promise) => (
          <li
            key={promise.headline}
            className="grid grid-cols-[40px_1fr] border-b border-[#C8BFB2] py-7 last:border-b-0"
          >
            {/* Diamond */}
            <div className="relative z-10 flex items-start pt-1">
              <span className="flex h-[22px] w-[22px] rotate-45 items-center justify-center border border-[#8B6F47]">
                <span className="h-[7px] w-[7px] bg-[#8B6F47]" />
              </span>
            </div>

            {/* Copy */}
            <div className="pl-4">
              <p className="mb-2 font-['Cormorant_Garamond'] text-[1.35rem] font-normal text-[#1A1A1A]">
                {promise.headline}
              </p>
              <p className="text-xs leading-[1.8] text-[#8C8275]">
                {promise.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}