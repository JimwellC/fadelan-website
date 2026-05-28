interface AboutStoryProps {
  headline: string
  body: string
}

export default function AboutStory({ headline, body }: AboutStoryProps) {
  return (
    <section className="border-b border-t border-[#D6CEBE] bg-[#F5F1EC]">
      <div className="grid md:grid-cols-[2fr_3fr]">

        {/* Left — polaroid */}
        <div className="flex items-center justify-center border-b border-[#D6CEBE] px-8 py-20 md:border-b-0 md:border-r md:py-28">

          {/* Rings + polaroid wrapper */}
          <div className="relative flex items-center justify-center" style={{ width: '72%', aspectRatio: '1/1' }}>

            {/* Outer spinning ring with 4 diamonds */}
            <div
              className="spin-ring absolute inset-0 rounded-full"
              style={{ border: '1px dashed rgba(139,111,71,0.25)' }}
            >
              {/* Diamond top */}
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-0">
                <div className="h-2 w-2 rotate-45 bg-[#8B6F47] opacity-60" />
              </div>
              {/* Diamond right */}
              <div className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 right-0">
                <div className="h-2 w-2 rotate-45 bg-[#8B6F47] opacity-60" />
              </div>
              {/* Diamond bottom */}
              <div className="absolute left-1/2 -translate-x-1/2 translate-y-1/2 bottom-0">
                <div className="h-2 w-2 rotate-45 bg-[#8B6F47] opacity-60" />
              </div>
              {/* Diamond left */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-0">
                <div className="h-2 w-2 rotate-45 bg-[#8B6F47] opacity-60" />
              </div>
            </div>

            {/* Inner spinning ring — reverse, no diamonds */}
            <div
              className="spin-ring absolute rounded-full"
              style={{
                inset: '10%',
                border: '0.5px solid rgba(139,111,71,0.15)',
                animationDirection: 'reverse',
                animationDuration: '24s',
              }}
            />

            {/* Polaroid */}
            <div
              className="polaroid-wrap relative z-10 w-[85%] cursor-pointer bg-white p-3 pb-9"
              style={{
                boxShadow: '0 8px 32px rgba(26,26,26,0.12), 0 2px 8px rgba(26,26,26,0.06)',
              }}
            >
              {/* TODO: replace with next/image + urlFor(storyPhoto).width(600).format("webp").url() */}
              <div className="flex aspect-square w-full items-center justify-center bg-[#C8BFB2]">
                <span className="text-[10px] uppercase tracking-[0.1em] text-[#8C8275]">
                  Founder photo
                </span>
              </div>
              <p className="mt-2 text-center font-['Cormorant_Garamond'] text-[12px] italic tracking-[0.04em] text-[#8C8275]">
                est. 2023
              </p>
            </div>

          </div>
        </div>

        {/* Right — copy */}
        <div className="flex items-center px-14 py-20 md:py-28">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-[#8B6F47]">
              The beginning
            </p>
            <h2 className="mb-5 font-['Cormorant_Garamond'] text-[2rem] font-normal leading-[1.2] text-[#1A1A1A]">
              {headline}
            </h2>
            <div className="space-y-4">
              {body.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-sm leading-[1.85] text-[#8C8275]">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8 h-px w-8 bg-[#8B6F47]" />
          </div>
        </div>

      </div>
    </section>
  )
}