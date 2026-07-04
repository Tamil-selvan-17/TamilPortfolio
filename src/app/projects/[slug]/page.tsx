import { notFound } from 'next/navigation'
import { getProjectBySlug, getProjects } from '@/lib/content'
import { ProjectCaseStudy } from '@/components/project/ProjectCaseStudy'
import type { Metadata } from 'next'
import { getSiteConfig } from '@/lib/content'

type Props = { params: Promise<{ slug: string }> }

const site = getSiteConfig()

export async function generateStaticParams() {
  const projects = getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) return {}

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `${site.seo.siteUrl}/projects/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.summary,
    },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) notFound()

  return <ProjectCaseStudy project={project} />
}
