import { useEffect, useRef, type PointerEvent } from 'react'
import { audio } from '../audio/engine'
import type { LevelDef } from '../data/levels'
import { drawWorld } from './render'
import { H, W, createWorld, shoot, starsFor, step, totalReward, type World } from './sim'

export interface PlayResult {
  won: boolean
  stars: number
  coins: number
  kills: number
}

interface Props {
  mode: 'campaign' | 'free'
  level: LevelDef | null
  bowId: string
  alreadyCleared: boolean
  paused: boolean
  showHint: boolean
  onHintSeen: () => void
  onCoins: (n: number, total: number) => void
  onHud: (info: { arrows: number; combo: number }) => void
  onEnd: (result: PlayResult) => void
}

export function Playfield({
  mode,
  level,
  bowId,
  alreadyCleared,
  paused,
  showHint,
  onHintSeen,
  onCoins,
  onHud,
  onEnd,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<World>(createWorld(mode, level, bowId))
  const lastCoins = useRef(0)
  const lastHud = useRef({ arrows: -1, combo: -1 })
  const ended = useRef(false)
  const pausedRef = useRef(paused)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    worldRef.current = createWorld(mode, level, bowId)
    lastCoins.current = 0
    ended.current = false
  }, [mode, level, bowId])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rw = wrap.clientWidth
      const rh = wrap.clientHeight
      const scale = Math.min(rw / W, rh / H)
      const cw = Math.floor(W * scale)
      const ch = Math.floor(H * scale)
      canvas.style.width = `${cw}px`
      canvas.style.height = `${ch}px`
      canvas.width = Math.floor(W * dpr)
      canvas.height = Math.floor(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrap)

    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      const world = worldRef.current
      if (!pausedRef.current) {
        const prevPhase = world.phase
        step(world, dt)
        if (world.sfx === 'hit') {
          audio.hit()
          world.sfx = null
        } else if (world.sfx === 'miss') {
          audio.miss()
          world.sfx = null
        }
        if (world.coinsEarned !== lastCoins.current) {
          const gained = world.coinsEarned - lastCoins.current
          lastCoins.current = world.coinsEarned
          onCoins(gained, world.coinsEarned)
        }
        if (lastHud.current.arrows !== world.arrows || lastHud.current.combo !== world.combo) {
          lastHud.current = { arrows: world.arrows, combo: world.combo }
          onHud(lastHud.current)
        }
        if (world.ended && !ended.current && prevPhase === 'play') {
          ended.current = true
          const stars = starsFor(world)
          const coins = totalReward(world, alreadyCleared, stars)
          if (world.phase === 'win') audio.win()
          else audio.lose()
          onEnd({
            won: world.phase === 'win',
            stars,
            coins,
            kills: world.kills,
          })
        }
      }
      ctx.clearRect(0, 0, W, H)
      drawWorld(ctx, world)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [alreadyCleared, onCoins, onEnd, onHud])

  const toWorld = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const r = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - r.left) / r.width) * W,
      y: ((e.clientY - r.top) / r.height) * H,
    }
  }

  const onDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (paused) return
    const world = worldRef.current
    if (world.phase !== 'play' || world.shot || world.arrows <= 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = toWorld(e)
    world.aiming = true
    world.pullX = p.x
    world.pullY = p.y
    audio.drawStart()
    if (showHint) onHintSeen()
  }

  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const world = worldRef.current
    if (!world.aiming) return
    const p = toWorld(e)
    world.pullX = p.x
    world.pullY = p.y
  }

  const onUp = () => {
    const world = worldRef.current
    if (!world.aiming) return
    const ok = shoot(world)
    if (ok) audio.shoot()
    else audio.drawEnd()
  }

  return (
    <div ref={wrapRef} className="relative flex h-full min-h-0 w-full items-center justify-center">
      <canvas
        ref={canvasRef}
        className="touch-none rounded-3xl shadow-[0_16px_0_#2e7d32] ring-4 ring-white/70"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />
      {showHint && (
        <div className="pointer-events-none absolute inset-x-4 top-4 mx-auto max-w-lg animate-bounce-soft rounded-2xl bg-white/90 px-4 py-3 text-center text-lg font-extrabold text-amber-800 shadow-lg">
          Húzd hátra, mint egy igazi íjat, aztán engedd el!
          <div className="mt-1 text-sm font-bold text-amber-600">A kezdő íj csak pici pöttyöket mutat.</div>
        </div>
      )}
      {mode === 'free' && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-4 py-1 text-sm font-extrabold text-emerald-800">
          Lődd egymás után — kevesebb érme, mint a pályákon
        </div>
      )}
    </div>
  )
}

