import { TILE, MAP_COLS, MAP_ROWS, MAP_W, BUILDINGS } from '../data/gameConfig'

// Tile types
const T = {
  GRASS:   0,
  DIRT:    1,
  ROAD:    2,
  WATER:   3,
  SAND:    4,
  STONE:   5,
  DARK:    6,
} as const

type TileType = typeof T[keyof typeof T]

// Colors per tile
const TILE_COLORS: Record<TileType, string[]> = {
  [T.GRASS]: ['#4a7c4e','#4d8050','#4a7c4e','#56905a'],
  [T.DIRT]:  ['#8b6914','#9a7520','#8b6914'],
  [T.ROAD]:  ['#787060','#706860','#787060'],
  [T.WATER]: ['#1a6fa8','#1e7ab5','#165f94'],
  [T.SAND]:  ['#c8a464','#d4ad6a','#c8a464'],
  [T.STONE]: ['#6b7280','#5f6672','#6b7280'],
  [T.DARK]:  ['#2d1a4a','#1e1030','#2d1a4a'],
}

function makeTileMap(): TileType[][] {
  const map: TileType[][] = Array.from({ length: MAP_ROWS }, () =>
    Array(MAP_COLS).fill(T.GRASS)
  )
  // Horizontal road at row 11
  for (let c = 0; c < MAP_COLS; c++) map[11][c] = T.ROAD
  // Vertical road at col 9-10
  for (let r = 0; r < MAP_ROWS; r++) map[r][9] = T.ROAD
  // River at rows 25-26
  for (let c = 0; c < MAP_COLS; c++) {
    map[25][c] = T.WATER
    map[26][c] = T.WATER
  }
  // Sandy riverbank
  for (let c = 0; c < MAP_COLS; c++) {
    map[24][c] = T.SAND
    map[27][c] = T.SAND
  }
  // Stone path to secret cave
  for (let c = 30; c < MAP_COLS; c++) map[3][c] = T.STONE
  // Dark area around cave
  for (let r = 0; r < 7; r++) for (let c = 30; c < MAP_COLS; c++) map[r][c] = T.DARK
  return map
}

const TILE_MAP = makeTileMap()

// Tree positions (tile coords)
const TREES = [
  [0,0],[1,0],[2,0],[0,1],[1,1],[0,2],[1,2],
  [0,6],[1,7],[2,6],[0,8],[1,8],
  [29,0],[30,0],[31,0],[29,1],[30,1],[31,1],
  [29,5],[30,6],[31,5],
  [0,12],[1,12],[0,13],[1,13],[0,15],[1,15],
  [0,16],[0,20],[1,21],[0,21],
  [36,7],[37,7],[38,7],[36,8],[37,8],
  [10,28],[11,29],[10,29],[12,28],[13,29],
  [20,29],[21,29],[22,29],[20,30],[22,30],
  [36,27],[37,28],[38,27],[36,28],[38,28],
]

// Cloud positions (world px, animate via offset)
export const CLOUD_DEFS = [
  { wx: 120, wy: 60,  w: 120, h: 50 },
  { wx: 400, wy: 30,  w: 100, h: 40 },
  { wx: 700, wy: 80,  w: 140, h: 55 },
  { wx: 1100,wy: 50,  w: 110, h: 45 },
  { wx: 1400,wy: 20,  w: 130, h: 50 },
  { wx: 1650,wy: 70,  w: 95,  h: 38 },
]

export class World {
  private tileVariant: number[][]
  waterOffset = 0
  windOffset = 0

  constructor() {
    // Pre-randomize tile variants for visual variety
    this.tileVariant = Array.from({ length: MAP_ROWS }, (_, r) =>
      Array.from({ length: MAP_COLS }, (_, c) =>
        Math.floor(Math.sin(r * 37 + c * 17) * 100) % 3
      )
    )
  }

  update(dt: number) {
    this.waterOffset = (this.waterOffset + dt * 0.001) % (Math.PI * 2)
    this.windOffset  = (this.windOffset  + dt * 0.0008) % (Math.PI * 2)
  }

