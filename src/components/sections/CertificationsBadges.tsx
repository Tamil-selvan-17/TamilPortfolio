import { SectionHeader } from '@/components/shared/SectionHeader'
import { GradientText } from '@/components/shared/GradientText'
import { RevealOnScroll } from '@/components/shared/RevealOnScroll'
import { formatShortDate } from '@/lib/date-utils'
import type { Certification } from '@/types/content'
import { ExternalLink, Award } from 'lucide-react'

interface Props {
  certifications: Certification[]
}

export function CertificationsBadges({ certifications }: Props) {
  return (
    <section id="certifications" className="py-20 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Certifications"
          headline={
            <>
              Verified{' '}
              <GradientText>credentials</GradientText>
            </>
          }
          subtext="Industry certifications that back up the experience."
          className="mb-12"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications.map((cert, i) => (
            <RevealOnScroll key={cert.name} direction="up" delay={i * 0.08}>
              <div className="glass rounded-2xl p-5 card-glow group flex flex-col h-full">
                {/* Badge icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shrink-0"
                  style={{
                    background: cert.badgeColor ? `${cert.badgeColor}18` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${cert.badgeColor ? `${cert.badgeColor}30` : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  <Award size={18} style={{ color: cert.badgeColor ?? '#818cf8' }} />
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-semibold leading-snug mb-1">{cert.name}</h3>
                  <p className="text-xs text-muted-foreground mb-0.5">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground">{formatShortDate(cert.date)}</p>
                </div>

                {cert.credentialId && (
                  <p className="text-xs text-muted-foreground mt-2 font-mono truncate">
                    ID: {cert.credentialId}
                  </p>
                )}

                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-indigo-400
                               hover:text-indigo-300 transition-colors"
                  >
                    <ExternalLink size={11} />
                    Verify credential
                  </a>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
