import { ImageResponse } from 'next/og'
import { getProjectBySlug, getProjects } from '@/lib/content'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }))
}

export default async function ProjectOGImage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) return new Response('Not found', { status: 404 })

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 64,
          background: 'linear-gradient(135deg, #09090f 0%, #12121a 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef)',
          }}
        />

        {/* Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 24,
            color: '#818cf8',
            fontSize: 16,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          CASE STUDY
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: '#f1f5f9',
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          {project.title}
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 24, color: '#64748b', marginBottom: 40 }}>
          {project.subtitle}
        </div>

        {/* Impact metrics */}
        <div style={{ display: 'flex', gap: 24 }}>
          {project.impact.slice(0, 3).map((imp) => (
            <div
              key={imp.label}
              style={{
                padding: '12px 20px',
                borderRadius: 12,
                background: 'rgba(129,140,248,0.1)',
                border: '1px solid rgba(129,140,248,0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span style={{ color: '#818cf8', fontSize: 24, fontWeight: 700 }}>
                {imp.value}{imp.suffix}
              </span>
              <span style={{ color: '#64748b', fontSize: 14 }}>{imp.label}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 64,
            color: '#334155',
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