  /** Returns true if the given world-pixel rect collides with a blocked tile */
  isBlocked(wx: number, wy: number, w: number, h: number): boolean {
    const left   = Math.floor(wx / TILE)
    const right  = Math.floor((wx + w - 1) / TILE)
    const top    = Math.floor(wy / TILE)
    const bottom = Math.floor((wy + h - 1) / TILE)
    for (let r = top; r <= bottom; r++) {
      for (let c = left; c <= right; c++) {
        if (r < 0 || r >= MAP_ROWS || c < 0 || c >= MAP_COLS) return true
        const t = TILE_MAP[r]?.[c]
        if (t === T.WATER) return true
      }
    }
    // Check buildings
    for (const b of BUILDINGS) {
      const bLeft   = b.tileX * TILE
      const bTop    = b.tileY * TILE
      const bRight  = (b.tileX + b.widthTiles) * TILE
      const bBottom = (b.tileY + b.heightTiles) * TILE
      // Door gap
      const doorLeft  = (b.tileX + b.doorTileX) * TILE
      const doorRight = doorLeft + TILE
      const doorTop   = (b.tileY + b.doorTileY) * TILE
      const isDoor = wx + w > doorLeft && wx < doorRight && wy + h > doorTop && wy + h <= bBottom + 4
      if (isDoor) continue
      // Collision with building body (excluding door column bottom)
      if (wx + w > bLeft && wx < bRight && wy + h > bTop && wy < bBottom) {
        if (!(wx + w > doorLeft && wx < doorRight && wy + h > doorTop)) return true
      }
    }
    return false
  }

