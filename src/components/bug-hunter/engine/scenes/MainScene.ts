import * as Phaser from 'phaser'

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: { W: Phaser.Input.Keyboard.Key, A: Phaser.Input.Keyboard.Key, S: Phaser.Input.Keyboard.Key, D: Phaser.Input.Keyboard.Key }
  
  private lasers!: Phaser.Physics.Arcade.Group
  private bugs!: Phaser.Physics.Arcade.Group
  private bosses!: Phaser.Physics.Arcade.Group
  private drops!: Phaser.Physics.Arcade.Group
  
  private lastFired: number = 0
  private bugsSpawned: number = 0
  private maxBugsThisLevel: number = 20
  private spawnTimer!: Phaser.Time.TimerEvent
  private bossTimer!: Phaser.Time.TimerEvent
  
  private isBossActive: boolean = false
  private getStore!: () => any

  constructor() {
    super({ key: 'MainScene' })
  }

  private joyThumb!: Phaser.GameObjects.Arc
  private joyBase!: Phaser.GameObjects.Arc
  private joyActive: boolean = false
  private joyDir: number = 0

  init() {
    const useStore = this.game.registry.get('store')
    this.getStore = useStore.getState
  }

  preload() {
    // Load new 2D Sprite Assets
    this.load.image('player', '/assets/bug-hunter/programmer.png')
    this.load.image('bug', '/assets/bug-hunter/bug.png')
    this.load.image('null_pointer', '/assets/bug-hunter/fast_bug.png')
    this.load.image('bug_boss', '/assets/bug-hunter/boss.png')
    this.load.image('drop_weapon', '/assets/bug-hunter/powerup.png')
    this.load.image('drop_health', '/assets/bug-hunter/health.png')
    
    // Load background music from public URL (Phaser labs example audio)
    this.load.audio('bgm', 'https://labs.phaser.io/assets/audio/oedipus_wizball_highscore.ogg')

    // Debug Laser (Basic)
    const l = this.make.graphics({ x: 0, y: 0 })
    l.fillStyle(0x06b6d4, 1)
    l.fillRect(0, 0, 4, 16)
    l.generateTexture('laser', 4, 16)

    // Particle
    const p = this.make.graphics({ x: 0, y: 0 })
    p.fillStyle(0xffffff, 1)
    p.fillCircle(2, 2, 2)
    p.generateTexture('particle', 4, 4)
  }

  create() {
    this.add.grid(0, 0, 4000, 4000, 64, 64, 0x18181b, 1, 0x27272a, 0.5)
    
    this.player = this.physics.add.sprite(this.cameras.main.width / 2, this.cameras.main.height - 50, 'player')
    this.player.setDepth(10)
    this.player.setCollideWorldBounds(true) // Prevent moving off screen
    this.player.setDisplaySize(64, 64)
    
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys()
      this.wasd = this.input.keyboard.addKeys('W,A,S,D') as any
    }

    this.lasers = this.physics.add.group({ maxSize: 300 })
    this.bugs = this.physics.add.group({ maxSize: 100 })
    this.bosses = this.physics.add.group({ maxSize: 1 })
    this.drops = this.physics.add.group({ maxSize: 20 })

    this.physics.add.overlap(this.lasers, this.bugs, this.handleLaserHitBug as any, undefined, this)
    this.physics.add.overlap(this.lasers, this.bosses, this.handleLaserHitBoss as any, undefined, this)
    this.physics.add.overlap(this.player, this.drops, this.handlePlayerCollectDrop as any, undefined, this)
    this.physics.add.overlap(this.player, this.bugs, this.handlePlayerHitBug as any, undefined, this)
    this.physics.add.overlap(this.player, this.bosses, this.handlePlayerHitBoss as any, undefined, this)

    // Play Background Music
    if (!this.sound.get('bgm')) {
      this.sound.play('bgm', { loop: true, volume: 0.3 })
    }

    this.createJoystick()
    this.startLevel()
  }

  private createJoystick() {
    // Render joystick at bottom left
    const baseY = this.cameras.main.height - 80
    const baseX = 80
    
    this.joyBase = this.add.circle(baseX, baseY, 50, 0x3f3f46, 0.5).setDepth(100).setScrollFactor(0)
    this.joyThumb = this.add.circle(baseX, baseY, 25, 0xa1a1aa, 0.8).setDepth(101).setScrollFactor(0)
    
    this.joyThumb.setInteractive({ draggable: true })
    
    this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: any, dragX: number, dragY: number) => {
      if (gameObject === this.joyThumb) {
        this.joyActive = true
        const dx = dragX - this.joyBase.x
        const maxDist = 50
        
        let finalX = this.joyBase.x + Phaser.Math.Clamp(dx, -maxDist, maxDist)
        this.joyThumb.x = finalX
        this.joyDir = Phaser.Math.Clamp(dx / maxDist, -1, 1)
      }
    })
    
    this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: any) => {
      if (gameObject === this.joyThumb) {
        this.joyActive = false
        this.joyDir = 0
        this.joyThumb.x = this.joyBase.x
        this.joyThumb.y = this.joyBase.y
      }
    })
    
    // Hide joystick if not on touch device (optional, but good for testing to leave it, let's show only on touch)
    if (!this.sys.game.device.input.touch) {
      this.joyBase.setVisible(false)
      this.joyThumb.setVisible(false)
    }
  }

  private startLevel() {
    const store = this.getStore()
    
    // Difficulty Tiers: 1-5 Easy, 6-9 Medium, 10 Hard
    let maxBugs = 15 + (store.level * 3) // Easy (Very short levels)
    if (store.level >= 6 && store.level <= 9) maxBugs = 40 + (store.level * 5) // Medium
    else if (store.level >= 10) maxBugs = 80 // Hard

    this.maxBugsThisLevel = maxBugs
    this.bugsSpawned = 0
    this.isBossActive = false
    
    // Wave text announcement
    const txt = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, `LEVEL ${store.level}`, {
      fontSize: '64px', color: '#818cf8', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(100)
    
    this.tweens.add({
      targets: txt,
      y: txt.y - 100,
      alpha: 0,
      duration: 2500,
      onComplete: () => txt.destroy()
    })

    let spawnRate = 1800 // Super Easy
    if (store.level >= 6 && store.level <= 9) spawnRate = 800 - (store.level * 20) // Medium
    else if (store.level >= 10) spawnRate = 350 // Hard

    this.spawnTimer = this.time.addEvent({ delay: spawnRate, callback: this.spawnBug, callbackScope: this, loop: true })
  }

  update(time: number, delta: number) {
    if (!this.player || !this.player.active) return

    const store = this.getStore()
    if (store.isPaused || store.isGameOver || store.isMainMenu) {
      this.physics.world.isPaused = true
      this.time.paused = true
      return
    } else {
      this.physics.world.isPaused = false
      this.time.paused = false
    }

    // Player Movement (X axis only)
    const speed = 400
    let velX = 0
    if (this.cursors.left.isDown || this.wasd.A.isDown) velX = -speed
    else if (this.cursors.right.isDown || this.wasd.D.isDown) velX = speed
    else if (this.joyActive) {
      if (this.joyDir < -0.2) velX = -speed
      if (this.joyDir > 0.2) velX = speed
    }
    this.player.setVelocityX(velX)
    this.player.setVelocityY(0) // Never move Y

    // Weapon Switching removed
    
    // Auto-Shooting
    if (time > this.lastFired) {
      this.shootWeapon(time, store)
    }

    // Bug AI (Move down, hit production, update label)
    this.bugs.getChildren().forEach((bug: any) => {
      if (bug.active) {
        const label = bug.getData('label')
        if (label) {
          label.setPosition(bug.x, bug.y - 15)
          label.setVisible(true)
        }
        
        if (bug.x < -100 || bug.x > this.cameras.main.width + 100) {
          // Off screen left/right, just disable
          bug.setActive(false).setVisible(false)
          if (bug.body) bug.body.enable = false
          bug.body?.stop()
          if (label) label.setVisible(false)
        } else if (bug.y > this.cameras.main.height + 50) {
          // Hit the bottom production
          bug.setActive(false).setVisible(false)
          if (bug.body) bug.body.enable = false
          bug.body?.stop()
          if (label) label.setVisible(false)
          
          // Damage production
          store.takeDamage(10)
          this.cameras.main.shake(150, 0.01)
        }
      } else {
        const label = bug.getData('label')
        if (label) label.setVisible(false)
      }
    })

    // Boss AI (Move left/right, update label)
    this.bosses.getChildren().forEach((boss: any) => {
      if (boss.active) {
        const label = boss.getData('label')
        if (label) {
          label.setPosition(boss.x, boss.y - 30)
          label.setVisible(true)
        }
        if (boss.x <= 100) boss.setVelocityX(100 + store.level * 10)
        else if (boss.x >= this.cameras.main.width - 100) boss.setVelocityX(-(100 + store.level * 10))
      } else {
        const label = boss.getData('label')
        if (label) label.setVisible(false)
      }
    })

    // Drops AI (Move down, disappear if missed)
    this.drops.getChildren().forEach((d: any) => {
      if (d.active && d.y > this.cameras.main.height) {
        d.setActive(false).setVisible(false)
      }
    })
  } // END OF UPDATE METHOD

  private shootWeapon(time: number, store: any) {
    const level = store.laserLevel
    const delay = 80

    const speed = 800
    const damage = 1

    const createLaser = (offsetX: number) => {
      const proj = this.lasers.get(this.player.x + offsetX, this.player.y - 20)
      if (proj) {
        proj.setActive(true).setVisible(true).setTexture('laser')
        proj.setData('damage', damage)
        
        proj.setRotation(0) // Point straight up
        if (proj.body) {
          proj.body.enable = true
          proj.body.setSize(4, 16)
          this.physics.velocityFromRotation(-Math.PI / 2, speed, (proj.body as Phaser.Physics.Arcade.Body).velocity)
        }
        
        this.time.delayedCall(2000, () => { if (proj.active) { proj.setActive(false).setVisible(false); if (proj.body) proj.body.enable = false; proj.body?.stop() }})
      }
    }

    if (level === 1) {
      createLaser(0)
    } else if (level === 2) {
      createLaser(-10)
      createLaser(10)
    } else if (level >= 3) {
      createLaser(-15)
      createLaser(0)
      createLaser(15)
    }

    this.lastFired = time + delay
  }

  private spawnBug() {
    if (this.bugsSpawned >= this.maxBugsThisLevel && !this.isBossActive) {
      this.spawnTimer.remove()
      this.spawnBoss()
      return
    }

    const store = this.getStore()
    const x = Phaser.Math.Between(50, this.cameras.main.width - 50)
    const y = -50 // Spawn above screen

    const rand = Math.random()
    
    let key = 'bug', hp = 1, speed = 50 + (store.level * 5)
    if (store.level >= 6 && store.level <= 9) { hp = 2; speed = 150 + (store.level * 10) }
    else if (store.level >= 10) { hp = 4; speed = 300 }

    let exceptionName = 'TypeError'
    
    const exceptions = ['TypeError', 'SyntaxError', 'ReferenceError', 'RangeError', 'URIError']
    exceptionName = exceptions[Phaser.Math.Between(0, exceptions.length - 1)]

    if (rand > 0.8) { 
      key = 'null_pointer'; hp = 1; speed = speed + 80; exceptionName = 'NullPointerException'
    }

    const bug = this.bugs.get(x, y)
    if (bug) {
      bug.setActive(true).setVisible(true).setTexture(key)
      bug.setDisplaySize(48, 48)
      bug.setData('health', hp)
      bug.setData('isBoss', false)
      
      let label = bug.getData('label')
      if (!label) {
        label = this.add.text(x, y - 15, exceptionName, { fontSize: '10px', color: '#ff8a9a', fontStyle: 'bold' }).setOrigin(0.5)
        bug.setData('label', label)
      }
      label.setText(exceptionName)
      label.setVisible(true)
      
      if (bug.body) {
        bug.body.enable = true
        bug.body.setSize(bug.width, bug.height)
        bug.body.setVelocityY(speed)
      }
      this.bugsSpawned++
    }
  }

  private spawnBoss() {
    this.isBossActive = true
    const store = this.getStore()
    
    // WARNING TEXT
    const warnTxt = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, `WARNING: LEVEL ${store.level} BOSS INCOMING!`, {
      fontSize: '48px', color: '#ef4444', fontStyle: 'bold', backgroundColor: '#000000', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setDepth(200)
    
    this.tweens.add({
      targets: warnTxt,
      alpha: { from: 1, to: 0 },
      ease: 'Sine.InOut',
      duration: 300,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        warnTxt.destroy()
        this.createBossEntity(store)
      }
    })
  }

  private createBossEntity(store: any) {
    const boss = this.bosses.get(this.cameras.main.width / 2, 100)
    if (boss) {
      let bossHp = 200 + (store.level * 50)
      let bossSpeed = 50
      let bossShootDelay = 1500
      let bossBugSpeed = 80
      
      if (store.level >= 6 && store.level <= 9) {
        bossHp = 500 + (store.level * 100)
        bossSpeed = 150
        bossShootDelay = 800
        bossBugSpeed = 200
      } else if (store.level >= 10) {
        bossHp = 3000
        bossSpeed = 250
        bossShootDelay = 400
        bossBugSpeed = 350
      }

      boss.setActive(true).setVisible(true).setTexture('bug_boss')
      boss.setDisplaySize(160, 160)
      boss.setData('health', bossHp)
      boss.setData('isBoss', true)
      
      let label = boss.getData('label')
      if (!label) {
        label = this.add.text(boss.x, boss.y - 30, 'CORS_POLICY_ERROR', { fontSize: '16px', color: '#ef4444', fontStyle: 'bold' }).setOrigin(0.5)
        boss.setData('label', label)
      }
      label.setText('CORS_POLICY_ERROR')
      label.setVisible(true)
      
      if (boss.body) {
        boss.body.enable = true
        boss.body.setSize(boss.width, boss.height)
        boss.body.setVelocityX(bossSpeed)
        boss.body.setVelocityY(0)
        ;(boss.body as Phaser.Physics.Arcade.Body).setImmovable(true)
      }
      
      this.cameras.main.shake(500, 0.01)

      // Boss starts shooting bugs
      this.bossTimer = this.time.addEvent({
        delay: bossShootDelay,
        callback: () => {
          if (!boss.active) return
          const bug = this.bugs.get(boss.x, boss.y + 30)
          if (bug) {
            bug.setActive(true).setVisible(true).setTexture('bug')
            bug.setDisplaySize(48, 48)
            bug.setData('health', 1 + Math.floor(store.level / 3))
            bug.setData('isBoss', false)
            
            let label = bug.getData('label')
            if (!label) {
              label = this.add.text(bug.x, bug.y - 15, 'Exception', { fontSize: '10px', color: '#ff8a9a', fontStyle: 'bold' }).setOrigin(0.5)
              bug.setData('label', label)
            }
            label.setText('Exception')
            label.setVisible(true)

            if (bug.body) {
              bug.body.enable = true
              bug.body.setSize(bug.width, bug.height)
              // Add a random horizontal velocity so bugs spread out
              const vx = Phaser.Math.Between(-150, 150)
              bug.body.setVelocity(vx, bossBugSpeed)
            }
          }
        },
        loop: true
      })
    }
  }

  private handleLaserHitBug(laser: Phaser.Physics.Arcade.Sprite, bug: Phaser.Physics.Arcade.Sprite) {
    this.processHit(laser, bug)
  }

  private handleLaserHitBoss(laser: Phaser.Physics.Arcade.Sprite, boss: Phaser.Physics.Arcade.Sprite) {
    this.processHit(laser, boss)
  }

  private processHit(laser: Phaser.Physics.Arcade.Sprite, enemy: Phaser.Physics.Arcade.Sprite) {
    if (!laser.active || !enemy.active) return
    
    const damage = laser.getData('damage') || 1
    laser.setActive(false).setVisible(false)
    if (laser.body) laser.body.enable = false
    laser.body?.stop()

    let hp = enemy.getData('health') - damage
    if (hp <= 0) {
      enemy.setActive(false).setVisible(false)
      if (enemy.body) enemy.body.enable = false
      enemy.body?.stop()
      
      const label = enemy.getData('label')
      if (label) label.setVisible(false)
      
      const isBoss = enemy.getData('isBoss')
      const store = this.getStore()
      store.addScore(isBoss ? 1000 : 10)
      
      // Explosion Particles
      const emitter = this.add.particles(enemy.x, enemy.y, 'particle', {
        speed: { min: 50, max: 200 },
        scale: { start: 1, end: 0 },
        lifespan: 400,
        blendMode: 'ADD',
        tint: isBoss ? 0xff0000 : 0x00ff00,
        emitting: false // prevents continuous emission
      })
      emitter.explode(isBoss ? 150 : 20)
      this.time.delayedCall(1000, () => emitter.destroy())
      
      if (isBoss) {
        this.cameras.main.shake(800, 0.02)
        if (this.bossTimer) this.bossTimer.remove()
        this.time.delayedCall(2000, () => this.levelComplete(store))
      } else {
        // Random Drop Chance (15%)
        if (Math.random() < 0.15) {
          this.spawnDrop(enemy.x, enemy.y)
        }
      }
    } else {
      enemy.setData('health', hp)
      enemy.setTint(0xffffff)
      this.time.delayedCall(100, () => { if (enemy.active) enemy.clearTint() })
    }
  }

  private spawnDrop(x: number, y: number) {
    const type = Math.random() > 0.5 ? 'drop_weapon' : 'drop_health'
    const drop = this.drops.get(x, y)
    if (drop) {
      drop.setActive(true).setVisible(true).setTexture(type)
      drop.setDisplaySize(32, 32)
      drop.setData('type', type === 'drop_weapon' ? 'weapon' : 'health')
      if (drop.body) {
        drop.body.enable = true
        drop.body.setSize(drop.width, drop.height)
        drop.body.setVelocityY(100)
      }
    }
  }

  private handlePlayerCollectDrop(player: Phaser.Physics.Arcade.Sprite, drop: Phaser.Physics.Arcade.Sprite) {
    if (!drop.active) return
    drop.setActive(false).setVisible(false)
    if (drop.body) drop.body.enable = false
    drop.body?.stop()
    
    const store = this.getStore()
    const type = drop.getData('type')
    
    if (type === 'weapon') {
      store.upgradeLaser()
    } else if (type === 'health') {
      store.heal(20) // Heal 20%
    }

    // Collection effect
    this.add.particles(player.x, player.y, 'particle', {
      speed: { min: 20, max: 100 },
      scale: { start: 1, end: 0 },
      lifespan: 300,
      tint: 0xffa500,
      maxParticles: 15
    })
  }

  private handlePlayerHitBug(player: Phaser.Physics.Arcade.Sprite, bug: Phaser.Physics.Arcade.Sprite) {
    if (!bug.active) return
    bug.setActive(false).setVisible(false)
    if (bug.body) bug.body.enable = false
    bug.body?.stop()
    const label = bug.getData('label')
    if (label) label.setVisible(false)

    const store = this.getStore()
    store.decrementLaser()

    this.cameras.main.shake(150, 0.01)
    player.setTint(0xff0000)
    this.time.delayedCall(200, () => { if (player.active) player.clearTint() })
  }

  private handlePlayerHitBoss(player: Phaser.Physics.Arcade.Sprite, boss: Phaser.Physics.Arcade.Sprite) {
    const store = this.getStore()
    store.downgradeLaser() // Boss hit drops you straight to Level 1
    
    this.cameras.main.shake(300, 0.02)
    player.setTint(0xff0000)
    this.time.delayedCall(300, () => { if (player.active) player.clearTint() })
  }

  private levelComplete(store: any) {
    if (store.level >= 10) {
      store.setGameOver(true) // Won the game!
      return
    }
    
    store.setLevel(store.level + 1)
    
    // Level Complete Text
    const txt = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, `LEVEL COMPLETE!`, {
      fontSize: '48px', color: '#34d399', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(100)
    
    this.tweens.add({
      targets: txt,
      scale: 1.5,
      alpha: 0,
      duration: 2000,
      onComplete: () => {
        txt.destroy()
        this.startLevel()
      }
    })
  }
}
