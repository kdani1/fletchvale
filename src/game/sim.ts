import { bowById, type BowDef } from '../data/bows'
import {
  GOLDEN_COINS,
  GOLDEN_EVERY,
  HIT_COIN_FREE,
  HIT_COIN_LEVEL,
  FREE_COIN_CAP,
  FREE_COMBO_BONUS,
  type EnemyKind,
  type LevelDef,
  type ThemeId,
} from '../data/levels'
import { clamp, dist, rand } from '../lib/math'

export const W = 1100
export const H = 620
export const GROUND = 548
export const ARCHER_X = 118
export const ARCHER_Y = GROUND - 8
export const GRAVITY = 0.2

export interface Enemy {
  id: number
  kind: EnemyKind
  golden: boolean
  x: number
  y: number
  homeX: number
  homeY: number
  vx: number
  vy: number
  leash: number
  dodge: number
  wander: number
  wobble: number
  tired: number
  pop: number
  alive: boolean
  r: number
}

export interface Shot {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  life: number
}

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  color: string
  kind: 'spark' | 'puff' | 'leaf' | 'trail' | 'star'
}

export interface Floater {
  x: number
  y: number
  text: string
  life: number
  color: string
}

export interface World {
  mode: 'campaign' | 'free'
  theme: ThemeId
  level: LevelDef | null
  bow: BowDef
  arrows: number
  arrowsMax: number
  enemies: Enemy[]
  shot: Shot | null
  aiming: boolean
  pullX: number
  pullY: number
  particles: Particle[]
  floats: Floater[]
  phase: 'play' | 'win' | 'lose'
  time: number
  combo: number
  kills: number
  coinsEarned: number
  shake: number
  bowAngle: number
  drawAmt: number
  wind: number
  nextId: number
  ended: boolean
  sfx: 'hit' | 'miss' | null
}

function radius(kind: EnemyKind): number {
  if (kind === 'balloon') return 30
  if (kind === 'crow') return 26
  if (kind === 'fox') return 28
  if (kind === 'goblin') return 29
  return 26
}

export function jitterEnemies(level: LevelDef): Enemy[] {
  return level.enemies.map((e, i) => {
    const spread = level.world === 1 ? 0.45 : level.world === 2 ? 0.75 : 1
    const jx = rand(-28, 28) * spread
    const jy = e.kind === 'fox' ? 0 : rand(-22, 22) * spread
    const x = clamp(e.x + jx, 380, 1040)
    const y = e.kind === 'fox' ? GROUND - 18 : clamp(e.y + jy, 90, GROUND - 30)
    return {
      id: i + 1,
      kind: e.kind,
      golden: false,
      x,
      y,
      homeX: x,
      homeY: y,
      vx: 0,
      vy: 0,
      leash: e.leash,
      dodge: e.dodge,
      wander: e.wander,
      wobble: rand(0, Math.PI * 2),
      tired: 0,
      pop: 0,
      alive: true,
      r: radius(e.kind),
    }
  })
}

export function spawnFree(world: World): Enemy {
  const cycle: EnemyKind[] = ['apple', 'balloon', 'fox', 'crow', 'goblin', 'balloon']
  const kind = cycle[world.kills % cycle.length]!
  const golden = world.kills > 0 && world.kills % GOLDEN_EVERY === 0
  const x = rand(460, 1000)
  const y = kind === 'fox' ? GROUND - 18 : kind === 'apple' ? rand(260, 470) : rand(120, 320)
  const dodge = clamp(0.32 + world.kills * 0.012, 0.32, 0.66)
  world.nextId += 1
  return {
    id: world.nextId,
    kind: golden ? 'apple' : kind,
    golden,
    x,
    y,
    homeX: x,
    homeY: y,
    vx: 0,
    vy: 0,
    leash: kind === 'fox' ? 120 : 86,
    dodge,
    wander: kind === 'apple' ? 12 : 34,
    wobble: rand(0, 6),
    tired: 0,
    pop: 0,
    alive: true,
    r: golden ? 26 : radius(kind),
  }
}

export function createWorld(mode: 'campaign' | 'free', level: LevelDef | null, bowId: string): World {
  const bow = bowById(bowId)
  const enemies = mode === 'campaign' && level ? jitterEnemies(level) : []
  const world: World = {
    mode,
    theme: level?.theme ?? 'meadow',
    level,
    bow,
    arrows: level?.arrows ?? 99,
    arrowsMax: level?.arrows ?? 99,
    enemies,
    shot: null,
    aiming: false,
    pullX: ARCHER_X + 80,
    pullY: ARCHER_Y - 40,
    particles: [],
    floats: [],
    phase: 'play',
    time: 0,
    combo: 0,
    kills: 0,
    coinsEarned: 0,
    shake: 0,
    bowAngle: -0.45,
    drawAmt: 0,
    wind: rand(-0.15, 0.15),
    nextId: 40,
    ended: false,
    sfx: null,
  }
  if (mode === 'free') world.enemies.push(spawnFree(world))
  return world
}

