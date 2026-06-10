import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F5F1EC] flex flex-col items-center justify-center px-6 text-center">

      {/* Decorative top band */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(to right, transparent, #8B6F47, transparent)' }}
      />

      {/* Large 404 */}
      <p
        className="font-['Cormorant_Garamond'] font-light text-[#8B6F47] select-none leading-none mb-6"
        style={{ fontSize: 'clamp(7rem, 20vw, 14rem)', opacity: 0.12 }}
        aria-hidden
      >
        404
      </p>

      {/* Content — overlaid */}
      <div className="-mt-[clamp(4rem,10vw,8rem)] relative z-10">

        {/* Diamond */}
        <div className="flex justify-center mb-6">
          <span
            className="block w-2 h-2 bg-[#8B6F47]"
            style={{ transform: 'rotate(45deg)' }}
          />
        </div>

        <p className="mb-2 text-[9px] uppercase tracking-[0.28em] text-[#8B6F47]">
          Page not found
        </p>

        <h1 className="font-['Cormorant_Garamond'] text-[2rem] font-light leading-[1.1] text-[#1A1A1A] mb-3 md:text-[2.8rem]">
          This piece has moved on.
        </h1>

        <p className="max-w-[320px] mx-auto text-[13px] leading-[1.8] text-[#8C8275] mb-10">
          The page you're looking for doesn't exist — it may have been sold, moved, or never existed.
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10 max-w-[200px] mx-auto">
          <div className="h-px flex-1 bg-[#D6CEBE]" />
          <span className="text-[8px] text-[#8B6F47] opacity-40">◆</span>
          <div className="h-px flex-1 bg-[#D6CEBE]" />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/catalog"
            className="px-8 py-3 bg-[#2C2118] text-[#F5F1EC] font-['Inter'] text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 hover:bg-[#8B6F47]"
          >
            Browse the catalog
          </Link>
          <Link
            href="/"
            className="px-8 py-3 border border-[#D6CEBE] text-[#8C8275] font-['Inter'] text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 hover:border-[#8B6F47] hover:text-[#8B6F47]"
          >
            Go home
          </Link>
        </div>

      </div>

    </main>
  )
}