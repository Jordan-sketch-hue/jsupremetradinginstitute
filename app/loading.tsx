'use client'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="animate-pulse">
          <div className="h-6 w-40 rounded-full bg-slate-800 mb-4" />
          <div className="h-10 w-2/3 bg-slate-800 rounded mb-2" />
          <div className="h-4 w-1/2 bg-slate-800 rounded mb-8" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-slate-800/70 border border-slate-700" />
            ))}
          </div>

          <div className="flex gap-2 flex-wrap items-center mb-6">
            <div className="h-9 w-64 rounded-lg bg-slate-800" />
            <div className="h-9 w-24 rounded-lg bg-slate-800" />
            <div className="h-9 w-24 rounded-lg bg-slate-800" />
            <div className="h-9 w-24 rounded-lg bg-slate-800" />
            <div className="h-9 w-32 rounded-lg bg-slate-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <div className="h-5 w-24 bg-slate-800 rounded mb-3" />
                <div className="h-4 w-16 bg-slate-800 rounded mb-4" />
                <div className="h-8 w-32 bg-slate-800 rounded mb-4" />
                <div className="h-3 w-full bg-slate-800 rounded mb-2" />
                <div className="h-3 w-2/3 bg-slate-800 rounded mb-4" />
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="h-10 bg-slate-800 rounded" />
                  <div className="h-10 bg-slate-800 rounded" />
                </div>
                <div className="h-9 bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