export function pullPower(world: World): { angle: number; power: number; px: number; py: number } {
  const dx = ARCHER_X - world.pullX
  const dy = ARCHER_Y - 52 - world.pullY
  const len = Math.hypot(dx, dy)
  const power = clamp((len - 24) / 150, 0.22, 1)
  const angle = Math.atan2(dy, dx)
  return { angle, power, px: dx, py: dy }
}

export function predictPath(world: World): Array<{ x: number; y: number }> {
  const { angle, power } = pullPower(world)
  const speed = 14.2 * power * world.bow.power
  let x = ARCHER_X + 18
  let y = ARCHER_Y - 56
  let vx = Math.cos(angle) * speed
  let vy = Math.sin(angle) * speed
  const pts: Array<{ x: number; y: number }> = []
  let travel = 0
  for (let i = 0; i < 80; i++) {
    x += vx
    y += vy
    vy += GRAVITY
    vx += world.wind * 0.02
    travel += Math.hypot(vx, vy)
    pts.push({ x, y })
    if (y > GROUND || x > W + 40 || travel > world.bow.preview) break
  }
  return pts
}

function addParticle(world: World, p: Omit<Particle, 'max'> & { max?: number }): void {
  world.particles.push({ ...p, max: p.max ?? p.life })
  if (world.particles.length > 160) world.particles.splice(0, world.particles.length - 160)
}

export function burst(world: World, x: number, y: number, color: string, n = 16): void {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + rand(-0.2, 0.2)
    const s = rand(1.6, 5.2)
    addParticle(world, {
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 1,
      life: rand(18, 32),
      size: rand(3, 7),
      color,
      kind: i % 3 === 0 ? 'star' : 'spark',
    })
  }
  for (let i = 0; i < 6; i++) {
    addParticle(world, {
      x,
      y,
      vx: rand(-1.2, 1.2),
      vy: rand(-2.4, -0.4),
      life: 22,
      size: rand(8, 14),
      color: 'rgba(255,255,255,0.55)',
      kind: 'puff',
    })
  }
}

function coinsForHit(world: World, golden: boolean): number {
  if (golden) return GOLDEN_COINS
  if (world.mode === 'free') {
    const extra = Math.floor(world.combo / 3) * FREE_COMBO_BONUS
    return clamp(HIT_COIN_FREE + extra, HIT_COIN_FREE, FREE_COIN_CAP)
  }
  return HIT_COIN_LEVEL
}

export function shoot(world: World): boolean {
  if (world.phase !== 'play' || world.shot || world.arrows <= 0) return false
  const { angle, power } = pullPower(world)
  const speed = 14.2 * power * world.bow.power
  world.shot = {
    x: ARCHER_X + 18,
    y: ARCHER_Y - 56,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    rot: angle,
    life: 0,
  }
  world.arrows -= 1
  world.aiming = false
  world.drawAmt = 0
  return true
}

function hitEnemy(world: World, e: Enemy): void {
  e.alive = false
  e.pop = 0.02
  world.sfx = 'hit'
  world.kills += 1
  world.combo += 1
  const gain = coinsForHit(world, e.golden)
  world.coinsEarned += gain
  world.shake = 8
  const color = e.golden ? '#ffd54f' : e.kind === 'balloon' ? '#4fc3f7' : e.kind === 'fox' ? '#ff9800' : '#ef5350'
  burst(world, e.x, e.y, color, 20)
  world.floats.push({ x: e.x, y: e.y - 20, text: `+${gain}`, life: 50, color: '#f4c430' })
  if (world.mode === 'free') {
    world.enemies.push(spawnFree(world))
  }
}

