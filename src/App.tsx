import { useEffect } from 'react'
import { audio } from './audio/engine'
import { Levels } from './screens/Levels'
import { Menu } from './screens/Menu'
import { Play } from './screens/Play'
import { Settings } from './screens/Settings'
import { Shop } from './screens/Shop'
import { useStore } from './store'

const BACKGROUNDS: Record<string, string> = {
  menu: 'from-sky-300 via-cyan-200 to-lime-200',
  levels: 'from-green-300 via-lime-200 to-yellow-200',
  shop: 'from-orange-300 via-amber-200 to-rose-200',
  settings: 'from-violet-300 via-fuchsia-200 to-sky-200',
  play: 'from-sky-400 via-sky-200 to-emerald-200',
  free: 'from-cyan-300 via-teal-200 to-amber-200',
}

export default function App() {
  const { screen, save } = useStore()

  useEffect(() => {
    audio.setMusic(save.music)
    audio.setSfx(save.sfx)
  }, [save.music, save.sfx])

  useEffect(() => {
    const unlock = () => {
      audio.unlock()
      audio.startMusic()
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    return () => window.removeEventListener('pointerdown', unlock)
  }, [])

  const play = screen === 'play' || screen === 'free'

  return (
    <div className={`min-h-full bg-gradient-to-b ${BACKGROUNDS[screen]} ${play ? 'h-full overflow-hidden' : 'overflow-y-auto'}`}>
      {screen === 'menu' && <Menu />}
      {screen === 'levels' && <Levels />}
      {screen === 'shop' && <Shop />}
      {screen === 'settings' && <Settings />}
      {screen === 'play' && <Play mode="campaign" />}
      {screen === 'free' && <Play mode="free" />}
    </div>
  )
}
