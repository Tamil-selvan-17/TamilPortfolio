'use client'

import { Text, Float, Line } from '@react-three/drei'

export function ExperienceNode() {
  return (
    <group>
      <Text
        position={[-4, 2, 0]}
        fontSize={1}
        color="#00ff9d"
        anchorX="left"
        anchorY="middle"
      >
        EXPERIENCE
      </Text>
      
      {/* 3D Timeline Path */}
      <Line
        points={[[-3, 1, 0], [-3, -5, 0]]}
        color="#00ff9d"
        lineWidth={2}
        dashed
        dashScale={5}
      />

      {/* Mocking the experience nodes for the 3D space */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[-2, 0, 0]}>
          <Text fontSize={0.4} color="#ffffff" anchorX="left" position={[0, 0, 0]}>
            Cognizant - Programmer Analyst
          </Text>
          <Text fontSize={0.2} color="#94a3b8" anchorX="left" position={[0, -0.4, 0]}>
            2022 - Present
          </Text>
        </group>
      </Float>

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[-2, -3, 0]}>
          <Text fontSize={0.4} color="#ffffff" anchorX="left" position={[0, 0, 0]}>
            Freelance - Full Stack Developer
          </Text>
          <Text fontSize={0.2} color="#94a3b8" anchorX="left" position={[0, -0.4, 0]}>
            2020 - 2022
          </Text>
        </group>
      </Float>
    </group>
  )
}
