// src/app/loading.tsx
// Shown instantly while the homepage fetches from Sanity.

export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-[#F5F1EC]">

      {/* Hero skeleton */}
      <div
        className="w-full animate-pulse bg-[#EDE6DC] relative overflow-hidden"
        style={{ minHeight: '100svh' }}
      >
        <div className="absolute inset-0 animate-shimmer"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(139,111,71,0.06) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />
        {/* Centered placeholder text lines */}
        <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-16 space-y-3">
          <div className="h-3 w-20 animate-pulse bg-[#D6CEBE] rounded-sm" />
          <div className="h-12 w-72 animate-pulse bg-[#D6CEBE] rounded-sm" />
          <div className="h-12 w-56 animate-pulse bg-[#D6CEBE] rounded-sm" />
          <div className="h-4 w-48 animate-pulse bg-[#D6CEBE] rounded-sm mt-2" />
          <div className="flex gap-3 mt-4">
            <div className="h-11 w-36 animate-pulse bg-[#D6CEBE] rounded-sm" />
            <div className="h-11 w-36 animate-pulse bg-[#D6CEBE] rounded-sm" />
          </div>
        </div>
      </div>

      {/* Catalog grid skeleton */}
      <div className="px-4 py-16 md:px-[10%]">
        <div className="mb-8 flex items-center justify-between">
          <div className="h-8 w-52 animate-pulse bg-[#EDE6DC] rounded-sm" />
          <div className="h-4 w-32 animate-pulse bg-[#EDE6DC] rounded-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <div
                className="w-full animate-pulse bg-[#EDE6DC] relative overflow-hidden"
                style={{ aspectRatio: '4/5' }}
              >
                <div className="absolute inset-0 animate-shimmer"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(139,111,71,0.07) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                  }}
                />
              </div>
              <div className="p-3 space-y-2">
                <div className="h-2.5 w-16 animate-pulse bg-[#EDE6DC] rounded-sm" />
                <div className="h-3.5 w-28 animate-pulse bg-[#EDE6DC] rounded-sm" />
              </div>
            </div>
          ))}
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