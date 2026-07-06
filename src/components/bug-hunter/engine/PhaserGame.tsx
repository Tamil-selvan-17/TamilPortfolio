'use client'

import { useEffect, useRef } from 'react'
import * as Phaser from 'phaser'
import { MainScene } from './scenes/MainScene'
import { useGameStore } from '../store/useGameStore'

export default function PhaserGame() {
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGame = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!gameRef.current || phaserGame.current) return

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: gameRef.current,
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false // Set to true to see hitboxes
        }
      },
      scene: [MainScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      backgroundColor: '#18181b', // zinc-900
    }

    phaserGame.current = new Phaser.Game(config)

    // Pass the Zustand store to the Phaser registry so scenes can access it
    phaserGame.current.registry.set('store', useGameStore)

    return () => {
      if (phaserGame.current) {
        phaserGame.current.destroy(true)
        phaserGame.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={gameRef} 
      className="w-full h-full absolute inset-0 z-0" 
      id="phaser-container"
    />
  )
}
