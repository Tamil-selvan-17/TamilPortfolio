'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { HeroNode } from './nodes/HeroNode'
import { ExperienceNode } from './nodes/ExperienceNode'
import { ProjectsNode } from './nodes/ProjectsNode'

function JourneyPath() {
  const scroll = useScroll()
  const groupRef = useRef<THREE.Group>(null)

  // As the user scrolls (0 to 1), move the entire group towards the camera (Z axis)
  // The camera is at Z=10. The group starts at Z=0 and moves positive Z to pass the camera.
  useFrame(() => {
    if (groupRef.current) {
      // We have 3 main sections, spread them out across Z space.
      // 0 = Hero
      // 30 = Experience
      // 60 = Projects
      // Max scroll will move the scene forward by roughly 80 units
      const targetZ = scroll.offset * 80
      // Smoothly interpolate the group's Z position for that buttery scroll feel
      groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 4, 0.1)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Node 1: Hero (z=0) */}
      <group position={[0, 0, 0]}>
        <HeroNode />
      </group>
      
      {/* Node 2: Experience (z=-30) */}
      <group position={[0, 0, -30]}>
        <ExperienceNode />
      </group>

      {/* Node 3: Projects (z=-60) */}
      <group position={[0, 0, -60]}>
        <ProjectsNode />
      </group>
    </group>
  )
}

export function Journey() {
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <ScrollControls pages={5} damping={0.1}>
        <JourneyPath />
      </ScrollControls>
    </>
  )
}
