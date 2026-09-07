export type EnemyKind = 'apple' | 'balloon' | 'crow' | 'fox' | 'goblin'
export type ThemeId = 'meadow' | 'river' | 'night'

export interface EnemyDef {
  kind: EnemyKind
  x: number
  y: number
  leash: number
  dodge: number
  wander: number
}

export interface LevelDef {
  id: string
  world: 1 | 2 | 3
  index: number
  name: string
  blurb: string
  theme: ThemeId
  arrows: number
  firstBonus: number
  starBonus: number
  enemies: EnemyDef[]
}

export const WORLDS = [
  { id: 1 as const, name: 'Napos Rét', emoji: '🌻', theme: 'meadow' as const },
  { id: 2 as const, name: 'Folyópart', emoji: '🌊', theme: 'river' as const },
  { id: 3 as const, name: 'Holdfényes Erdő', emoji: '🌙', theme: 'night' as const },
]

const G = 548

export const LEVELS: LevelDef[] = [
  {
    id: 'm1',
    world: 1,
    index: 1,
    name: 'Két piros alma',
    blurb: 'Húzd hátra az íjat, és erezd el. Az almák kicsit megmoccanak, ha célozol!',
    theme: 'meadow',
    arrows: 5,
    firstBonus: 20,
    starBonus: 8,
    enemies: [
      { kind: 'apple', x: 620, y: 420, leash: 36, dodge: 0.28, wander: 8 },
      { kind: 'apple', x: 820, y: 300, leash: 34, dodge: 0.26, wander: 10 },
    ],
  },
  {
    id: 'm2',
    world: 1,
    index: 2,
    name: 'Léggömb-kert',
    blurb: 'A léggömbök lassan úsznak. Várd ki, amíg egymás közelébe kerülnek.',
    theme: 'meadow',
    arrows: 6,
    firstBonus: 24,
    starBonus: 10,
    enemies: [
      { kind: 'balloon', x: 540, y: 220, leash: 70, dodge: 0.22, wander: 28 },
      { kind: 'balloon', x: 740, y: 160, leash: 64, dodge: 0.24, wander: 26 },
      { kind: 'balloon', x: 900, y: 260, leash: 60, dodge: 0.22, wander: 24 },
    ],
  },
  {
    id: 'm3',
    world: 1,
    index: 3,
    name: 'Kerti keverék',
    blurb: 'Alma lent, léggömb fent. Mind reagál, ha felhúzod a húrt.',
    theme: 'meadow',
    arrows: 6,
    firstBonus: 26,
    starBonus: 10,
    enemies: [
      { kind: 'apple', x: 560, y: 460, leash: 40, dodge: 0.3, wander: 10 },
      { kind: 'apple', x: 880, y: 400, leash: 38, dodge: 0.3, wander: 12 },
      { kind: 'balloon', x: 720, y: 180, leash: 72, dodge: 0.28, wander: 30 },
    ],
  },
  {
    id: 'm4',
    world: 1,
    index: 4,
    name: 'Fürge varjú',
    blurb: 'A varjú gyorsan arrébb röpül, ha célozol — de nem megy messzire.',
    theme: 'meadow',
    arrows: 7,
    firstBonus: 30,
    starBonus: 12,
    enemies: [
      { kind: 'apple', x: 500, y: 440, leash: 36, dodge: 0.28, wander: 8 },
      { kind: 'apple', x: 940, y: 360, leash: 40, dodge: 0.3, wander: 10 },
      { kind: 'crow', x: 720, y: 200, leash: 90, dodge: 0.48, wander: 36 },
    ],
  },
  {
    id: 'm5',
    world: 1,
    index: 5,
    name: 'Rétfőnök',
    blurb: 'Róka szalad a fűben, léggömbök a levegőben. Mindenki máshol kezd!',
    theme: 'meadow',
    arrows: 8,
    firstBonus: 36,
    starBonus: 14,
    enemies: [
      { kind: 'fox', x: 640, y: G - 18, leash: 110, dodge: 0.5, wander: 40 },
      { kind: 'balloon', x: 520, y: 200, leash: 68, dodge: 0.3, wander: 26 },
      { kind: 'balloon', x: 860, y: 150, leash: 70, dodge: 0.32, wander: 28 },
      { kind: 'apple', x: 980, y: 420, leash: 36, dodge: 0.28, wander: 8 },
    ],
  },
  {
    id: 'r1',
    world: 2,
    index: 6,
    name: 'Hullámzó part',
    blurb: 'Négy léggömb hullámzik. Célzz a hullám tetejére!',
    theme: 'river',
    arrows: 8,
    firstBonus: 40,
    starBonus: 14,
    enemies: [
      { kind: 'balloon', x: 500, y: 240, leash: 80, dodge: 0.34, wander: 34 },
      { kind: 'balloon', x: 660, y: 160, leash: 76, dodge: 0.36, wander: 36 },
      { kind: 'balloon', x: 820, y: 210, leash: 78, dodge: 0.34, wander: 32 },
      { kind: 'balloon', x: 960, y: 140, leash: 70, dodge: 0.32, wander: 30 },
    ],
  },
  {
    id: 'r2',
    world: 2,
    index: 7,
    name: 'Rókafutam',
    blurb: 'Két róka eliramodik, amint húzod az íjat. Várd ki, míg visszafordulnak.',
    theme: 'river',
    arrows: 8,
    firstBonus: 42,
    starBonus: 16,
    enemies: [
      { kind: 'fox', x: 580, y: G - 18, leash: 120, dodge: 0.58, wander: 46 },
      { kind: 'fox', x: 860, y: G - 18, leash: 130, dodge: 0.56, wander: 50 },
      { kind: 'apple', x: 720, y: 320, leash: 40, dodge: 0.32, wander: 12 },
    ],
  },
  {
    id: 'r3',
    world: 2,
    index: 8,
    name: 'Szélvarjak',
    blurb: 'Három varjú. Gyorsan reagálnak, de mindig a saját körükben maradnak.',
    theme: 'river',
    arrows: 9,
    firstBonus: 46,
    starBonus: 16,
    enemies: [
      { kind: 'crow', x: 560, y: 180, leash: 100, dodge: 0.56, wander: 40 },
      { kind: 'crow', x: 760, y: 260, leash: 96, dodge: 0.54, wander: 38 },
      { kind: 'crow', x: 940, y: 150, leash: 92, dodge: 0.58, wander: 42 },
    ],
  },
  {
    id: 'r4',
    world: 2,
    index: 9,
    name: 'Híd alatt',
    blurb: 'Fent, lent, középen — minden magasságban van valaki.',
    theme: 'river',
    arrows: 9,
    firstBonus: 48,
    starBonus: 18,
    enemies: [
      { kind: 'apple', x: 500, y: 470, leash: 34, dodge: 0.3, wander: 8 },
      { kind: 'fox', x: 700, y: G - 18, leash: 115, dodge: 0.52, wander: 42 },
      { kind: 'balloon', x: 640, y: 170, leash: 74, dodge: 0.36, wander: 28 },
      { kind: 'crow', x: 920, y: 220, leash: 88, dodge: 0.5, wander: 34 },
    ],
  },
  {
    id: 'r5',
    world: 2,
    index: 10,
    name: 'Parti csíny',
    blurb: 'A zöld csínytevők ugrálva kitérnek. Nem ijesztőek, csak nagyon fürgék!',
    theme: 'river',
    arrows: 10,
    firstBonus: 54,
    starBonus: 20,
    enemies: [
      { kind: 'goblin', x: 600, y: 430, leash: 88, dodge: 0.6, wander: 28 },
      { kind: 'goblin', x: 840, y: 380, leash: 90, dodge: 0.62, wander: 30 },
      { kind: 'balloon', x: 720, y: 160, leash: 70, dodge: 0.34, wander: 26 },
      { kind: 'balloon', x: 980, y: 210, leash: 66, dodge: 0.32, wander: 24 },
    ],
  },
  {
    id: 'n1',
    world: 3,
    index: 11,
    name: 'Éji almák',
    blurb: 'Sötétben is látszanak a piros almák. A varjú őrzi őket.',
    theme: 'night',
    arrows: 9,
    firstBonus: 56,
    starBonus: 20,
    enemies: [
      { kind: 'apple', x: 540, y: 280, leash: 42, dodge: 0.36, wander: 14 },
      { kind: 'apple', x: 760, y: 360, leash: 40, dodge: 0.34, wander: 12 },
      { kind: 'apple', x: 960, y: 250, leash: 44, dodge: 0.38, wander: 16 },
      { kind: 'crow', x: 700, y: 150, leash: 100, dodge: 0.58, wander: 40 },
    ],
  },
  {
    id: 'n2',
    world: 3,
    index: 12,
    name: 'Árnyék-rókák',
    blurb: 'Három róka cikázik. Várd ki a fáradásukat — nem tudnak örökké szaladni.',
    theme: 'night',
    arrows: 10,
    firstBonus: 60,
    starBonus: 22,
    enemies: [
      { kind: 'fox', x: 520, y: G - 18, leash: 130, dodge: 0.64, wander: 50 },
      { kind: 'fox', x: 740, y: G - 18, leash: 140, dodge: 0.62, wander: 52 },
      { kind: 'fox', x: 930, y: G - 18, leash: 120, dodge: 0.6, wander: 48 },
    ],
  },
  {
    id: 'n3',
    world: 3,
    index: 13,
    name: 'Lombszél',
    blurb: 'Mindenféle lény a holdfényben. Készítsd a jobb íjat, ha van!',
    theme: 'night',
    arrows: 11,
    firstBonus: 64,
    starBonus: 24,
    enemies: [
      { kind: 'balloon', x: 500, y: 180, leash: 72, dodge: 0.4, wander: 30 },
      { kind: 'crow', x: 680, y: 140, leash: 96, dodge: 0.58, wander: 38 },
      { kind: 'goblin', x: 780, y: 400, leash: 86, dodge: 0.6, wander: 26 },
      { kind: 'fox', x: 960, y: G - 18, leash: 118, dodge: 0.56, wander: 44 },
    ],
  },
  {
    id: 'n4',
    world: 3,
    index: 14,
    name: 'Csíny-kör',
    blurb: 'Három ugráló csínytevő. A saját körükből nem léphetnek ki.',
    theme: 'night',
    arrows: 11,
    firstBonus: 68,
    starBonus: 24,
    enemies: [
      { kind: 'goblin', x: 560, y: 360, leash: 80, dodge: 0.64, wander: 24 },
      { kind: 'goblin', x: 760, y: 430, leash: 84, dodge: 0.66, wander: 26 },
      { kind: 'goblin', x: 940, y: 300, leash: 88, dodge: 0.64, wander: 28 },
      { kind: 'apple', x: 680, y: 200, leash: 36, dodge: 0.32, wander: 10 },
    ],
  },
  {
    id: 'n5',
    world: 3,
    index: 15,
    name: 'A völgy őre',
    blurb: 'A legnagyobb keverék. Teljesíthető — extra nyílvessződ is van!',
    theme: 'night',
    arrows: 13,
    firstBonus: 80,
    starBonus: 30,
    enemies: [
      { kind: 'apple', x: 500, y: 460, leash: 34, dodge: 0.3, wander: 8 },
      { kind: 'balloon', x: 600, y: 170, leash: 70, dodge: 0.4, wander: 28 },
      { kind: 'crow', x: 740, y: 130, leash: 100, dodge: 0.6, wander: 40 },
      { kind: 'fox', x: 820, y: G - 18, leash: 124, dodge: 0.6, wander: 46 },
      { kind: 'goblin', x: 980, y: 340, leash: 90, dodge: 0.64, wander: 28 },
    ],
  },
]

export const HIT_COIN_LEVEL = 6
export const HIT_COIN_FREE = 2
export const FREE_COMBO_BONUS = 1
export const FREE_COIN_CAP = 4
export const GOLDEN_EVERY = 8
export const GOLDEN_COINS = 8

export function levelById(id: string): LevelDef | undefined {
  return LEVELS.find((l) => l.id === id)
}

export function nextLevel(id: string): LevelDef | undefined {
  const i = LEVELS.findIndex((l) => l.id === id)
  return i >= 0 ? LEVELS[i + 1] : undefined
}
