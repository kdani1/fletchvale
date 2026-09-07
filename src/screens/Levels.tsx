import { LEVELS, WORLDS } from '../data/levels'
import { useStore } from '../store'
import { BackBar, Stars } from '../ui/widgets'

export function Levels() {
  const { save, setScreen, startLevel, isUnlocked } = useStore()

  return (
    <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-5 px-4 py-5">
      <BackBar title="Pályák" coins={save.coins} onBack={() => setScreen('menu')} />
      <p className="rounded-2xl bg-white/80 px-4 py-3 text-center text-base font-extrabold text-emerald-900">
        A fő cél: haladj a pályákon. Az első teljesítés adja a sok érmét. A szabad játék csak kis segítség.
      </p>
      {WORLDS.map((world) => (
        <section key={world.id}>
          <h2 className="mb-3 text-2xl font-extrabold text-white drop-shadow">
            {world.emoji} {world.name}
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {LEVELS.filter((l) => l.world === world.id).map((level) => {
              const open = isUnlocked(level.id)
              const stars = save.stars[level.id] ?? 0
              const done = Boolean(save.cleared[level.id])
              return (
                <button
                  key={level.id}
                  type="button"
                  disabled={!open}
                  onClick={() => startLevel(level.id)}
                  className={`rounded-3xl p-3 text-left shadow-[0_6px_0_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70 ${
                    world.theme === 'night'
                      ? 'bg-indigo-300'
                      : world.theme === 'river'
                        ? 'bg-cyan-300'
                        : 'bg-lime-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/80 text-lg font-extrabold text-slate-800">
                      {open ? level.index : '🔒'}
                    </span>
                    <Stars n={stars} size="sm" />
                  </div>
                  <div className="mt-2 text-sm font-extrabold text-slate-900">{open ? level.name : 'Még zárva'}</div>
                  <div className="mt-1 text-xs font-bold text-slate-700">
                    {open
                      ? done
                        ? `Újra: kevesebb érme · ${level.enemies.length} cél`
                        : `Első jutalom: +${level.firstBonus}`
                      : 'Előző pálya kell'}
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
