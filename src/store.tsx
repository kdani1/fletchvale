import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { BOWS } from './data/bows'
import { LEVELS } from './data/levels'
import { audio } from './audio/engine'

const SAVE_KEY = 'nyilvölgy-save-v1'

export interface SaveData {
  coins: number
  ownedBows: string[]
  equippedBow: string
  stars: Record<string, number>
  cleared: Record<string, boolean>
  music: number
  sfx: number
  seenTutorial: boolean
}

function defaults(): SaveData {
  return {
    coins: 0,
    ownedBows: ['willow'],
    equippedBow: 'willow',
    stars: {},
    cleared: {},
    music: 0.55,
    sfx: 0.7,
    seenTutorial: false,
  }
}

function load(): SaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return defaults()
    const parsed = JSON.parse(raw) as Partial<SaveData>
    return { ...defaults(), ...parsed, ownedBows: parsed.ownedBows?.length ? parsed.ownedBows : ['willow'] }
  } catch {
    return defaults()
  }
}

function persist(data: SaveData): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data))
}

export type Screen = 'menu' | 'levels' | 'shop' | 'settings' | 'play' | 'free'

interface Store {
  save: SaveData
  screen: Screen
  playLevelId: string | null
  setScreen: (s: Screen) => void
  startLevel: (id: string) => void
  startFree: () => void
  addCoins: (n: number) => void
  buyBow: (id: string) => boolean
  equipBow: (id: string) => void
  recordClear: (levelId: string, stars: number, first: boolean) => void
  setMusic: (n: number) => void
  setSfx: (n: number) => void
  markTutorial: () => void
  isUnlocked: (levelId: string) => boolean
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [save, setSave] = useState<SaveData>(load)
  const [screen, setScreen] = useState<Screen>('menu')
  const [playLevelId, setPlayLevelId] = useState<string | null>(null)

  const api = useMemo<Store>(() => {
    const write = (fn: (prev: SaveData) => SaveData) => {
      setSave((prev) => {
        const next = fn(prev)
        persist(next)
        return next
      })
    }

    return {
      save,
      screen,
      playLevelId,
      setScreen: (s) => {
        audio.unlock()
        audio.startMusic()
        audio.click()
        setScreen(s)
      },
      startLevel: (id) => {
        audio.unlock()
        audio.startMusic()
        audio.click()
        setPlayLevelId(id)
        setScreen('play')
      },
      startFree: () => {
        audio.unlock()
        audio.startMusic()
        audio.click()
        setPlayLevelId(null)
        setScreen('free')
      },
      addCoins: (n) => {
        if (n <= 0) return
        write((p) => ({ ...p, coins: p.coins + n }))
      },
      buyBow: (id) => {
        const bow = BOWS.find((b) => b.id === id)
        if (!bow) return false
        let ok = false
        write((p) => {
          if (p.ownedBows.includes(id) || p.coins < bow.price) return p
          ok = true
          return {
            ...p,
            coins: p.coins - bow.price,
            ownedBows: [...p.ownedBows, id],
            equippedBow: id,
          }
        })
        if (ok) audio.coin()
        return ok
      },
      equipBow: (id) => {
        write((p) => (p.ownedBows.includes(id) ? { ...p, equippedBow: id } : p))
        audio.click()
      },
      recordClear: (levelId, stars, first) => {
        write((p) => {
          const prev = p.stars[levelId] ?? 0
          return {
            ...p,
            cleared: { ...p.cleared, [levelId]: true },
            stars: { ...p.stars, [levelId]: Math.max(prev, stars) },
            seenTutorial: first ? true : p.seenTutorial,
          }
        })
      },
      setMusic: (n) => {
        audio.setMusic(n)
        write((p) => ({ ...p, music: n }))
      },
      setSfx: (n) => {
        audio.setSfx(n)
        write((p) => ({ ...p, sfx: n }))
      },
      markTutorial: () => write((p) => ({ ...p, seenTutorial: true })),
      isUnlocked: (levelId) => {
        const i = LEVELS.findIndex((l) => l.id === levelId)
        if (i <= 0) return true
        const prev = LEVELS[i - 1]
        return Boolean(prev && save.cleared[prev.id])
      },
    }
  }, [save, screen, playLevelId])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const v = useContext(Ctx)
  if (!v) throw new Error('Store missing')
  return v
}
