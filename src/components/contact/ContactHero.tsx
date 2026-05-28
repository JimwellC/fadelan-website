export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-[#1A1A1A]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,111,71,0.07) 0%, transparent 100%)',
        }}
      />
      <div className="relative mx-auto max-w-[70%] py-28 text-center">
        <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#8B6F47]">
          Get in touch
        </p>
        <h1 className="font-['Cormorant_Garamond'] text-[clamp(2.5rem,6vw,3.75rem)] font-normal leading-[1.2] text-[#F5F1EC]">
          We'd love to
          <br />
          <em className="italic">hear from you</em>
        </h1>
        <div className="mx-auto my-7 h-px w-8 bg-[#8B6F47]" />
        <p className="mx-auto max-w-[400px] text-sm leading-[1.85] text-[#8C8275]">
          Whether you have a question about a bag, want to reserve a piece, or
          simply want to say hello — we're here.
        </p>
      </div>
    </section>
  )
}