export function step(world: World, dt: number): void {
  world.time += dt
  world.shake *= 0.86
  if (world.aiming) world.drawAmt = lerpDraw(world.drawAmt, pullPower(world).power, 0.22)
  else world.drawAmt = lerpDraw(world.drawAmt, 0, 0.18)

  const aim = world.aiming ? pullPower(world) : null
  const aimAngle = aim?.angle ?? world.bowAngle
  world.bowAngle += (aimAngle - world.bowAngle) * 0.28

  for (const e of world.enemies) {
    if (!e.alive) {
      e.pop += dt * 3.4
      continue
    }
    e.wobble += dt * 2.4
    const wanderX = Math.sin(e.wobble * (0.8 + e.wander * 0.01)) * e.wander
    const wanderY = Math.cos(e.wobble * 0.7) * e.wander * (e.kind === 'fox' ? 0 : 0.45)

    if (world.aiming && e.tired < 1) {
      const { angle } = pullPower(world)
      const ax = ARCHER_X + Math.cos(angle) * 40
      const ay = ARCHER_Y - 56 + Math.sin(angle) * 40
      const px = e.x - ax
      const py = e.y - ay
      const along = px * Math.cos(angle) + py * Math.sin(angle)
      const cx = ax + Math.cos(angle) * Math.max(0, along)
      const cy = ay + Math.sin(angle) * Math.max(0, along)
      const dx = e.x - cx
      const dy = e.y - cy
      const d = Math.hypot(dx, dy) || 1
      if (d < 210) {
        const force = e.dodge * (1.15 - e.tired) * (e.kind === 'fox' || e.kind === 'goblin' ? 1.15 : 1)
        e.vx += (dx / d) * force * 0.95
        e.vy += (dy / d) * force * (e.kind === 'fox' ? 0.12 : 0.7)
      }
      e.tired += dt * 0.85
    } else {
      e.tired = Math.max(0, e.tired - dt * 0.45)
      e.vx += (e.homeX + wanderX - e.x) * 0.018
      e.vy += (e.homeY + wanderY - e.y) * 0.018
    }

    if (e.kind === 'goblin' && Math.sin(e.wobble * 3) > 0.92) e.vy -= 1.6
    e.vx *= 0.9
    e.vy *= 0.9
    e.x += e.vx
    e.y += e.vy

    const hx = e.x - e.homeX
    const hy = e.y - e.homeY
    const hd = Math.hypot(hx, hy)
    if (hd > e.leash) {
      e.x = e.homeX + (hx / hd) * e.leash
      e.y = e.homeY + (hy / hd) * e.leash
      e.vx *= 0.4
      e.vy *= 0.4
    }
    if (e.kind === 'fox') e.y = GROUND - 18
    e.y = clamp(e.y, 70, GROUND - 16)
    e.x = clamp(e.x, 340, 1060)
  }

  if (world.shot) {
    const s = world.shot
    s.life += 1
    s.x += s.vx
    s.y += s.vy
    s.vy += GRAVITY
    s.vx += world.wind * 0.03
    s.rot = Math.atan2(s.vy, s.vx)
    if (s.life % 2 === 0) {
      addParticle(world, {
        x: s.x,
        y: s.y,
        vx: -s.vx * 0.04,
        vy: -s.vy * 0.04,
        life: 7,
        size: 2.4,
        color: world.bow.accent,
        kind: 'trail',
      })
    }

    let hit = false
    for (const e of world.enemies) {
      if (!e.alive) continue
      const tip = dist(s.x, s.y, e.x, e.y)
      const mid = dist(s.x - Math.cos(s.rot) * 10, s.y - Math.sin(s.rot) * 10, e.x, e.y)
      if (tip < e.r + 8 || mid < e.r + 6) {
        hitEnemy(world, e)
        hit = true
        break
      }
    }
    if (hit || s.y >= GROUND || s.x > W + 80 || s.x < -80 || s.y < -80) {
      if (!hit) {
        if (s.y >= GROUND) burst(world, s.x, GROUND - 4, '#a1887f', 8)
        world.combo = 0
        world.sfx = 'miss'
      }
      world.shot = null
    }
  }

  world.particles = world.particles.filter((p) => {
    p.life -= 1
    p.x += p.vx
    p.y += p.vy
    p.vy += p.kind === 'puff' ? 0.02 : 0.06
    return p.life > 0
  })
  world.floats = world.floats.filter((f) => {
    f.life -= 1
    f.y -= 0.7
    return f.life > 0
  })

  if (world.time % 18 < dt * 2 && Math.random() < 0.4) {
    addParticle(world, {
      x: rand(0, W),
      y: rand(40, 220),
      vx: rand(-0.4, -0.1) + world.wind,
      vy: rand(0.2, 0.6),
      life: 80,
      size: rand(4, 8),
      color: world.theme === 'night' ? '#b39ddb' : '#81c784',
      kind: 'leaf',
    })
  }

  if (world.phase === 'play' && !world.ended) {
    const living = world.enemies.some((e) => e.alive || e.pop < 1)
    if (world.mode === 'campaign' && !world.enemies.some((e) => e.alive) && world.enemies.every((e) => e.pop >= 1)) {
      world.phase = 'win'
      world.ended = true
    } else if (world.mode === 'campaign' && world.arrows <= 0 && !world.shot && living) {
      const still = world.enemies.some((e) => e.alive)
      if (still) {
        world.phase = 'lose'
        world.ended = true
      }
    }
  }
}

function lerpDraw(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function starsFor(world: World): number {
  if (world.phase !== 'win') return 0
  const ratio = world.arrows / Math.max(1, world.arrowsMax)
  if (ratio >= 0.4) return 3
  if (ratio >= 0.15) return 2
  return 1
}

export function totalReward(world: World, alreadyCleared: boolean, stars: number): number {
  if (world.mode === 'free') return world.coinsEarned
  let extra = 0
  if (!alreadyCleared && world.level) extra += world.level.firstBonus
  else if (world.level) extra += Math.round(world.level.firstBonus * 0.35)
  if (stars >= 3 && world.level) extra += world.level.starBonus
  return world.coinsEarned + extra
}

export function flavorEnemy(kind: EnemyKind, golden: boolean): string {
  if (golden) return 'Aranyalma'
  if (kind === 'apple') return 'Alma'
  if (kind === 'balloon') return 'Léggömb'
  if (kind === 'crow') return 'Varjú'
  if (kind === 'fox') return 'Róka'
  return 'Csínytevő'
}
