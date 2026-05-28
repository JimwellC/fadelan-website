interface AboutQuoteProps {
  quote: string
  attribution: string
}

export default function AboutQuote({ quote, attribution }: AboutQuoteProps) {
  return (
    <section className="border-b border-[#D6CEBE] bg-[#F5F1EC] py-20 text-center">
      <p className="font-['Cormorant_Garamond'] text-[4rem] font-light leading-[0.8] text-[#D6CEBE]">
        &ldquo;
      </p>
      <blockquote className="mx-auto max-w-[480px] font-['Cormorant_Garamond'] text-[clamp(1.4rem,3vw,1.9rem)] font-light italic leading-[1.55] text-[#1A1A1A]">
        {quote}
      </blockquote>
      <p className="mt-5 text-[10px] uppercase tracking-[0.15em] text-[#8B6F47]">
        {attribution}
      </p>
    </section>
  )
}