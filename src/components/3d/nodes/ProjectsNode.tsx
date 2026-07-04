'use client'

import { Text, Float, Image } from '@react-three/drei'
import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function ProjectsNode() {
  const groupRef = useRef<THREE.Group>(null)

  // Slowly rotate the entire projects gallery
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002
    }
  })

  return (
    <group>
      <Text
        position={[0, 4, 0]}
        fontSize={1.5}
        color="#ff00ff"
        anchorX="center"
        anchorY="middle"
      >
        PROJECTS
      </Text>

      <group ref={groupRef}>
        {/* Project 1 */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <group position={[-5, 0, -3]} rotation={[0, Math.PI / 4, 0]}>
            <mesh>
              <planeGeometry args={[4, 3]} />
              <meshStandardMaterial color="#2d1b54" />
            </mesh>
            <Text position={[0, -2, 0]} fontSize={0.3} color="#ffffff" anchorX="center">
              CMS Platform
            </Text>
          </group>
        </Float>

        {/* Project 2 */}
        <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
          <group position={[0, 0, 5]} rotation={[0, 0, 0]}>
            <mesh>
              <planeGeometry args={[4, 3]} />
              <meshStandardMaterial color="#4a258a" />
            </mesh>
            <Text position={[0, -2, 0]} fontSize={0.3} color="#ffffff" anchorX="center">
              E-Commerce Data Scraper
            </Text>
          </group>
        </Float>

        {/* Project 3 */}
        <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.8}>
          <group position={[5, 0, -3]} rotation={[0, -Math.PI / 4, 0]}>
            <mesh>
              <planeGeometry args={[4, 3]} />
              <meshStandardMaterial color="#170b2e" />
            </mesh>
            <Text position={[0, -2, 0]} fontSize={0.3} color="#ffffff" anchorX="center">
              Video Calling App
            </Text>
          </group>
        </Float>
      </group>
    </group>
  )
}
