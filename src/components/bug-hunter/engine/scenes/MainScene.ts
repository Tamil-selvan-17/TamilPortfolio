import * as Phaser from 'phaser'

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: { W: Phaser.Input.Keyboard.Key, A: Phaser.Input.Keyboard.Key, S: Phaser.Input.Keyboard.Key, D: Phaser.Input.Keyboard.Key }
  private lasers!: Phaser.Physics.Arcade.Group
  private bugs!: Phaser.Physics.Arcade.Group
  
  private lastFired: number = 0
  private bugsSpawned: number = 0
  private bugsKilledInWave: number = 0
  private maxBugsThisWave: number = 10
  private spawnTimer!: Phaser.Time.TimerEvent
  
  // To interact with Zustand store
  private getStore!: () => any

  constructor() {
    super({ key: 'MainScene' })
  }

  init() {
    const useStore = this.game.registry.get('store')
    this.getStore = useStore.getState
  }

  preload() {
    // Player
    const g = this.make.graphics({ x: 0, y: 0 })
    g.fillStyle(0x10b981, 1) // emerald-500
    g.fillCircle(16, 16, 16)
    g.lineStyle(4, 0x059669, 1)
    g.strokeCircle(16, 16, 16)
    g.generateTexture('player', 32, 32)

    // Debug Laser
    const l = this.make.graphics({ x: 0, y: 0 })
    l.fillStyle(0x06b6d4, 1) // cyan-500
    l.fillRect(0, 0, 16, 4)
    l.generateTexture('laser', 16, 4)

    // Console Cannon
    const c = this.make.graphics({ x: 0, y: 0 })
    c.fillStyle(0xf97316, 1) // orange-500
    c.fillCircle(8, 8, 8)
    c.generateTexture('cannon', 16, 16)

    // TS Missile
    const ts = this.make.graphics({ x: 0, y: 0 })
    ts.fillStyle(0x3b82f6, 1) // blue-500
    ts.fillTriangle(0, 0, 16, 6, 0, 12)
    ts.generateTexture('missile', 16, 12)

    // Particle
    const p = this.make.graphics({ x: 0, y: 0 })
    p.fillStyle(0xffffff, 1)
    p.fillCircle(2, 2, 2)
    p.generateTexture('particle', 4, 4)

    // Syntax Error (Normal)
    const b = this.make.graphics({ x: 0, y: 0 })
    b.fillStyle(0xe11d48, 1) // rose-600
    b.fillRect(0, 0, 24, 24)
    b.lineStyle(2, 0xffffff, 1)
    b.strokeRect(0, 0, 24, 24)
    b.generateTexture('bug', 24, 24)

    // Null Pointer (Fast)
    const np = this.make.graphics({ x: 0, y: 0 })
    np.fillStyle(0xa855f7, 1) // purple-500
    np.fillTriangle(12, 0, 24, 24, 0, 24)
    np.generateTexture('null_pointer', 24, 24)

    // Bug Boss
    const boss = this.make.graphics({ x: 0, y: 0 })
    boss.fillStyle(0x991b1b, 1) // red-800
    boss.fillCircle(40, 40, 40)
    boss.lineStyle(4, 0xffffff, 1)
    boss.strokeCircle(40, 40, 40)
    boss.generateTexture('bug_boss', 80, 80)
  }

  create() {
    this.add.grid(0, 0, 4000, 4000, 64, 64, 0x18181b, 1, 0x27272a, 0.5)
    
    this.player = this.physics.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'player')
    this.player.setDepth(10)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys()
      this.wasd = this.input.keyboard.addKeys('W,A,S,D') as any
    }

    this.lasers = this.physics.add.group({ maxSize: 100 })
    this.bugs = this.physics.add.group({ maxSize: 100 })

    this.physics.add.collider(this.lasers, this.bugs, this.handleLaserHitBug as any, undefined, this)
    this.physics.add.collider(this.player, this.bugs, this.handlePlayerHitBug as any, undefined, this)

    this.startWave()
  }

  private startWave() {
    const store = this.getStore()
    this.maxBugsThisWave = 5 + (store.wave * 5)
    this.bugsSpawned = 0
    this.bugsKilledInWave = 0
    
    // Wave text announcement
    const txt = this.add.text(this.player.x, this.player.y - 100, `WAVE ${store.wave}`, {
      fontSize: '48px', color: '#818cf8', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(100)
    
    this.tweens.add({
      targets: txt,
      y: txt.y - 50,
      alpha: 0,
      duration: 2000,
      onComplete: () => txt.destroy()
    })

    const spawnRate = Math.max(500, 1500 - (store.wave * 100))
    this.spawnTimer = this.time.addEvent({ delay: spawnRate, callback: this.spawnBug, callbackScope: this, loop: true })
  }

  update(time: number, delta: number) {
    if (!this.player || !this.player.active) return

    const store = this.getStore()
    if (store.isPaused || store.isGameOver) {
      this.physics.world.isPaused = true
      return
    } else {
      this.physics.world.isPaused = false
    }

    // Player Movement
    const speed = 300
    const vel = new Phaser.Math.Vector2(0, 0)
    if (this.cursors.left.isDown || this.wasd.A.isDown) vel.x = -1
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vel.x = 1
    if (this.cursors.up.isDown || this.wasd.W.isDown) vel.y = -1
    else if (this.cursors.down.isDown || this.wasd.S.isDown) vel.y = 1
    vel.normalize().scale(speed)
    this.player.setVelocity(vel.x, vel.y)

    // Shooting
    if (this.input.activePointer.isDown && time > this.lastFired) {
      this.shootWeapon(time, store)
    }

    // Bug AI
    this.bugs.getChildren().forEach((b: any) => {
      if (b.active) {
        const speed = b.getData('speed') || 100
        this.physics.moveToObject(b, this.player, speed)
        b.rotation += 0.05
      }
    })

    // Homing Missiles AI
    this.lasers.getChildren().forEach((l: any) => {
      if (l.active && l.getData('isHoming')) {
        let closest: any = null
        let minDist = 300 // Homing range
        this.bugs.getChildren().forEach((b: any) => {
          if (b.active) {
            const dist = Phaser.Math.Distance.Between(l.x, l.y, b.x, b.y)
            if (dist < minDist) { minDist = dist; closest = b }
          }
        })
        if (closest) {
          const angle = Phaser.Math.Angle.Between(l.x, l.y, closest.x, closest.y)
          l.setRotation(angle)
          this.physics.velocityFromRotation(angle, 500, l.body.velocity)
        }
      }
    })
    
    this.checkWaveCompletion(store)
  }
  
  private checkWaveCompletion(store: any) {
    if (this.bugsSpawned >= this.maxBugsThisWave && this.bugs.countActive() === 0 && !store.isShopOpen) {
      // Wave Complete!
      if (this.spawnTimer) this.spawnTimer.remove()
      
      store.setWave(store.wave + 1)
      store.toggleShop() // Open shop between waves
      
      // Wait for shop to close to start next wave
      const checkShop = this.time.addEvent({
        delay: 500,
        loop: true,
        callback: () => {
          if (!this.getStore().isShopOpen) {
            checkShop.remove()
            this.startWave()
          }
        }
      })
    }
  }

  private shootWeapon(time: number, store: any) {
    if (store.energy <= 0) return
    const weaponId = store.weapons[store.currentWeaponIndex]
    
    let key = 'laser', speed = 700, delay = 250, damage = 1, isHoming = false
    if (weaponId === 'console_cannon') { key = 'cannon'; speed = 400; delay = 800; damage = 3 }
    if (weaponId === 'ts_missile') { key = 'missile'; speed = 500; delay = 400; damage = 2; isHoming = true }

    const proj = this.lasers.get(this.player.x, this.player.y)
    if (proj) {
      proj.setActive(true).setVisible(true).setTexture(key)
      proj.setData('damage', damage)
      proj.setData('isHoming', isHoming)
      
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.input.activePointer.worldX, this.input.activePointer.worldY)
      proj.setRotation(angle)
      if (proj.body) this.physics.velocityFromRotation(angle, speed, (proj.body as Phaser.Physics.Arcade.Body).velocity)
      
      this.lastFired = time + delay
      this.time.delayedCall(2000, () => { if (proj.active) { proj.setActive(false).setVisible(false); proj.body?.stop() }})
    }
  }

  private spawnBug() {
    if (this.bugsSpawned >= this.maxBugsThisWave) {
      this.spawnTimer.remove()
      return
    }

    const store = this.getStore()
    const angle = Math.random() * Math.PI * 2
    const dist = Math.max(this.cameras.main.width, this.cameras.main.height) / 1.5
    const x = this.player.x + Math.cos(angle) * dist
    const y = this.player.y + Math.sin(angle) * dist

    const rand = Math.random()
    let key = 'bug', hp = 3 + Math.floor(store.wave / 2), speed = 100 + (store.wave * 5), xp = 20, coins = 10
    
    // Boss spawns naturally in later waves or specifically as the last bug of a wave
    if (rand > 0.95 || (this.bugsSpawned === this.maxBugsThisWave - 1 && store.wave % 3 === 0)) { 
      key = 'bug_boss'; hp = 30 + (store.wave * 10); speed = 60 + store.wave; xp = 200; coins = 100 
    }
    else if (rand > 0.7) { 
      key = 'null_pointer'; hp = 1 + Math.floor(store.wave / 4); speed = 250 + (store.wave * 10); xp = 15; coins = 5 
    }

    const bug = this.bugs.get(x, y)
    if (bug) {
      bug.setActive(true).setVisible(true).setTexture(key)
      bug.setData('health', hp)
      bug.setData('speed', speed)
      bug.setData('xp', xp)
      bug.setData('coins', coins)
      
      this.bugsSpawned++

      // Boss Scale Tween
      if (key === 'bug_boss') {
        bug.setScale(0.1)
        this.tweens.add({ targets: bug, scale: 1, duration: 1000, ease: 'Bounce.easeOut' })
        this.cameras.main.shake(200, 0.01) // Shake on boss spawn
      } else {
        bug.setScale(1)
      }
    }
  }

  private handleLaserHitBug(laser: Phaser.Physics.Arcade.Sprite, bug: Phaser.Physics.Arcade.Sprite) {
    const damage = laser.getData('damage') || 1
    laser.setActive(false).setVisible(false)
    laser.body?.stop()

    let hp = bug.getData('health') - damage
    if (hp <= 0) {
      bug.setActive(false).setVisible(false)
      bug.body?.stop()
      this.bugsKilledInWave++
      
      const store = this.getStore()
      store.addCoins(bug.getData('coins'))
      store.addXp(bug.getData('xp'))
      
      // Explosion
      this.add.particles(bug.x, bug.y, 'particle', {
        speed: { min: 50, max: 200 },
        scale: { start: 1, end: 0 },
        lifespan: 400,
        blendMode: 'ADD',
        tint: bug.texture.key === 'bug_boss' ? 0xff0000 : 0x00ff00,
        maxParticles: bug.texture.key === 'bug_boss' ? 100 : 20
      })
      
      if (bug.texture.key === 'bug_boss') this.cameras.main.shake(300, 0.02)
    } else {
      bug.setData('health', hp)
      bug.setTint(0xffffff)
      this.time.delayedCall(100, () => { if (bug.active) bug.clearTint() })
    }
  }

  private handlePlayerHitBug(player: Phaser.Physics.Arcade.Sprite, bug: Phaser.Physics.Arcade.Sprite) {
    bug.setActive(false).setVisible(false)
    bug.body?.stop()
    this.bugsKilledInWave++

    const dmg = bug.texture.key === 'bug_boss' ? 40 : 10
    this.getStore().takeDamage(dmg)

    this.cameras.main.shake(150, 0.01)
    player.setTint(0xff0000)
    this.time.delayedCall(200, () => { if (player.active) player.clearTint() })
  }
}
