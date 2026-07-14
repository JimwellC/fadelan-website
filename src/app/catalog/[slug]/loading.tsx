// src/app/catalog/[slug]/loading.tsx
// Shown instantly while bag detail page fetches from Sanity.

export default function BagDetailLoading() {
  return (
    <main className="min-h-screen bg-[#F5F1EC] flex flex-col">

      {/* Dark top band */}
      <div className="h-20 w-full bg-[#2C2118]" />

      {/* Breadcrumb skeleton */}
      <div className="bg-[#F5F1EC] px-4 py-4 md:px-10 md:py-5">
        <div className="flex items-center gap-2">
          <div className="h-3 w-12 animate-pulse bg-[#EDE6DC] rounded-sm" />
          <div className="h-3 w-2 animate-pulse bg-[#EDE6DC] rounded-sm" />
          <div className="h-3 w-16 animate-pulse bg-[#EDE6DC] rounded-sm" />
          <div className="h-3 w-2 animate-pulse bg-[#EDE6DC] rounded-sm" />
          <div className="h-3 w-32 animate-pulse bg-[#EDE6DC] rounded-sm" />
        </div>
      </div>

      {/* Gallery + details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 flex-1">

        {/* Left — gallery skeleton */}
        <div className="px-4 pt-6 md:px-10 md:pt-8">
          <div className="flex gap-3 flex-col-reverse md:flex-row">
            {/* Thumbnail strip */}
            <div className="flex flex-row justify-center gap-2 md:flex-col md:justify-start">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 w-14 md:h-[72px] md:w-[72px] flex-shrink-0 animate-pulse bg-[#EDE6DC] border border-[#D6CEBE]"
                  style={{ borderTopRightRadius: '10px' }}
                />
              ))}
            </div>
            {/* Main image */}
            <div className="relative flex-1">
              <div
                className="w-full animate-pulse bg-[#EDE6DC] border border-[#D6CEBE]"
                style={{
                  aspectRatio: '4/5',
                  maxHeight: '65vh',
                  borderTopRightRadius: 'clamp(40px, 8vw, 120px)',
                }}
              >
                <div className="absolute inset-0 animate-shimmer"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(139,111,71,0.07) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    borderTopRightRadius: 'clamp(40px, 8vw, 120px)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right — details skeleton */}
        <div className="flex flex-col px-4 py-8 md:px-14 md:pt-12 space-y-4">
          {/* Brand */}
          <div className="h-2.5 w-20 animate-pulse bg-[#EDE6DC] rounded-sm" />
          {/* Name */}
          <div className="h-9 w-3/4 animate-pulse bg-[#EDE6DC] rounded-sm" />
          <div className="h-9 w-1/2 animate-pulse bg-[#EDE6DC] rounded-sm" />
          {/* Subtitle */}
          <div className="h-4 w-40 animate-pulse bg-[#EDE6DC] rounded-sm" />
          {/* Price + badge */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-9 w-36 animate-pulse bg-[#EDE6DC] rounded-sm" />
            <div className="h-6 w-20 animate-pulse bg-[#EDE6DC] rounded-sm" />
          </div>
          {/* Description lines */}
          <div className="space-y-2 pt-2">
            <div className="h-3.5 w-full animate-pulse bg-[#EDE6DC] rounded-sm" />
            <div className="h-3.5 w-5/6 animate-pulse bg-[#EDE6DC] rounded-sm" />
            <div className="h-3.5 w-4/6 animate-pulse bg-[#EDE6DC] rounded-sm" />
          </div>
          {/* Divider */}
          <div className="h-px w-full bg-[#D6CEBE] mt-2" />
          {/* Inquiry block skeleton */}
          <div className="border border-[#D6CEBE] bg-[#EDE6DC] p-7 space-y-4">
            <div className="h-6 w-40 animate-pulse bg-[#D6CEBE] rounded-sm" />
            <div className="h-3.5 w-full animate-pulse bg-[#D6CEBE] rounded-sm" />
            <div className="h-3.5 w-5/6 animate-pulse bg-[#D6CEBE] rounded-sm" />
            <div className="flex gap-3 pt-2">
              <div className="h-11 flex-1 animate-pulse bg-[#D6CEBE] rounded-sm" />
              <div className="h-11 flex-1 animate-pulse bg-[#D6CEBE] rounded-sm" />
              <div className="h-11 flex-1 animate-pulse bg-[#D6CEBE] rounded-sm" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .animate-shimmer { animation: shimmer 1.6s ease-in-out infinite; }
      `}</style>
    </main>
  )
}