export default function HowToBuyHero() {
  return (
    <section className="relative overflow-hidden bg-[#1A1A1A]">
      {/* Warm glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,111,71,0.07) 0%, transparent 100%)',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[65vh] w-full flex-col items-center justify-center px-6 py-12 text-center md:max-w-[70%] md:px-0">
        <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#8B6F47]">
          How to buy
        </p>

        <h1 className="font-cormorant text-[clamp(2rem,6vw,3.75rem)] font-normal leading-[1.2] text-[#F5F1EC]">
          Acquiring with confidence,
          <br />
          <em className="italic">one piece at a time</em>
        </h1>

        <div className="mx-auto my-7 h-px w-8 bg-[#8B6F47]" />

        <p className="font-sans text-sm leading-relaxed text-[#8C8275]">
          Every piece is one of a kind. Here is how we make
          <br />
          the process simple, transparent, and personal.
        </p>
      </div>
    </section>
  )
}