  drawGround(ctx: CanvasRenderingContext2D, camX: number, camY: number, viewW: number, viewH: number, ts: number) {
    const startC = Math.max(0, Math.floor(camX / TILE))
    const startR = Math.max(0, Math.floor(camY / TILE))
    const endC   = Math.min(MAP_COLS - 1, Math.ceil((camX + viewW) / TILE))
    const endR   = Math.min(MAP_ROWS - 1, Math.ceil((camY + viewH) / TILE))

    for (let r = startR; r <= endR; r++) {
      for (let c = startC; c <= endC; c++) {
        const tile  = TILE_MAP[r][c]
        const ix    = Math.abs(this.tileVariant[r][c]) % TILE_COLORS[tile].length
        ctx.fillStyle = TILE_COLORS[tile][ix]
        ctx.fillRect(c * TILE, r * TILE, TILE, TILE)
        
        // Water animation (Flowing River)
        if (tile === T.WATER) {
          // Flowing foam lines
          const flow = (this.waterOffset * 20 + c * 10) % TILE
          ctx.fillStyle = 'rgba(255,255,255,0.15)'
          ctx.beginPath()
          ctx.roundRect(c * TILE + flow, r * TILE + TILE * 0.3, TILE * 0.4, 2, 1)
          ctx.fill()
          
          const flow2 = (this.waterOffset * 15 + c * 15 + 20) % TILE
          ctx.beginPath()
          ctx.roundRect(c * TILE + flow2, r * TILE + TILE * 0.7, TILE * 0.3, 2, 1)
          ctx.fill()

          // Bobbing waves overlay
          const wave = Math.sin(this.waterOffset * 2 + c * 0.5 + r * 0.3) * 4
          ctx.fillStyle = 'rgba(100,200,255,0.25)'
          ctx.fillRect(c * TILE, r * TILE + TILE / 2 + wave, TILE, TILE / 2 - wave)
          
          // Random Fish Jumping
          if (c % 4 === 0 && r === 25) {
            const fishTime = (ts * 0.002 + c) % 10
            if (fishTime < Math.PI) {
              const jumpY = Math.sin(fishTime) * 15
              ctx.fillStyle = '#f97316' // orange fish
              ctx.beginPath()
              ctx.ellipse(c * TILE + TILE/2, r * TILE + TILE - jumpY, 6, 3, Math.PI/6, 0, Math.PI * 2)
              ctx.fill()
              // Fish tail
              ctx.beginPath()
              ctx.moveTo(c * TILE + TILE/2 - 4, r * TILE + TILE - jumpY)
              ctx.lineTo(c * TILE + TILE/2 - 8, r * TILE + TILE - jumpY - 4)
              ctx.lineTo(c * TILE + TILE/2 - 8, r * TILE + TILE - jumpY + 4)
              ctx.fill()
            }
          }
        }
        // Road center line
        if (tile === T.ROAD) {
          ctx.strokeStyle = 'rgba(255,255,200,0.3)'
          ctx.setLineDash([TILE / 3, TILE / 3])
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(c * TILE + TILE / 2, r * TILE + 4)
          ctx.lineTo(c * TILE + TILE / 2, r * TILE + TILE - 4)
          ctx.stroke()
          ctx.setLineDash([])
        }
      }
    }

    // Draw fishing boat
    const boatX = (ts * 0.03) % (MAP_W + 100) - 50
    const boatY = 25 * TILE + 20 + Math.sin(ts * 0.002) * 5
    if (boatX > camX - 100 && boatX < camX + viewW + 100) {
      ctx.save()
      // Boat shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)'
      ctx.beginPath()
      ctx.ellipse(boatX + 25, boatY + 12, 25, 6, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Boat hull
      ctx.fillStyle = '#78350f' // dark brown wood
      ctx.beginPath()
      ctx.moveTo(boatX, boatY)
      ctx.lineTo(boatX + 40, boatY)
      ctx.lineTo(boatX + 50, boatY - 10)
      ctx.lineTo(boatX - 10, boatY - 10)
      ctx.fill()
      
      // Boat cabin
      ctx.fillStyle = '#fef3c7'
      ctx.fillRect(boatX + 10, boatY - 25, 20, 15)
      ctx.fillStyle = '#92400e' // roof
      ctx.fillRect(boatX + 8, boatY - 28, 24, 4)
      
      // Fishing rod
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(boatX + 20, boatY - 20)
      ctx.lineTo(boatX + 60, boatY - 40)
      ctx.stroke()
      // Fishing line
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(boatX + 60, boatY - 40)
      ctx.lineTo(boatX + 60, boatY + 10)
      ctx.stroke()
      
      ctx.restore()
    }
  }

  drawTrees(ctx: CanvasRenderingContext2D, camX: number, camY: number, viewW: number, viewH: number, ts: number) {
    for (const [c, r] of TREES) {
      const wx = c * TILE
      const wy = r * TILE
      if (wx + TILE < camX || wx > camX + viewW) continue
      if (wy + TILE * 2 < camY || wy > camY + viewH) continue
      this.drawTree(ctx, wx + TILE / 2, wy + TILE, ts, c + r)
    }
  }

  private drawTree(ctx: CanvasRenderingContext2D, cx: number, baseY: number, ts: number, seed: number) {
    const sway = Math.sin(this.windOffset + seed * 1.3) * 2
    // Trunk
    ctx.fillStyle = '#5c3d1a'
    ctx.fillRect(cx - 4 + sway * 0.3, baseY - 20, 8, 20)
    // Canopy layers
    const greens = ['#2d6a30','#3d8a40','#4aaa50']
    for (let i = 0; i < 3; i++) {
      const r = 20 - i * 3
      const yOff = -(30 + i * 10) + Math.sin(this.windOffset * 1.2 + seed + i) * sway
      ctx.fillStyle = greens[i]
      ctx.beginPath()
      ctx.arc(cx + sway, baseY + yOff, r, 0, Math.PI * 2)
      ctx.fill()
    }
    void ts
  }

  drawBuildings(ctx: CanvasRenderingContext2D, camX: number, camY: number, viewW: number, viewH: number, ts: number) {
    for (const b of BUILDINGS) {
      const bx = b.tileX * TILE
      const by = b.tileY * TILE
      const bw = b.widthTiles * TILE
      const bh = b.heightTiles * TILE
      if (bx + bw < camX || bx > camX + viewW || by + bh < camY || by > camY + viewH) continue

      // 1. Soft drop shadow on the ground
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.beginPath()
      ctx.roundRect(bx - 10, by + bh - 15, bw + 20, 30, 10)
      ctx.fill()

      // Glow pulse
      const glow = Math.sin(ts * 0.002 + b.tileX) * 0.3 + 0.7

      // ── SECRET CAVE SPECIAL RENDER ──
      if (b.id === 'secret') {
        const cx = bx + bw / 2
        ctx.save()
        
        // Rocky Mound (The Cave)
        ctx.fillStyle = '#1e1b2e' // Dark purple/slate rock
        ctx.beginPath()
        ctx.moveTo(bx - 15, by + bh)
        ctx.quadraticCurveTo(bx + bw*0.1, by - 25, cx, by - 30)
        ctx.quadraticCurveTo(bx + bw*0.9, by - 25, bx + bw + 15, by + bh)
        ctx.closePath()
        ctx.fill()
        
        // Rock Texture / Ridges
        ctx.strokeStyle = '#2d2645'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(bx + 15, by + bh)
        ctx.quadraticCurveTo(bx + bw*0.3, by + 10, cx - 15, by - 5)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(bx + bw - 15, by + bh)
        ctx.quadraticCurveTo(bx + bw*0.7, by + 10, cx + 15, by - 5)
        ctx.stroke()
        
        // Glowing Portal Entrance
        const doorX = bx + b.doorTileX * TILE
        const doorY = by + b.doorTileY * TILE - 15
        const doorW = TILE
        const doorH = TILE + 15
        
        ctx.shadowColor = b.glowColor
        ctx.shadowBlur = 40 * glow
        
        const portalGrad = ctx.createLinearGradient(doorX, doorY, doorX, doorY + doorH)
        portalGrad.addColorStop(0, '#f8fafc') // bright core
        portalGrad.addColorStop(1, '#94a3b8')
        
        ctx.fillStyle = portalGrad
        ctx.beginPath()
        ctx.ellipse(doorX + doorW/2, doorY + doorH/2, doorW/2 + 2, doorH/2, 0, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
        
        // Floating icon above cave
        const floatY = by - 25 + Math.sin(ts * 0.003 + b.tileX) * 5
        ctx.font = '24px serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = 'white'
        ctx.shadowColor = b.color
        ctx.shadowBlur = 12
        ctx.fillText(b.floatIcon, bx + bw / 2, floatY)
        ctx.shadowBlur = 0

        // Cave Label (Neon Signage)
        ctx.save()
        ctx.font = 'bold 22px "Courier New"'
        ctx.fillStyle = b.color + 'cc' // Slightly transparent
        ctx.shadowColor = b.glowColor
        ctx.shadowBlur = 15
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(b.label.toUpperCase(), bx + bw / 2, by + bh * 0.25)
        ctx.restore()

        continue // skip rest of standard building drawing
      }

      // ── STANDARD BUILDING RENDER ──
      ctx.save()
      ctx.shadowColor = b.glowColor
      ctx.shadowBlur  = 25 * glow
      
      ctx.fillStyle = '#0b1120'
      ctx.strokeStyle = b.color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(bx, by, bw, bh, 8)
      ctx.fill()
      ctx.stroke()
      ctx.restore()

      // 3. Futuristic Roof
      const roofH = bh * 0.65
      const roofGrad = ctx.createLinearGradient(bx, by, bx, by + roofH)
      roofGrad.addColorStop(0, '#1e293b')
      roofGrad.addColorStop(1, '#0f172a')
      
      ctx.fillStyle = roofGrad
      ctx.beginPath()
      ctx.roundRect(bx, by, bw, roofH, [8, 8, 0, 0])
      ctx.fill()

      // Roof details (Neon Grid)
      ctx.save()
      ctx.strokeStyle = b.color + '30'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 15; i < bw; i += 20) {
        ctx.moveTo(bx + i, by)
        ctx.lineTo(bx + i, by + roofH)
      }
      for (let i = 15; i < roofH; i += 20) {
        ctx.moveTo(bx, by + i)
        ctx.lineTo(bx + bw, by + i)
      }
      ctx.stroke()
      ctx.restore()

      // Roof edge glowing lip
      ctx.fillStyle = b.color
      ctx.shadowColor = b.glowColor
      ctx.shadowBlur = 10
      ctx.fillRect(bx, by + roofH, bw, 3)
      ctx.shadowBlur = 0

      // 4. Front Wall Details (Windows)
      const windowY = by + roofH + 12
      const windowW = 18
      const windowH = 14
      const dx = bx + b.doorTileX * TILE + TILE / 4
      const dw = TILE / 2

      ctx.fillStyle = b.color + '60'
      ctx.shadowColor = b.glowColor
      ctx.shadowBlur = 8
      
      // Left windows
      if (dx - bx > windowW + 15) {
        ctx.beginPath()
        ctx.roundRect(bx + 15, windowY, windowW, windowH, 3)
        ctx.fill()
        if (dx - bx > windowW * 2 + 25) {
           ctx.beginPath()
           ctx.roundRect(bx + windowW + 25, windowY, windowW, windowH, 3)
           ctx.fill()
        }
      }
      
      // Right windows
      if ((bx + bw) - (dx + dw) > windowW + 15) {
        ctx.beginPath()
        ctx.roundRect(bx + bw - 15 - windowW, windowY, windowW, windowH, 3)
        ctx.fill()
        if ((bx + bw) - (dx + dw) > windowW * 2 + 25) {
           ctx.beginPath()
           ctx.roundRect(bx + bw - windowW * 2 - 25, windowY, windowW, windowH, 3)
           ctx.fill()
        }
      }
      ctx.shadowBlur = 0

      // 5. Sci-Fi Automatic Door
      const dy = by + b.doorTileY * TILE
      const doorH = TILE - 4
      
      ctx.fillStyle = '#020617'
      ctx.strokeStyle = b.color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(dx, dy + 4, dw, doorH, [6, 6, 0, 0])
      ctx.fill()
      ctx.stroke()
      
      // Glass panels
      ctx.fillStyle = b.color + '25'
      ctx.fillRect(dx + 3, dy + 7, dw - 6, doorH - 3)
      
      // Center split (sliding doors)
      ctx.fillStyle = b.color
      ctx.fillRect(dx + dw/2 - 1, dy + 8, 2, doorH - 4)

      // 6. Floating icon above building
      const floatY = by - 25 + Math.sin(ts * 0.003 + b.tileX) * 5
      ctx.font = '24px serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = 'white'
      ctx.shadowColor = b.color
      ctx.shadowBlur = 12
      ctx.fillText(b.floatIcon, bx + bw / 2, floatY)
      ctx.shadowBlur = 0

      // 7. Roof Label (Neon Signage)
      ctx.save()
      ctx.font = 'bold 22px "Courier New"'
      ctx.fillStyle = b.color + 'cc' // Slightly transparent
      ctx.shadowColor = b.glowColor
      ctx.shadowBlur = 15
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(b.label.toUpperCase(), bx + bw / 2, by + roofH / 2)
      ctx.restore()
    }
  }

  drawClouds(ctx: CanvasRenderingContext2D, cloudOffset: number) {
    ctx.save()
    ctx.globalAlpha = 0.7
    for (const cd of CLOUD_DEFS) {
      const cx = (cd.wx + cloudOffset) % (MAP_W + 200) - 100
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.beginPath()
      ctx.ellipse(cx, cd.wy, cd.w / 2, cd.h / 2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(cx - cd.w / 4, cd.wy + 10, cd.w / 3, cd.h / 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(cx + cd.w / 4, cd.wy + 8, cd.w / 3.5, cd.h / 3, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
}
