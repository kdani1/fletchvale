import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function CoinBadge({ coins, pulse = false }: { coins: number; pulse?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-amber-300 px-3 py-1.5 text-lg font-extrabold text-amber-950 shadow-[0_4px_0_#c68a00] ${pulse ? 'animate-pop' : ''}`}
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-b from-yellow-200 to-amber-500 text-sm text-amber-950 shadow-inner ring-2 ring-amber-200">
        ●
      </span>
      <span>{coins}</span>
    </div>
  )
}

export function Stars({ n, size = 'md' }: { n: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl'
  return (
    <div className={`flex gap-0.5 ${cls}`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= n ? 'animate-pop text-amber-400' : 'text-white/40'}>
          ★
        </span>
      ))}
    </div>
  )
}

export function GameButton({
  children,
  color = 'sky',
  wide,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  color?: 'sky' | 'lime' | 'amber' | 'rose' | 'violet' | 'white'
  wide?: boolean
}) {
  const colors = {
    sky: 'bg-sky-400 text-sky-950 shadow-[0_6px_0_#0284c7] hover:translate-y-0.5 hover:shadow-[0_4px_0_#0284c7]',
    lime: 'bg-lime-400 text-lime-950 shadow-[0_6px_0_#65a30d] hover:translate-y-0.5 hover:shadow-[0_4px_0_#65a30d]',
    amber: 'bg-amber-300 text-amber-950 shadow-[0_6px_0_#d97706] hover:translate-y-0.5 hover:shadow-[0_4px_0_#d97706]',
    rose: 'bg-rose-400 text-rose-950 shadow-[0_6px_0_#e11d48] hover:translate-y-0.5 hover:shadow-[0_4px_0_#e11d48]',
    violet: 'bg-violet-400 text-violet-950 shadow-[0_6px_0_#7c3aed] hover:translate-y-0.5 hover:shadow-[0_4px_0_#7c3aed]',
    white: 'bg-white text-slate-800 shadow-[0_6px_0_#94a3b8] hover:translate-y-0.5 hover:shadow-[0_4px_0_#94a3b8]',
  }
  return (
    <button
      type="button"
      className={`rounded-2xl px-5 py-3 text-xl font-extrabold transition-transform active:translate-y-1 active:shadow-none disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none ${colors[color]} ${wide ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-white/90 p-4 shadow-[0_10px_0_rgba(15,23,42,0.12)] ring-4 ring-white/60 ${className}`}>
      {children}
    </div>
  )
}

export function BackBar({
  title,
  coins,
  onBack,
}: {
  title: string
  coins: number
  onBack: () => void
}) {
  return (
    <header className="flex items-center justify-between gap-3">
      <GameButton color="white" onClick={onBack} className="px-4 py-2 text-lg">
        ← Vissza
      </GameButton>
      <h1 className="text-center text-2xl font-extrabold text-white drop-shadow md:text-3xl">{title}</h1>
      <CoinBadge coins={coins} />
    </header>
  )
}
