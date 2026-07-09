// src/app/catalog/loading.tsx
// Shown instantly while catalog page fetches data from Sanity.
// Matches the real catalog layout exactly so there's no layout shift on load.

export default function CatalogLoading() {
  return (
    <div className="min-h-screen bg-[#F5F1EC]">

      {/* Toolbar skeleton */}
      <div className="border-b border-bronze/20 px-4 py-3 md:px-[10%]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Filter button */}
            <div className="h-9 w-9 animate-pulse bg-[#EDE6DC] border border-[#D6CEBE]" />
            {/* Count */}
            <div className="h-4 w-16 animate-pulse bg-[#EDE6DC] rounded-sm ml-2" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-20 animate-pulse bg-[#EDE6DC] rounded-sm" />
            <div className="h-px w-px bg-transparent" />
            <div className="h-8 w-24 animate-pulse bg-[#EDE6DC] border border-[#D6CEBE]" />
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="mx-auto w-full px-4 pt-10 pb-16 md:w-[80%] md:px-0 md:pt-14">

        {/* Section label */}
        <div className="mb-10 flex items-center gap-4 md:mb-14">
          <div className="h-px flex-1 bg-[#D6CEBE]" />
          <div className="h-3 w-32 animate-pulse bg-[#EDE6DC] rounded-sm" />
          <div className="h-px flex-1 bg-[#D6CEBE]" />
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-0.5 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <BagCardSkeleton key={i} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

function BagCardSkeleton({ index }: { index: number }) {
  return (
    <div
      className="flex flex-col"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image area — 4/5 aspect ratio matching BagCard */}
      <div
        className="relative w-full animate-pulse bg-[#EDE6DC]"
        style={{ aspectRatio: '4/5' }}
      >
        {/* Shimmer sweep */}
        <div className="absolute inset-0 animate-shimmer"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(139,111,71,0.07) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      {/* Text lines */}
      <div className="p-3 space-y-2">
        <div className="h-2.5 w-16 animate-pulse bg-[#EDE6DC] rounded-sm" />
        <div className="h-3.5 w-28 animate-pulse bg-[#EDE6DC] rounded-sm" />
        <div className="h-3 w-20 animate-pulse bg-[#EDE6DC] rounded-sm" />
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .animate-shimmer { animation: shimmer 1.6s ease-in-out infinite; }
      `}</style>
    </div>
  )
}