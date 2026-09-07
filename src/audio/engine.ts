import { clamp } from '../lib/math'

const MELODY: Array<[number, number]> = [
  [0, 0.28],
  [4, 0.28],
  [7, 0.28],
  [4, 0.28],
  [2, 0.28],
  [4, 0.28],
  [7, 0.5],
  [5, 0.28],
  [9, 0.28],
  [12, 0.28],
  [9, 0.28],
  [7, 0.28],
  [4, 0.28],
  [0, 0.5],
  [4, 0.28],
  [7, 0.28],
  [11, 0.28],
  [7, 0.28],
  [12, 0.28],
  [7, 0.28],
  [4, 0.5],
  [5, 0.28],
  [4, 0.28],
  [2, 0.28],
  [0, 0.28],
  [2, 0.28],
  [4, 0.28],
  [0, 0.7],
]

function midi(semis: number): number {
  return 261.63 * 2 ** (semis / 12)
}

class GameAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private musicGain: GainNode | null = null
  private sfxGain: GainNode | null = null
  private musicTimer: number | null = null
  private step = 0
  private musicOn = false
  private tension: OscillatorNode | null = null
  private tensionGain: GainNode | null = null
  musicVol = 0.55
  sfxVol = 0.7

  unlock(): void {
    if (this.ctx) {
      void this.ctx.resume()
      return
    }
    const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    this.ctx = new Ctx()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.9
    this.master.connect(this.ctx.destination)
    this.musicGain = this.ctx.createGain()
    this.sfxGain = this.ctx.createGain()
    this.musicGain.gain.value = this.musicVol * 0.22
    this.sfxGain.gain.value = this.sfxVol
    this.musicGain.connect(this.master)
    this.sfxGain.connect(this.master)
    void this.ctx.resume()
  }

  setMusic(vol: number): void {
    this.musicVol = clamp(vol, 0, 1)
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(this.musicVol * 0.22, this.ctx.currentTime, 0.05)
    }
  }

  setSfx(vol: number): void {
    this.sfxVol = clamp(vol, 0, 1)
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(this.sfxVol, this.ctx.currentTime, 0.04)
    }
  }

  startMusic(): void {
    this.unlock()
    if (!this.ctx || this.musicOn) return
    this.musicOn = true
    this.schedule()
  }

  stopMusic(): void {
    this.musicOn = false
    if (this.musicTimer != null) {
      window.clearTimeout(this.musicTimer)
      this.musicTimer = null
    }
  }

  private schedule(): void {
    if (!this.ctx || !this.musicGain || !this.musicOn) return
    const [semi, dur] = MELODY[this.step % MELODY.length]!
    this.step += 1
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    const filt = this.ctx.createBiquadFilter()
    filt.type = 'lowpass'
    filt.frequency.value = 1400
    osc.type = 'triangle'
    osc.frequency.value = midi(semi)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.03)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.92)
    osc.connect(filt)
    filt.connect(g)
    g.connect(this.musicGain)
    osc.start(t)
    osc.stop(t + dur)

    if (this.step % 4 === 1) {
      const pad = this.ctx.createOscillator()
      const pg = this.ctx.createGain()
      pad.type = 'sine'
      pad.frequency.value = midi(semi - 12)
      pg.gain.setValueAtTime(0.05, t)
      pg.gain.exponentialRampToValueAtTime(0.0001, t + dur * 2.2)
      pad.connect(pg)
      pg.connect(this.musicGain)
      pad.start(t)
      pad.stop(t + dur * 2.2)
    }

    this.musicTimer = window.setTimeout(() => this.schedule(), dur * 1000)
  }

  private beep(freq: number, dur: number, type: OscillatorType, vol: number, slide = 0): void {
    this.unlock()
    if (!this.ctx || !this.sfxGain) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(t)
    osc.stop(t + dur + 0.02)
  }

  click(): void {
    this.beep(720, 0.08, 'triangle', 0.12, -80)
  }

  coin(): void {
    this.beep(880, 0.09, 'sine', 0.14, 220)
    this.beep(1320, 0.12, 'sine', 0.08, 80)
  }

  drawStart(): void {
    this.unlock()
    if (!this.ctx || !this.sfxGain || this.tension) return
    const osc = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(180, this.ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(320, this.ctx.currentTime + 0.8)
    g.gain.value = 0.05
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start()
    this.tension = osc
    this.tensionGain = g
  }

  drawEnd(): void {
    if (this.tension) {
      try {
        this.tension.stop()
      } catch {
        /* already stopped */
      }
      this.tension.disconnect()
      this.tensionGain?.disconnect()
      this.tension = null
      this.tensionGain = null
    }
  }

  shoot(): void {
    this.drawEnd()
    this.beep(240, 0.12, 'sawtooth', 0.07, -140)
    this.beep(520, 0.08, 'triangle', 0.08, -200)
  }

  hit(): void {
    this.beep(523, 0.1, 'triangle', 0.14)
    this.beep(784, 0.14, 'sine', 0.1)
  }

  miss(): void {
    this.beep(110, 0.14, 'sine', 0.1, -40)
  }

  win(): void {
    this.beep(523, 0.12, 'triangle', 0.12)
    window.setTimeout(() => this.beep(659, 0.12, 'triangle', 0.12), 90)
    window.setTimeout(() => this.beep(784, 0.18, 'triangle', 0.14), 180)
    window.setTimeout(() => this.beep(1046, 0.28, 'sine', 0.12), 280)
  }

  lose(): void {
    this.beep(392, 0.16, 'triangle', 0.1, -50)
    window.setTimeout(() => this.beep(311, 0.22, 'sine', 0.1, -40), 140)
  }

  pop(): void {
    this.beep(640, 0.07, 'square', 0.05, 180)
  }
}

export const audio = new GameAudio()
