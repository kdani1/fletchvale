import { useCallback, useRef, useState, type ReactNode } from 'react'
import { bowById } from '../data/bows'
import { HIT_COIN_LEVEL, levelById, nextLevel } from '../data/levels'
import { Playfield, type PlayResult } from '../game/Playfield'
import { useStore } from '../store'
import { CoinBadge, GameButton, Stars } from '../ui/widgets'

export function Play({ mode }: { mode: 'campaign' | 'free' }) {
  const { save, playLevelId, setScreen, startLevel, startFree, addCoins, recordClear, markTutorial } = useStore()
  const level = mode === 'campaign' && playLevelId ? (levelById(playLevelId) ?? null) : null
  const [paused, setPaused] = useState(false)
  const [result, setResult] = useState<PlayResult | null>(null)
  const [tick, setTick] = useState(0)
  const [session, setSession] = useState(0)
  const [arrowsLeft, setArrowsLeft] = useState(level?.arrows ?? 0)
  const [combo, setCombo] = useState(0)
  const [pulse, setPulse] = useState(false)
  const bonusApplied = useRef(false)

  const onCoins = useCallback(
    (gained: number, total: number) => {
      addCoins(gained)
      setSession(total)
      setPulse(true)
      window.setTimeout(() => setPulse(false), 240)
    },
    [addCoins],
  )

  const onHud = useCallback((info: { arrows: number; combo: number }) => {
    setArrowsLeft(info.arrows)
    setCombo(info.combo)
  }, [])

  const onEnd = useCallback(
    (r: PlayResult) => {
      setResult(r)
      if (mode === 'campaign' && level && r.won && !bonusApplied.current) {
        bonusApplied.current = true
        const extra = r.coins - r.kills * HIT_COIN_LEVEL
        if (extra > 0) addCoins(extra)
        recordClear(level.id, r.stars, true)
      }
    },
    [addCoins, level, mode, recordClear],
  )

  const restart = () => {
    bonusApplied.current = false
    setResult(null)
    setPaused(false)
    setSession(0)
    setCombo(0)
    setArrowsLeft(level?.arrows ?? 0)
    setTick((n) => n + 1)
  }

  if (mode === 'campaign' && !level) {
    return (
      <div className="grid min-h-full place-items-center">
        <GameButton onClick={() => setScreen('levels')}>Vissza a pályákhoz</GameButton>
      </div>
    )
  }

  const nxt = level ? nextLevel(level.id) : undefined

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-2 p-2 md:p-3">
      <header className="flex items-center gap-2">
        <GameButton
          color="white"
          className="shrink-0 px-3 py-2 text-base"
          onClick={() => setScreen(mode === 'free' ? 'menu' : 'levels')}
        >
          ← Ki
        </GameButton>
        <div className="min-w-0 flex-1 text-center">
          <div className="truncate text-base font-extrabold text-white drop-shadow sm:text-lg md:text-2xl">
            {mode === 'free' ? 'Szabad játék' : level?.name}
          </div>
          <div className="hidden truncate text-xs font-bold text-white/80 sm:block md:text-sm">
            {mode === 'free' ? 'Egymás után jönnek a célok' : level?.blurb}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <CoinBadge coins={save.coins} pulse={pulse} />
          <GameButton color="amber" className="px-3 py-2 text-base" onClick={() => setPaused((p) => !p)}>
            {paused ? '▶' : '❚❚'}
          </GameButton>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <Playfield
          key={`${mode}-${level?.id ?? 'free'}-${tick}`}
          mode={mode}
          level={level}
          bowId={save.equippedBow}
          alreadyCleared={level ? Boolean(save.cleared[level.id]) : false}
          paused={paused || Boolean(result)}
          showHint={!save.seenTutorial && mode === 'campaign'}
          onHintSeen={markTutorial}
          onCoins={onCoins}
          onHud={onHud}
          onEnd={onEnd}
        />
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/85 px-3 py-2 font-extrabold text-slate-800">
        <span>Nyilak: {mode === 'free' ? '∞' : arrowsLeft}</span>
        <span>Most szerzett: {session}{combo > 1 ? ` · x${combo}` : ''}</span>
        <span>Íj: {bowById(save.equippedBow).name}</span>
      </footer>

      {paused && !result && (
        <Overlay>
          <h2 className="text-3xl font-extrabold text-slate-900">Szünet</h2>
          <GameButton color="lime" wide onClick={() => setPaused(false)}>
            Folytatom
          </GameButton>
          <GameButton color="white" wide onClick={() => setScreen('menu')}>
            Főmenü
          </GameButton>
        </Overlay>
      )}

      {result && (
        <Overlay>
          {result.won ? (
            <>
              <div className="text-5xl">🎉</div>
              <h2 className="text-3xl font-extrabold text-lime-800">Ügyes vagy!</h2>
              <Stars n={result.stars} size="lg" />
              <p className="font-extrabold text-amber-800">+{result.coins} érme a pályáért</p>
              <div className="flex w-full flex-col gap-2">
                {nxt && (
                  <GameButton color="lime" wide onClick={() => startLevel(nxt.id)}>
                    Következő pálya
                  </GameButton>
                )}
                <GameButton color="sky" wide onClick={restart}>
                  Újra
                </GameButton>
                <GameButton color="white" wide onClick={() => setScreen('levels')}>
                  Pályák
                </GameButton>
              </div>
            </>
          ) : (
            <>
              <div className="text-5xl">😅</div>
              <h2 className="text-3xl font-extrabold text-rose-800">Elfogyott a nyíl</h2>
              <p className="text-center font-bold text-slate-600">
                Gyakorolj a szabad játékban, vagy vegyél jobb íjat a boltban — az többet mutat a röppályából.
              </p>
              <div className="flex w-full flex-col gap-2">
                <GameButton color="lime" wide onClick={restart}>
                  Próbáld újra
                </GameButton>
                <GameButton color="sky" wide onClick={startFree}>
                  Szabad játék
                </GameButton>
                <GameButton color="amber" wide onClick={() => setScreen('shop')}>
                  Bolt
                </GameButton>
                <GameButton color="white" wide onClick={() => setScreen('levels')}>
                  Pályák
                </GameButton>
              </div>
            </>
          )}
        </Overlay>
      )}
    </div>
  )
}

function Overlay({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-sky-900/35 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-sm animate-pop flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-[0_12px_0_rgba(0,0,0,0.15)]">
        {children}
      </div>
    </div>
  )
}
