'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Journey } from './Journey'
import { Loader } from '@react-three/drei'

export function Scene() {
  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}
      >
        <color attach="background" args={['#02101f']} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#94e6fb" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4a9eca" />
        
        <Suspense fallback={null}>
          <Journey />
        </Suspense>
        
        {/* Adds fog to make objects in the distance fade out */}
        <fog attach="fog" args={['#02101f', 10, 50]} />
      </Canvas>
      <Loader />
    </>
  )
}
