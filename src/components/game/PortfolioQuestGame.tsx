'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { TILE, MAP_W, BUILDINGS, NPCS, COLLECTIBLES, DAY_NIGHT_CYCLE_MS, SPAWN_TILE_X, SPAWN_TILE_Y, SectionKey } from './data/gameConfig'
import { GameLoop }          from './engine/GameLoop'
import { InputManager }      from './engine/InputManager'
import { Camera }            from './engine/Camera'
import { World }             from './engine/World'
import { Player }            from './engine/Player'
import { NPC }               from './engine/NPC'
import { AudioManager }      from './engine/AudioManager'
import { SaveSystem }        from './engine/SaveSystem'
import { ParticleSystem }    from './engine/ParticleSystem'
import { AchievementSystem, AchievementEvent } from './engine/AchievementSystem'
import { GameHUD }           from './ui/GameHUD'
import { BuildingModal }     from './ui/BuildingModal'
import { StartScreen }       from './ui/StartScreen'
import { SettingsPanel }     from './ui/SettingsPanel'
import { AchievementToast }  from './ui/AchievementToast'
import { TouchJoystick }     from './ui/TouchJoystick'
import { NPCDialog }         from './ui/NPCDialog'

type GamePhase = 'start' | 'playing' | 'paused'

interface CollectibleState {
  id: string
  type: 'coin' | 'star' | 'key'
  x: number
  y: number
  collected: boolean
}

