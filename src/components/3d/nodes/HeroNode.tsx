'use client'

import { Text, Float, Html } from '@react-three/drei'
import { getProfile } from '@/lib/content'
import { useState, useEffect } from 'react'

export function HeroNode() {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    // In Server Components we can just call getProfile(), but since we are deep in
    // Client Components for Three.js, we just fetch or pass it down.
    // For simplicity, we just call the local imported function which works in Next App Router client if it doesn't use node APIs.
    // Actually getProfile reads from fs in lib/content.ts, which is SERVER ONLY.
    // Wait, let's fetch it via a standard import if possible, or we need to pass it as props from the Server Component `page.tsx`.
    // Let me update page.tsx to pass the profile down.
    fetch('/api/content').catch(() => {
      // Fallback if no API exists, we'll fix the prop passing shortly.
    })
  }, [])

  // Since we are pivoting fast, let's hardcode the visual for a second until we wire up the props.
  // Actually, I'll update page.tsx to fetch the data and pass it to Scene -> Journey -> Nodes.
  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Text
          position={[0, 1, 0]}
          fontSize={2}
          color="#94e6fb"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#02101f"
        >
          TAMILSELVAN G
        </Text>
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          FULL STACK ENGINEER
        </Text>
      </Float>
      
      <Html position={[0, -2, 0]} center>
        <div className="terminal-text text-[#94e6fb] text-sm animate-pulse tracking-widest whitespace-nowrap">
          [ SCROLL TO EXPLORE ]
        </div>
      </Html>
    </group>
  )
}
