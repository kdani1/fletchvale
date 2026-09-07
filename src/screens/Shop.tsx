import { BOWS, previewLabel } from '../data/bows'
import { useStore } from '../store'
import { BowArt } from '../ui/BowArt'
import { BackBar, GameButton } from '../ui/widgets'

export function Shop() {
  const { save, setScreen, buyBow, equipBow } = useStore()

  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-5 px-4 py-5">
      <BackBar title="Bolt" coins={save.coins} onBack={() => setScreen('menu')} />
      <p className="rounded-2xl bg-white/85 px-4 py-3 text-center font-extrabold text-orange-950">
        A gyenge íj alig mutatja, merre megy a nyíl. Jobb íj = hosszabb röppálya + erősebb lövés. Vedd érméből!
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {BOWS.map((bow) => {
          const owned = save.ownedBows.includes(bow.id)
          const equipped = save.equippedBow === bow.id
          const can = save.coins >= bow.price
          return (
            <article key={bow.id} className="flex flex-col rounded-3xl bg-white/90 p-4 shadow-[0_8px_0_rgba(0,0,0,0.12)]">
              <div className="flex items-center gap-3">
                <BowArt id={bow.id} className="h-24 w-24 shrink-0 drop-shadow" />
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wide text-orange-600">{bow.tag}</div>
                  <h3 className="text-2xl font-extrabold text-slate-900">{bow.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-extrabold text-sky-800">
                      Röppálya: {previewLabel(bow)}
                    </span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-extrabold text-amber-800">
                      Erő: {Math.round(bow.power * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-3 flex-1 text-sm font-bold text-slate-600">{bow.blurb}</p>
              <PreviewDots n={bow.dots} color={bow.accent} faint={bow.id === 'willow'} />
              <div className="mt-3">
                {equipped ? (
                  <GameButton color="lime" wide disabled>
                    Felszerelve
                  </GameButton>
                ) : owned ? (
                  <GameButton color="sky" wide onClick={() => equipBow(bow.id)}>
                    Ezt viszem
                  </GameButton>
                ) : (
                  <GameButton color={can ? 'amber' : 'white'} wide disabled={!can} onClick={() => buyBow(bow.id)}>
                    {can ? `Megveszem · ${bow.price}` : `Kell még ${bow.price - save.coins}`}
                  </GameButton>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function PreviewDots({ n, color, faint }: { n: number; color: string; faint: boolean }) {
  return (
    <div className="mt-3 flex items-center gap-1 rounded-2xl bg-slate-800/90 px-3 py-2">
      <span className="mr-2 text-xs font-extrabold text-white/80">Így mutat:</span>
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: color, opacity: faint ? 0.35 : 1 - i / (n + 2) }}
        />
      ))}
    </div>
  )
}
