import { useStore } from '../store'
import { CoinBadge } from '../ui/widgets'

export function Menu() {
  const { save, setScreen, startFree } = useStore()

  return (
    <div className="relative mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center px-4 py-8">
      <Clouds />
      <div className="mb-2 text-7xl animate-float">🏹</div>
      <h1 className="title-bounce text-center text-5xl font-extrabold text-white drop-shadow-[0_6px_0_rgba(2,80,120,0.25)] md:text-7xl">
        Fletchvale
      </h1>
      <p className="mt-2 max-w-md text-center text-lg font-extrabold text-sky-950/80">
        Színes íjászkaland gyerekeknek. Lődd le az almák, léggömbök és fürge állatok célpontjait!
      </p>
      <div className="mt-4">
        <CoinBadge coins={save.coins} />
      </div>

      <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
        <MenuTile emoji="🗺️" title="Pályák" text="Itt gyűjts! Itt haladj!" color="lime" onClick={() => setScreen('levels')} />
        <MenuTile
          emoji="🎯"
          title="Szabad játék"
          text="Gyakorlás, kevesebb érme"
          color="sky"
          onClick={startFree}
        />
        <MenuTile emoji="🛍️" title="Bolt" text="Íjak képekkel, jobb célzás" color="amber" onClick={() => setScreen('shop')} />
        <MenuTile emoji="🔊" title="Hang" text="Zene és hangok" color="violet" onClick={() => setScreen('settings')} />
      </div>

      <p className="mt-8 text-center text-sm font-bold text-sky-950/70">
        A pályákon több érme jár. A szabad játék akkor jó, ha egy pálya nehéz.
      </p>
      {!nativeApp() && (
        <a
          href="https://litter.catbox.moe/wc04i2.apk"
          download="Fletchvale.apk"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-base font-extrabold text-white shadow-[0_4px_0_#047857] hover:translate-y-0.5"
        >
          🤖 Android APK letöltése
        </a>
      )}
    </div>
  )
}

function MenuTile({
  emoji,
  title,
  text,
  color,
  onClick,
}: {
  emoji: string
  title: string
  text: string
  color: 'sky' | 'lime' | 'amber' | 'violet'
  onClick: () => void
}) {
  const bg = {
    lime: 'from-lime-300 to-green-400 shadow-lime-600',
    sky: 'from-sky-300 to-cyan-400 shadow-cyan-600',
    amber: 'from-amber-300 to-orange-400 shadow-orange-600',
    violet: 'from-violet-300 to-fuchsia-400 shadow-fuchsia-600',
  }[color]
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-4 rounded-3xl bg-gradient-to-br ${bg} p-4 text-left shadow-[0_8px_0_var(--tw-shadow-color)] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none`}
    >
      <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/80 text-4xl">{emoji}</span>
      <span>
        <span className="block text-2xl font-extrabold text-slate-900">{title}</span>
        <span className="block text-sm font-bold text-slate-800/80">{text}</span>
      </span>
    </button>
  )
}

function nativeApp(): boolean {
  return typeof window !== 'undefined' && 'Capacitor' in window
}

function Clouds() {
  return (
    <>
      <div className="pointer-events-none absolute left-4 top-8 h-12 w-24 animate-drift rounded-full bg-white/70" />
      <div className="pointer-events-none absolute right-8 top-16 h-10 w-20 animate-drift-slow rounded-full bg-white/60" />
      <div className="pointer-events-none absolute left-1/3 top-24 h-8 w-16 animate-drift rounded-full bg-white/50" />
    </>
  )
}