export default function PortfolioQuestGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase]         = useState<GamePhase>('start')
  const [openSection, setOpenSection] = useState<SectionKey | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [achievementEv, setAchievementEv] = useState<AchievementEvent | null>(null)
  const [npcMessage, setNpcMessage] = useState<{ text: string; name: string } | null>(null)
  const [dayProgress, setDayProgress] = useState(0)
  const [hudSave, setHudSave]     = useState<ReturnType<SaveSystem['getSave']> | null>(null)
  const [nearBuilding, setNearBuilding] = useState<SectionKey | null>(null)
  const [isMobile, setIsMobile]   = useState(false)

  // Engine refs
  const loopRef        = useRef<GameLoop | null>(null)
  const inputRef       = useRef<InputManager>(new InputManager())
  const cameraRef      = useRef<Camera | null>(null)
  const worldRef       = useRef<World>(new World())
  const playerRef      = useRef<Player | null>(null)
  const npcsRef        = useRef<NPC[]>(NPCS.map(cfg => new NPC(cfg)))
  const audioRef       = useRef<AudioManager>(new AudioManager())
  const saveRef        = useRef<SaveSystem>(new SaveSystem())
  const particleRef    = useRef<ParticleSystem>(new ParticleSystem())
  const achieveRef     = useRef<AchievementSystem | null>(null)
  const collectiblesRef = useRef<CollectibleState[]>([])
  const cloudOffsetRef = useRef(0)
  const birdsRef       = useRef<Array<{ x: number; y: number; speed: number; flap: number }>>([])
  const npcCooldownRef = useRef<Record<string, number>>({})
  const gameStartedAt  = useRef(0)
  const achieveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  // Track UI state for the game loop without triggering a loop restart
  const uiStateRef = useRef({ openSection, showSettings, npcMessage })
  useEffect(() => {
    uiStateRef.current = { openSection, showSettings, npcMessage }
  }, [openSection, showSettings, npcMessage])

  // Init collectibles from save
  useEffect(() => {
    const save = saveRef.current.getSave()
    const world = worldRef.current
    collectiblesRef.current = COLLECTIBLES.map(c => {
      // Pick random valid tile above river (rows 0-23)
      let tx = c.tileX, ty = c.tileY
      for (let i = 0; i < 50; i++) {
        tx = Math.floor(Math.random() * 40) // MAP_COLS
        ty = Math.floor(Math.random() * 24) // Above river
        if (!world.isBlocked(tx * 48 + 24, ty * 48 + 24, 4, 4)) break
      }
      return {
        id: c.id, type: c.type,
        x: tx * 48, y: ty * 48, // 48 is TILE
        collected: save.collectedIds.includes(c.id),
      }
    })
    setHudSave({ ...save })
    setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
  }, [])

  // Achievement handler
  const showAchievement = useCallback((ev: AchievementEvent) => {
    setAchievementEv(ev)
    audioRef.current.playAchievement()
    if (achieveTimeout.current) clearTimeout(achieveTimeout.current)
    achieveTimeout.current = setTimeout(() => setAchievementEv(null), 3500)
  }, [])

  // Start / continue game
  const startGame = useCallback((isNew: boolean) => {
    try {
      const save = saveRef.current.getSave()
      if (isNew) {
        saveRef.current.reset()
        const world = worldRef.current
        collectiblesRef.current = COLLECTIBLES.map(c => {
          let tx = c.tileX, ty = c.tileY
          for (let i = 0; i < 50; i++) {
            tx = Math.floor(Math.random() * 40)
            ty = Math.floor(Math.random() * 24)
            if (!world.isBlocked(tx * 48 + 24, ty * 48 + 24, 4, 4)) break
          }
          return {
            id: c.id, type: c.type,
            x: tx * 48, y: ty * 48,
            collected: false,
          }
        })
      }
      const tx = isNew ? SPAWN_TILE_X : (save.playerTileX ?? SPAWN_TILE_X)
      const ty = isNew ? SPAWN_TILE_Y : (save.playerTileY ?? SPAWN_TILE_Y)
      playerRef.current = new Player(tx, ty)

      const canvas = canvasRef.current
      if (!canvas) {
        console.error('[PortfolioQuest] Canvas ref is null — cannot start game')
        return
      }
      // Use window dimensions as reliable fallback (canvas may be 0 during paint)
      const w = canvas.offsetWidth  > 0 ? canvas.offsetWidth  : window.innerWidth
      const h = canvas.offsetHeight > 0 ? canvas.offsetHeight : window.innerHeight
      canvas.width  = w
      canvas.height = h
      cameraRef.current = new Camera(w, h)

      achieveRef.current = new AchievementSystem(showAchievement)
      inputRef.current.attach(window)
      audioRef.current.start()
      saveRef.current.startAutoSave()
      gameStartedAt.current = performance.now()

      // Init birds
      birdsRef.current = Array.from({ length: 8 }, () => ({
        x: Math.random() * MAP_W,
        y: Math.random() * 200 + 20,
        speed: 40 + Math.random() * 40,
        flap: Math.random() * Math.PI * 2,
      }))

      setHudSave({ ...saveRef.current.getSave() })
      setPhase('playing')
    } catch (err) {
      console.error('[PortfolioQuest] startGame error:', err)
    }
  }, [showAchievement])

  // Game loop
  useEffect(() => {
    if (phase !== 'playing') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      cameraRef.current?.resize(canvas.width, canvas.height)
    }
    window.addEventListener('resize', resize)

    const loop = new GameLoop((dt, ts) => {
      const camera   = cameraRef.current!
      const player   = playerRef.current!
      const ui       = uiStateRef.current
      if (ui.openSection || ui.showSettings || ui.npcMessage) {
        inputRef.current.isModalOpen = true
        return // skip game logic if modal open
      }
      inputRef.current.isModalOpen = false
      const input    = inputRef.current.getState()
      const world    = worldRef.current
      const save     = saveRef.current.getSave()
      const audio    = audioRef.current
      const particles= particleRef.current

      // Update world
      world.update(dt)
      cloudOffsetRef.current = (cloudOffsetRef.current + dt * 0.018) % (MAP_W + 200)

      // Update birds
      for (const bird of birdsRef.current) {
        bird.x    += bird.speed * dt * 0.001
        bird.flap += dt * 0.008
        if (bird.x > MAP_W + 100) bird.x = -100
      }

      // Update player
      player.update(dt, input, world)
      if (player.isMoving) audio.playFootstep(input.sprint, dt)
      save.playerTileX = player.tileX
      save.playerTileY = player.tileY
      if (input.sprint) save.sprintMs = (save.sprintMs ?? 0) + dt

      // Minimap DOM update
      const dot = document.getElementById('minimap-player-dot')
      if (dot) {
        dot.style.left = `${player.tileX * 4}px`
        dot.style.top = `${player.tileY * 4}px`
      }

      // Day/night — clamp elapsed to >= 0 to guard against
      // performance.now() drift between startGame and first RAF frame
      const elapsed = Math.max(0, ts - gameStartedAt.current)
      const dp = (elapsed % DAY_NIGHT_CYCLE_MS) / DAY_NIGHT_CYCLE_MS  // always in [0, 1)
      setDayProgress(dp)

      // Camera follow
      camera.follow(player.centerX, player.centerY, dt)

      // Update NPCs
      for (const npc of npcsRef.current) {
        npc.update(dt)
      }

      // Update particles
      particles.update(dt)

      // Ambient Cyberpunk Fireflies/Dust around the player
      if (Math.random() < 0.08 * (dp > 0.5 ? 2 : 1)) {
        const x = player.centerX + (Math.random() - 0.5) * window.innerWidth
        const y = player.centerY + (Math.random() - 0.5) * window.innerHeight
        // Emit single floating particle
        particles.emit(x, y, 'sparkle', 1, '#22d3ee')
      }

      // Collectible proximity
      for (const col of collectiblesRef.current) {
        if (col.collected) continue
        const dist = Math.hypot(player.centerX - col.x - TILE / 2, player.centerY - col.y - TILE / 2)
        if (dist < TILE * 0.8) {
          const isNew = saveRef.current.collect(col.id, col.type)
          if (isNew) {
            col.collected = true
            if (col.type === 'coin')  { particles.emitCoin(col.x + TILE / 2, col.y); audio.playCoin() }
            if (col.type === 'star')  { particles.emitStar(col.x + TILE / 2, col.y); audio.playStar() }
            if (col.type === 'key')   { particles.emitKey(col.x + TILE / 2, col.y);  audio.playKey()  }
            setHudSave({ ...saveRef.current.getSave() })
          }
        }
      }

      // Building proximity + auto-enter
      let nearBld: SectionKey | null = null
      for (const b of BUILDINGS) {
        const bx = (b.tileX + b.doorTileX) * TILE + TILE / 2
        const by = (b.tileY + b.doorTileY) * TILE + TILE / 2
        const dist = Math.hypot(player.centerX - bx, player.centerY - by)
        if (dist < TILE * 1.2) {
          nearBld = b.id
          if (input.interact && openSection !== b.id) {
            enterBuilding(b.id)
          }
          break
        }
        // Auto-enter when walking through door
        if (dist < TILE * 0.55) {
          enterBuilding(b.id)
          break
        }
      }
      setNearBuilding(nearBld)

      // Achievement check
      achieveRef.current?.check(save, (id) => saveRef.current.unlockAchievement(id))

      // ── RENDER ──────────────────────────────────
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      camera.apply(ctx)

      // Sky color shift for day/night — safe array access with clamped indices
      const skyColors = [
        { r: 255, g: 150, b: 80  },   // dawn
        { r: 100, g: 170, b: 255 },   // day
        { r: 255, g: 120, b: 60  },   // dusk
        { r: 10,  g: 15,  b: 50  },   // night
      ]
      const safeDp  = isFinite(dp) && dp >= 0 ? dp % 1 : 0   // always [0, 1)
      const t4      = safeDp * skyColors.length               // [0, 4)
      const ci      = Math.floor(t4) % skyColors.length       // 0-3
      const ci2     = (ci + 1)       % skyColors.length       // 0-3
      const mix     = t4 - Math.floor(t4)                     // 0-1
      const c1      = skyColors[ci]  ?? skyColors[0]
      const c2      = skyColors[ci2] ?? skyColors[0]
      const sky = {
        r: c1.r + (c2.r - c1.r) * mix,
        g: c1.g + (c2.g - c1.g) * mix,
        b: c1.b + (c2.b - c1.b) * mix,
      }
      ctx.fillStyle = `rgb(${sky.r|0},${sky.g|0},${sky.b|0})`
      ctx.fillRect(0, 0, MAP_W, MAP_W * 0.8)  // cover world (MAP_ROWS * TILE = 1536px)

      world.drawGround(ctx, camera.x, camera.y, camera.viewW, camera.viewH, ts)
      world.drawTrees(ctx, camera.x, camera.y, camera.viewW, camera.viewH, ts)
      world.drawBuildings(ctx, camera.x, camera.y, camera.viewW, camera.viewH, ts)

      // Clouds
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      camera.apply(ctx)
      world.drawClouds(ctx, cloudOffsetRef.current)
      ctx.restore()

      // Birds
      ctx.save()
      ctx.fillStyle = '#334155'
      for (const bird of birdsRef.current) {
        if (bird.x < camera.x - 60 || bird.x > camera.x + camera.viewW + 60) continue
        const wingY = Math.sin(bird.flap) * 4
        ctx.beginPath()
        ctx.moveTo(bird.x, bird.y)
        ctx.lineTo(bird.x - 10, bird.y - wingY)
        ctx.moveTo(bird.x, bird.y)
        ctx.lineTo(bird.x + 10, bird.y - wingY)
        ctx.lineWidth = 1.5
        ctx.strokeStyle = '#475569'
        ctx.stroke()
      }
      ctx.restore()

      // Collectibles
      for (const col of collectiblesRef.current) {
        if (col.collected) continue
        if (col.x + TILE < camera.x || col.x > camera.x + camera.viewW) continue
        const bounce = Math.sin(ts * 0.004 + col.x) * 4
        ctx.save()
        ctx.textAlign = 'center'
        ctx.shadowBlur = 10
        if (col.type === 'coin') {
          ctx.shadowColor = '#fbbf24'
          ctx.fillStyle = '#fbbf24'
          ctx.beginPath()
          ctx.arc(col.x + TILE/2, col.y + bounce - 6, 8, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#f59e0b'
          ctx.beginPath()
          ctx.arc(col.x + TILE/2, col.y + bounce - 6, 5, 0, Math.PI * 2)
          ctx.fill()
        }
        if (col.type === 'star') {
          ctx.font = '18px serif'
          ctx.shadowColor = '#a78bfa'
          ctx.fillText('⭐', col.x + TILE/2, col.y + bounce)
        }
        if (col.type === 'key') {
          ctx.font = '18px serif'
          ctx.shadowColor = '#34d399'
          ctx.fillText('🗝️', col.x + TILE/2, col.y + bounce)
        }
        ctx.restore()
      }

      // NPCs
      for (const npc of npcsRef.current) {
        const near = npc.isNearPlayer(player.x, player.y, player.w, player.h)
        npc.draw(ctx, ts, near)
      }

      // Player
      player.draw(ctx, ts)

      // Particles
      particles.draw(ctx)

      // Night overlay
      if (dp > 0.65) {
        const nightAlpha = Math.min((dp - 0.65) / 0.1, 1) * 0.55
        ctx.fillStyle = `rgba(0,0,30,${nightAlpha})`
        ctx.fillRect(camera.x, camera.y, camera.viewW, camera.viewH)
        // Star sparkles at night
        if (nightAlpha > 0.2) {
          ctx.save()
          ctx.globalAlpha = nightAlpha * 0.8
          for (let s = 0; s < 80; s++) {
            const sx = (s * 137.5 * 13) % MAP_W
            const sy = (s * 137.5 * 7)  % 300
            const ss = Math.sin(ts * 0.003 + s) * 0.5 + 1
            ctx.fillStyle = 'white'
            ctx.beginPath()
            ctx.arc(sx, sy, ss, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.restore()
        }
      }

      camera.reset(ctx)
    })

    loopRef.current = loop
    loop.start()
    return () => {
      loop.stop()
      window.removeEventListener('resize', resize)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // NPC interaction via keyboard
  useEffect(() => {
    if (phase !== 'playing') return
    const handler = (e: KeyboardEvent) => {
      if (e.code !== 'KeyE' && e.code !== 'Space') return
      const player = playerRef.current
      if (!player) return
      for (const npc of npcsRef.current) {
        const near = npc.isNearPlayer(player.x, player.y, player.w, player.h)
        if (!near) continue
        const cooldown = npcCooldownRef.current[npc.config.id] ?? 0
        if (Date.now() - cooldown < 1500) continue
        npcCooldownRef.current[npc.config.id] = Date.now()
        saveRef.current.markNpcTalked(npc.config.id)
        setNpcMessage({ text: npc.getCurrentDialog(), name: npc.config.name })
        npc.nextDialog()
        setHudSave({ ...saveRef.current.getSave() })
        break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase])

  const enterBuilding = useCallback((id: SectionKey) => {
    setOpenSection(prev => {
      if (prev === id) return prev
      audioRef.current.playEnterBuilding()
      saveRef.current.markVisited(id)
      setHudSave({ ...saveRef.current.getSave() })
      saveRef.current.persist()
      return id
    })
  }, [])

  const closeBuilding = useCallback(() => setOpenSection(null), [])

  const handleReset = useCallback(() => {
    setPhase('start')
    setOpenSection(null)
    loopRef.current?.stop()
    inputRef.current.detach()
    audioRef.current.stop()
    saveRef.current.stopAutoSave()
  }, [])

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      canvasRef.current?.parentElement?.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }, [])

  return (
    <div
      className="relative bg-black overflow-hidden"
      style={{ width: '100vw', height: '100dvh', position: 'fixed', inset: 0 }}
    >
      {/* Canvas — always mounted so canvasRef is populated before startGame fires */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'pixelated', display: 'block' }}
        tabIndex={0}
        aria-label="Portfolio Quest Game"
      />

      {/* Start screen */}
      {phase === 'start' && (
        <StartScreen
          hasSave={saveRef.current.hasSave()}
          onNewGame={() => startGame(true)}
          onContinue={() => startGame(false)}
        />
      )}

      {/* Game HUD */}
      {phase === 'playing' && hudSave && (
        <GameHUD
          save={hudSave}
          dayProgress={dayProgress}
          onSettings={() => setShowSettings(true)}
          nearBuilding={nearBuilding}
        />
      )}

      {/* Touch joystick */}
      {phase === 'playing' && isMobile && (
        <TouchJoystick
          onMove={(dx, dy) => inputRef.current.setTouch(dx, dy)}
        />
      )}

      {/* NPC dialog */}
      {phase === 'playing' && (
        <NPCDialog
          message={npcMessage?.text ?? null}
          npcName={npcMessage?.name ?? ''}
          onNext={() => {
            const player = playerRef.current
            if (!player) return
            for (const npc of npcsRef.current) {
              if (npc.isNearPlayer(player.x, player.y, player.w, player.h)) {
                npc.nextDialog()
                setNpcMessage({ text: npc.getCurrentDialog(), name: npc.config.name })
                break
              }
            }
          }}
          onClose={() => setNpcMessage(null)}
        />
      )}

      {/* Building modal */}
      <BuildingModal section={openSection} onClose={closeBuilding} />

      {/* Settings panel */}
      {hudSave && (
        <SettingsPanel
          save={hudSave}
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onMusicChange={v => audioRef.current.setMusicVolume(v)}
          onSfxChange={v  => audioRef.current.setSfxVolume(v)}
          onReset={handleReset}
          onFullscreen={handleFullscreen}
        />
      )}

      {/* Achievement toast */}
      <AchievementToast event={achievementEv} />
    </div>
  )
}
