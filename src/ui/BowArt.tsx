import type { BowId } from '../data/bows'

export function BowArt({ id, className = '' }: { id: BowId; className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden>
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="0.85" />
          <stop offset="100%" stopColor={glow(id)} />
        </radialGradient>
      </defs>
      <circle cx="80" cy="80" r="74" fill={`url(#bg-${id})`} />
      {id === 'willow' && <Willow />}
      {id === 'oak' && <Oak />}
      {id === 'maple' && <Maple />}
      {id === 'crystal' && <Crystal />}
      {id === 'sun' && <Sun />}
      {id === 'dragon' && <Dragon />}
    </svg>
  )
}

function glow(id: BowId): string {
  if (id === 'oak') return '#ffe0b2'
  if (id === 'maple') return '#ffccbc'
  if (id === 'crystal') return '#e1bee7'
  if (id === 'sun') return '#fff8e1'
  if (id === 'dragon') return '#ffcdd2'
  return '#dcedc8'
}

function Willow() {
  return (
    <g>
      <path d="M48 28c28 18 28 86 0 104" fill="none" stroke="#c4a574" strokeWidth="10" strokeLinecap="round" />
      <path d="M48 28c-10 20 34 40 34 52s-44 32-34 52" fill="none" stroke="#8d6e63" strokeWidth="3" />
      <ellipse cx="108" cy="52" rx="16" ry="8" fill="#8bc34a" transform="rotate(-20 108 52)" />
      <circle cx="70" cy="80" r="4" fill="#fff59d" />
    </g>
  )
}

function Oak() {
  return (
    <g>
      <path d="M50 26c30 16 32 90 0 108" fill="none" stroke="#6d4c41" strokeWidth="13" strokeLinecap="round" />
      <path d="M50 26c-8 22 36 38 36 54s-44 34-36 54" fill="none" stroke="#3e2723" strokeWidth="3" />
      <ellipse cx="112" cy="88" rx="14" ry="10" fill="#8d6e63" />
      <circle cx="112" cy="78" r="6" fill="#5d4037" />
    </g>
  )
}

function Maple() {
  return (
    <g>
      <path d="M50 24c32 18 32 92 2 110" fill="none" stroke="#d84315" strokeWidth="11" strokeLinecap="round" />
      <path d="M50 24c-10 24 38 40 38 56s-48 34-38 54" fill="none" stroke="#ffab91" strokeWidth="3" />
      <path d="M108 44l10 14 16-2-8 14 10 12-16-2-8 16-4-16-16 2 12-14z" fill="#ef6c00" />
    </g>
  )
}

function Crystal() {
  return (
    <g>
      <path d="M52 24c30 20 30 90 0 112" fill="none" stroke="#7e57c2" strokeWidth="10" strokeLinecap="round" />
      <path d="M52 24c-8 22 34 40 34 56s-42 36-34 56" fill="none" stroke="#80deea" strokeWidth="3" />
      <path d="M100 48l16 28-16 28-16-28z" fill="#b39ddb" stroke="#80deea" strokeWidth="2" />
      <path d="M100 48l8 28-8 8-8-8z" fill="#e1bee7" />
    </g>
  )
}

function Sun() {
  return (
    <g>
      <path d="M50 26c32 16 34 90 2 108" fill="none" stroke="#f9a825" strokeWidth="12" strokeLinecap="round" />
      <path d="M50 26c-8 22 38 38 38 54s-46 34-38 54" fill="none" stroke="#fff59d" strokeWidth="3" />
      <circle cx="112" cy="58" r="16" fill="#fff59d" stroke="#ff8f00" strokeWidth="3" />
      {[0, 45, 90, 135].map((a) => (
        <line
          key={a}
          x1="112"
          y1="58"
          x2={112 + Math.cos((a * Math.PI) / 180) * 26}
          y2={58 + Math.sin((a * Math.PI) / 180) * 26}
          stroke="#ffb300"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
    </g>
  )
}

function Dragon() {
  return (
    <g>
      <path d="M48 24c34 18 34 92 2 112" fill="none" stroke="#c62828" strokeWidth="12" strokeLinecap="round" />
      <path d="M48 24c-10 24 40 40 40 56s-50 34-40 56" fill="none" stroke="#ff7043" strokeWidth="3" />
      <path d="M96 40c18-8 28 8 22 20-10 4-18-4-22-20z" fill="#ef5350" />
      <path d="M108 70c16 0 24 14 14 24-14 2-18-10-14-24z" fill="#ff7043" />
      <circle cx="72" cy="80" r="5" fill="#ffd54f" />
    </g>
  )
}
