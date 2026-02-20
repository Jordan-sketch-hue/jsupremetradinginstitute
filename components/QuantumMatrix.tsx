import React from 'react'

// Animated matrix for quantum/finance vibes
export const QuantumMatrix: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 8,
  cols = 24,
}) => {
  return (
    <div className="relative w-full h-24 overflow-hidden bg-gradient-to-r from-indigo-950 to-cyan-950 rounded-xl border border-cyan-800/40">
      <div className="absolute inset-0 animate-matrix">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="absolute left-0 top-0 w-full h-full"
            style={{ transform: `translateY(${(r * 100) / rows}%)` }}
          >
            {Array.from({ length: cols }).map((_, c) => (
              <span
                key={c}
                className={`inline-block mx-0.5 text-xs font-mono text-cyan-400 opacity-${Math.floor(Math.random() * 5) + 2} animate-pulse`}
                style={{ animationDelay: `${(r * cols + c) * 0.03}s` }}
              >
                {Math.random() > 0.7
                  ? String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96))
                  : Math.floor(Math.random() * 10)}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
