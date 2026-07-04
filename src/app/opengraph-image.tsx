import { ImageResponse } from 'next/og'
import { getProfile } from '@/lib/content'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  const profile = getProfile()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #09090f 0%, #12121a 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background orbs */}
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.3), transparent)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 100,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217,70,239,0.25), transparent)',
            filter: 'blur(60px)',
          }}
        />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'relative' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #818cf8, #a78bfa, #e879f9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: 1,
            }}
          >
            {profile.name}
          </div>
          <div style={{ color: '#94a3b8', fontSize: 28, fontWeight: 400 }}>
            {profile.title}
          </div>
          <div
            style={{
              marginTop: 16,
              padding: '8px 24px',
              borderRadius: 9999,
              background: 'rgba(129,140,248,0.1)',
              border: '1px solid rgba(129,140,248,0.2)',
              color: '#818cf8',
              fontSize: 18,
            }}
          >
            {profile.location} · Full Stack Engineer
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            color: '#475569',
            fontSize: 16,
          }}
        >
          tamilselvan.dev
        </div>
      </div>
    ),
    { ...size }
  )
}
