import { audio } from '../audio/engine'
import { useStore } from '../store'
import { BackBar, GameButton } from '../ui/widgets'

export function Settings() {
  const { save, setScreen, setMusic, setSfx } = useStore()

  return (
    <div className="mx-auto flex min-h-full w-full max-w-xl flex-col gap-5 px-4 py-5">
      <BackBar title="Hangok" coins={save.coins} onBack={() => setScreen('menu')} />
      <div className="rounded-3xl bg-white/90 p-6 shadow-[0_8px_0_rgba(0,0,0,0.1)]">
        <h2 className="text-2xl font-extrabold text-violet-900">Zene</h2>
        <p className="mb-3 font-bold text-slate-600">Vidám, halk dallam a völgyhöz.</p>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={save.music}
          onChange={(e) => {
            const v = Number(e.target.value)
            setMusic(v)
            audio.startMusic()
          }}
          className="w-full accent-violet-500"
        />
        <div className="mt-2 text-right font-extrabold text-violet-700">{Math.round(save.music * 100)}%</div>

        <h2 className="mt-6 text-2xl font-extrabold text-sky-900">Játékhangok</h2>
        <p className="mb-3 font-bold text-slate-600">Lövés, találat, érme, gombok.</p>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={save.sfx}
          onChange={(e) => {
            const v = Number(e.target.value)
            setSfx(v)
            audio.coin()
          }}
          className="w-full accent-sky-500"
        />
        <div className="mt-2 text-right font-extrabold text-sky-700">{Math.round(save.sfx * 100)}%</div>

        <div className="mt-6 flex flex-wrap gap-3">
          <GameButton color="violet" onClick={() => { audio.startMusic(); audio.win() }}>
            Teszt zene
          </GameButton>
          <GameButton color="sky" onClick={() => audio.hit()}>
            Teszt hang
          </GameButton>
        </div>
      </div>
      <p className="text-center font-bold text-white/90">
        A hang a böngészőben készül, nincs külön fájl — első koppintásra indul.
      </p>
    </div>
  )
}
