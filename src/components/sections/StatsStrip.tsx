'use client'

import { useLiveTenure } from '@/hooks/useLiveTenure'
import { AnimatedNumber } from '@/components/shared/AnimatedNumber'
import { RevealOnScroll } from '@/components/shared/RevealOnScroll'
import { getProjects } from '@/lib/content'
import { Zap, FolderCheck, Users, Activity } from 'lucide-react'

const projects = getProjects()

interface StatCard {
  icon: typeof Zap
  value: number
  suffix: string
  decimals?: number
  label: string
  description: string
  color: string
}

export function StatsStrip() {
  const tenure = useLiveTenure('2022-06-01', null)

  const stats: StatCard[] = [
    {
      icon: Zap,
      value: parseFloat(`${tenure.years}.${tenure.months}`),
      suffix: ' yrs',
      decimals: 1,
      label: 'Years Experience',
      description: `${tenure.totalDays.toLocaleString()} days in production`,
      color: '#818cf8',
    },
    {
      icon: FolderCheck,
      value: projects.length,
      suffix: '+',
      label: 'Projects Shipped',
      description: 'Enterprise applications delivered',
      color: '#a78bfa',
    },
    {
      icon: Users,
      value: 300,
      suffix: '+',
      label: 'Users Managed',
      description: 'Freelancers on VMS platform',
      color: '#e879f9',
    },
    {
      icon: Activity,
      value: 99.9,
      suffix: '%',
      decimals: 1,
      label: 'Uptime Maintained',
      description: 'Across all production services',
      color: '#34d399',
    },
  ]

  return (
    <section className="py-12 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <RevealOnScroll key={stat.label} direction="up" delay={i * 0.08}>
                <div className="glass rounded-2xl p-5 card-glow group">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}
                  >
                    <Icon size={17} style={{ color: stat.color }} />
                  </div>

                  <p
                    className="text-3xl font-bold tracking-tight mb-0.5"
                    style={{ color: stat.color }}
                  >
                    <AnimatedNumber
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals ?? 0}
                      duration={2.2}
                    />
                  </p>

                  <p className="text-sm font-semibold mb-0.5">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
