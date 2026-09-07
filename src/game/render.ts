import type { BowDef } from '../data/bows'
import { ARCHER_X, ARCHER_Y, GROUND, H, W, predictPath, type Enemy, type World } from './sim'

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function sky(ctx: CanvasRenderingContext2D, world: World): void {
  const g = ctx.createLinearGradient(0, 0, 0, H)
  if (world.theme === 'night') {
    g.addColorStop(0, '#1a237e')
    g.addColorStop(0.55, '#283593')
    g.addColorStop(1, '#3949ab')
  } else if (world.theme === 'river') {
    g.addColorStop(0, '#4fc3f7')
    g.addColorStop(0.6, '#81d4fa')
    g.addColorStop(1, '#b3e5fc')
  } else {
    g.addColorStop(0, '#4dd0e1')
    g.addColorStop(0.45, '#81d4fa')
    g.addColorStop(1, '#fff59d')
  }
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
}

function sunMoon(ctx: CanvasRenderingContext2D, world: World): void {
  ctx.save()
  if (world.theme === 'night') {
    ctx.fillStyle = '#fff9c4'
    ctx.beginPath()
    ctx.arc(920, 90, 38, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#283593'
    ctx.beginPath()
    ctx.arc(934, 80, 30, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    for (let i = 0; i < 18; i++) {
      ctx.globalAlpha = 0.4 + ((i * 17) % 5) * 0.1
      ctx.beginPath()
      ctx.arc((i * 97) % W, 20 + ((i * 53) % 160), 1.2 + (i % 3), 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    ctx.fillStyle = '#ffe082'
    ctx.beginPath()
    ctx.arc(160, 96, 44, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fff59d'
    ctx.beginPath()
    ctx.arc(160, 96, 32, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,236,179,0.55)'
    ctx.lineWidth = 3
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + world.time * 0.15
      ctx.beginPath()
      ctx.moveTo(160 + Math.cos(a) * 52, 96 + Math.sin(a) * 52)
      ctx.lineTo(160 + Math.cos(a) * 68, 96 + Math.sin(a) * 68)
      ctx.stroke()
    }
  }
  ctx.restore()
}

function hills(ctx: CanvasRenderingContext2D, world: World): void {
  ctx.save()
  if (world.theme === 'night') ctx.fillStyle = '#1b5e20'
  else if (world.theme === 'river') ctx.fillStyle = '#66bb6a'
  else ctx.fillStyle = '#8bc34a'
  ctx.beginPath()
  ctx.moveTo(0, 360)
  ctx.quadraticCurveTo(220, 280, 420, 350)
  ctx.quadraticCurveTo(640, 420, 900, 330)
  ctx.quadraticCurveTo(1020, 290, W, 340)
  ctx.lineTo(W, H)
  ctx.lineTo(0, H)
  ctx.fill()

  if (world.theme === 'night') ctx.fillStyle = '#2e7d32'
  else if (world.theme === 'river') ctx.fillStyle = '#43a047'
  else ctx.fillStyle = '#7cb342'
  ctx.beginPath()
  ctx.moveTo(0, 430)
  ctx.quadraticCurveTo(300, 370, 560, 440)
  ctx.quadraticCurveTo(820, 500, W, 400)
  ctx.lineTo(W, H)
  ctx.lineTo(0, H)
  ctx.fill()

  if (world.theme === 'river') {
    const water = ctx.createLinearGradient(0, 470, 0, GROUND)
    water.addColorStop(0, '#29b6f6')
    water.addColorStop(1, '#0288d1')
    ctx.fillStyle = water
    ctx.globalAlpha = 0.55
    ctx.fillRect(0, 490, W, GROUND - 490)
    ctx.globalAlpha = 1
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'
    ctx.lineWidth = 2
    for (let i = 0; i < 6; i++) {
      ctx.beginPath()
      const y = 500 + i * 8
      ctx.moveTo(0, y)
      for (let x = 0; x < W; x += 30) {
        ctx.lineTo(x, y + Math.sin(x * 0.04 + world.time * 2 + i) * 3)
      }
      ctx.stroke()
    }
  }
  ctx.restore()
}

function trees(ctx: CanvasRenderingContext2D, world: World): void {
  const spots = [
    [70, 430, 1],
    [240, 450, 0.8],
    [980, 410, 1.1],
    [1060, 440, 0.75],
  ] as const
  for (const [x, y, s] of spots) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(s, s)
    ctx.fillStyle = '#6d4c41'
    ctx.fillRect(-8, -10, 16, 50)
    ctx.fillStyle = world.theme === 'night' ? '#1b5e20' : '#43a047'
    ctx.beginPath()
    ctx.arc(0, -28, 32, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = world.theme === 'night' ? '#33691e' : '#66bb6a'
    ctx.beginPath()
    ctx.arc(-16, -18, 20, 0, Math.PI * 2)
    ctx.arc(16, -16, 18, 0, Math.PI * 2)
    ctx.fill()
    if (world.theme === 'meadow') {
      ctx.fillStyle = '#ef5350'
      ctx.beginPath()
      ctx.arc(-8, -30, 4, 0, Math.PI * 2)
      ctx.arc(10, -22, 4, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
}

function ground(ctx: CanvasRenderingContext2D, world: World): void {
  const g = ctx.createLinearGradient(0, GROUND, 0, H)
  g.addColorStop(0, world.theme === 'night' ? '#33691e' : '#9ccc65')
  g.addColorStop(1, world.theme === 'night' ? '#1b5e20' : '#558b2f')
  ctx.fillStyle = g
  ctx.fillRect(0, GROUND, W, H - GROUND)
  ctx.fillStyle = world.theme === 'night' ? '#558b2f' : '#aed581'
  ctx.fillRect(0, GROUND, W, 8)
  ctx.fillStyle = '#7cb342'
  for (let x = 12; x < W; x += 22) {
    const h = 6 + ((x * 13) % 7)
    ctx.beginPath()
    ctx.moveTo(x, GROUND)
    ctx.lineTo(x + 3, GROUND - h)
    ctx.lineTo(x + 6, GROUND)
    ctx.fill()
  }
}

function drawBow(ctx: CanvasRenderingContext2D, bow: BowDef, angle: number, draw: number): void {
  ctx.save()
  ctx.translate(ARCHER_X + 10, ARCHER_Y - 56)
  ctx.rotate(angle)
  const bend = 46 + draw * 10
  ctx.strokeStyle = bow.wood
  ctx.lineWidth = 7
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, -bend)
  ctx.quadraticCurveTo(18 + draw * 8, 0, 0, bend)
  ctx.stroke()
  ctx.strokeStyle = bow.accent
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(0, -bend)
  ctx.lineTo(-22 - draw * 26, 0)
  ctx.lineTo(0, bend)
  ctx.stroke()
  ctx.fillStyle = bow.glow
  ctx.beginPath()
  ctx.arc(-22 - draw * 26, 0, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function archer(ctx: CanvasRenderingContext2D, world: World): void {
  const bounce = Math.sin(world.time * 3) * 1.4
  ctx.save()
  ctx.translate(0, bounce)
  ctx.fillStyle = '#5d4037'
  ctx.beginPath()
  ctx.ellipse(ARCHER_X - 8, ARCHER_Y, 10, 6, 0, 0, Math.PI * 2)
  ctx.ellipse(ARCHER_X + 10, ARCHER_Y, 10, 6, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#42a5f5'
  roundRect(ctx, ARCHER_X - 16, ARCHER_Y - 58, 32, 40, 10)
  ctx.fill()
  ctx.fillStyle = '#ffcc80'
  ctx.beginPath()
  ctx.arc(ARCHER_X, ARCHER_Y - 72, 18, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#6d4c41'
  ctx.beginPath()
  ctx.arc(ARCHER_X, ARCHER_Y - 80, 16, Math.PI, 0)
  ctx.fill()
  ctx.fillStyle = '#3e2723'
  ctx.beginPath()
  ctx.arc(ARCHER_X - 6, ARCHER_Y - 74, 2.2, 0, Math.PI * 2)
  ctx.arc(ARCHER_X + 6, ARCHER_Y - 74, 2.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#e57373'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(ARCHER_X, ARCHER_Y - 68, 6, 0.15, Math.PI - 0.15)
  ctx.stroke()
  ctx.fillStyle = '#42a5f5'
  ctx.fillRect(ARCHER_X + 10, ARCHER_Y - 52, 16, 8)
  drawBow(ctx, world.bow, world.bowAngle, world.drawAmt)
  ctx.restore()
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, t: number): void {
  ctx.save()
  if (!e.alive) {
    const s = Math.max(0, 1 - e.pop)
    ctx.globalAlpha = s
    ctx.translate(e.x, e.y)
    ctx.scale(1 + e.pop * 0.8, 1 - e.pop * 0.5)
    ctx.translate(-e.x, -e.y)
  }
  const bob = Math.sin(t * 3 + e.id) * 3
  ctx.translate(e.x, e.y + (e.kind === 'fox' ? 0 : bob))

  if (e.golden) {
    ctx.fillStyle = '#ffd54f'
    ctx.beginPath()
    ctx.arc(0, 0, 22, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ff8f00'
    ctx.beginPath()
    ctx.arc(-6, -4, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#8bc34a'
    ctx.beginPath()
    ctx.ellipse(10, -18, 8, 4, 0.6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fff59d'
    ctx.beginPath()
    ctx.arc(6, -6, 4, 0, Math.PI * 2)
    ctx.fill()
  } else if (e.kind === 'apple') {
    ctx.fillStyle = '#e53935'
    ctx.beginPath()
    ctx.arc(0, 2, 20, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#c62828'
    ctx.beginPath()
    ctx.arc(-6, 0, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#6d4c41'
    ctx.fillRect(-2, -22, 4, 10)
    ctx.fillStyle = '#7cb342'
    ctx.beginPath()
    ctx.ellipse(10, -18, 9, 5, 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(-6, -2, 3, 0, Math.PI * 2)
    ctx.arc(5, -2, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#333'
    ctx.beginPath()
    ctx.arc(-6, -2, 1.4, 0, Math.PI * 2)
    ctx.arc(5, -2, 1.4, 0, Math.PI * 2)
    ctx.fill()
  } else if (e.kind === 'balloon') {
    ctx.fillStyle = e.id % 2 === 0 ? '#29b6f6' : '#ec407a'
    ctx.beginPath()
    ctx.ellipse(0, -6, 18, 24, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.globalAlpha = 0.4
    ctx.beginPath()
    ctx.ellipse(-6, -12, 5, 8, -0.4, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.strokeStyle = '#90a4ae'
    ctx.beginPath()
    ctx.moveTo(0, 18)
    ctx.quadraticCurveTo(6, 28, 0, 40)
    ctx.stroke()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(-5, -10, 3, 0, Math.PI * 2)
    ctx.arc(6, -8, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#333'
    ctx.beginPath()
    ctx.arc(-5, -10, 1.3, 0, Math.PI * 2)
    ctx.arc(6, -8, 1.3, 0, Math.PI * 2)
    ctx.fill()
  } else if (e.kind === 'crow') {
    ctx.fillStyle = '#37474f'
    ctx.beginPath()
    ctx.ellipse(0, 0, 20, 14, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(-8, -14, 8, 10, -0.4, 0, Math.PI * 2)
    ctx.fill()
    const wing = Math.sin(t * 8 + e.id) * 10
    ctx.beginPath()
    ctx.ellipse(4, -6, 16, 7, -0.5 + wing * 0.04, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffb300'
    ctx.beginPath()
    ctx.moveTo(-16, -12)
    ctx.lineTo(-28, -8)
    ctx.lineTo(-16, -6)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(-10, -16, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#111'
    ctx.beginPath()
    ctx.arc(-10, -16, 1.4, 0, Math.PI * 2)
    ctx.fill()
  } else if (e.kind === 'fox') {
    ctx.fillStyle = '#fb8c00'
    ctx.beginPath()
    ctx.ellipse(0, 6, 26, 14, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(-16, -6, 12, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(-24, -14)
    ctx.lineTo(-20, -28)
    ctx.lineTo(-12, -14)
    ctx.moveTo(-10, -14)
    ctx.lineTo(-6, -28)
    ctx.lineTo(0, -12)
    ctx.fill()
    ctx.fillStyle = '#fff3e0'
    ctx.beginPath()
    ctx.arc(-16, -4, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#111'
    ctx.beginPath()
    ctx.arc(-19, -8, 1.6, 0, Math.PI * 2)
    ctx.arc(-12, -8, 1.6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#e53935'
    ctx.beginPath()
    ctx.arc(22, 4, 5, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.fillStyle = '#66bb6a'
    ctx.beginPath()
    ctx.ellipse(0, 6, 20, 18, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(0, -10, 16, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#43a047'
    ctx.beginPath()
    ctx.moveTo(-12, -20)
    ctx.lineTo(-8, -34)
    ctx.lineTo(-2, -18)
    ctx.moveTo(4, -18)
    ctx.lineTo(10, -34)
    ctx.lineTo(14, -18)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(-6, -12, 4, 0, Math.PI * 2)
    ctx.arc(6, -12, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#111'
    ctx.beginPath()
    ctx.arc(-6, -12, 1.6, 0, Math.PI * 2)
    ctx.arc(6, -12, 1.6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ef9a9a'
    ctx.beginPath()
    ctx.arc(0, -4, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#111'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, -2, 6, 0.2, Math.PI - 0.2)
    ctx.stroke()
  }
  ctx.restore()
}

function powerMeter(ctx: CanvasRenderingContext2D, world: World): void {
  if (!world.aiming && world.drawAmt < 0.04) return
  const x = ARCHER_X - 36
  const y = ARCHER_Y - 128
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  roundRect(ctx, x, y, 72, 12, 6)
  ctx.fill()
  const w = 68 * world.drawAmt
  ctx.fillStyle = world.drawAmt > 0.75 ? '#ef5350' : world.drawAmt > 0.4 ? '#ffca28' : '#66bb6a'
  roundRect(ctx, x + 2, y + 2, Math.max(4, w), 8, 4)
  ctx.fill()
}

function preview(ctx: CanvasRenderingContext2D, world: World): void {
  if (!world.aiming) return
  const pts = predictPath(world)
  const n = Math.min(pts.length, world.bow.dots)
  for (let i = 0; i < n; i++) {
    const p = pts[Math.floor((i / Math.max(1, n - 1)) * (pts.length - 1))]
    if (!p) continue
    const a = 0.55 * (1 - i / (n + 1))
    ctx.fillStyle = world.bow.id === 'willow' ? `rgba(255,255,255,${a * 0.45})` : world.bow.accent
    ctx.globalAlpha = a
    ctx.beginPath()
    ctx.arc(p.x, p.y, world.bow.id === 'willow' ? 2.4 : 3.3, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function arrow(ctx: CanvasRenderingContext2D, world: World): void {
  const s = world.shot
  if (!s) return
  ctx.save()
  ctx.translate(s.x, s.y)
  ctx.rotate(s.rot)
  ctx.fillStyle = world.bow.wood
  ctx.fillRect(-18, -2, 28, 4)
  ctx.fillStyle = world.bow.accent
  ctx.beginPath()
  ctx.moveTo(10, 0)
  ctx.lineTo(22, -6)
  ctx.lineTo(22, 6)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#eceff1'
  ctx.beginPath()
  ctx.moveTo(-18, 0)
  ctx.lineTo(-26, -6)
  ctx.lineTo(-22, 0)
  ctx.lineTo(-26, 6)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

export function drawWorld(ctx: CanvasRenderingContext2D, world: World): void {
  ctx.save()
  if (world.shake > 0.4) {
    ctx.translate((Math.random() - 0.5) * world.shake, (Math.random() - 0.5) * world.shake)
  }
  sky(ctx, world)
  sunMoon(ctx, world)
  hills(ctx, world)
  trees(ctx, world)
  ground(ctx, world)
  preview(ctx, world)
  powerMeter(ctx, world)
  for (const e of world.enemies) drawEnemy(ctx, e, world.time)
  archer(ctx, world)
  arrow(ctx, world)

  for (const p of world.particles) {
    ctx.globalAlpha = p.life / p.max
    ctx.fillStyle = p.color
    if (p.kind === 'star') {
      ctx.beginPath()
      ctx.moveTo(p.x, p.y - p.size)
      ctx.lineTo(p.x + p.size * 0.3, p.y - p.size * 0.3)
      ctx.lineTo(p.x + p.size, p.y)
      ctx.lineTo(p.x + p.size * 0.3, p.y + p.size * 0.3)
      ctx.lineTo(p.x, p.y + p.size)
      ctx.lineTo(p.x - p.size * 0.3, p.y + p.size * 0.3)
      ctx.lineTo(p.x - p.size, p.y)
      ctx.lineTo(p.x - p.size * 0.3, p.y - p.size * 0.3)
      ctx.closePath()
      ctx.fill()
    } else {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
  ctx.font = '800 22px "Baloo 2", sans-serif'
  ctx.textAlign = 'center'
  for (const f of world.floats) {
    ctx.globalAlpha = f.life / 50
    ctx.fillStyle = f.color
    ctx.strokeStyle = 'rgba(80,40,0,0.35)'
    ctx.lineWidth = 3
    ctx.strokeText(f.text, f.x, f.y)
    ctx.fillText(f.text, f.x, f.y)
  }
  ctx.globalAlpha = 1
  ctx.restore()
}
