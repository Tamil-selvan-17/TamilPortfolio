import { OrganicProjects } from '@/components/sections/OrganicProjects'
import { getProjects } from '@/lib/content'
import { generatePageMetadata } from '@/lib/seo'

export const metadata = generatePageMetadata(
  'Projects',
  'Featured projects and open source contributions.',
  '/projects'
)

export default function ProjectsPage() {
  const projects = getProjects()

  return (
    <div className="relative min-h-screen z-10 text-slate-800">
      <OrganicProjects projects={projects} />
    </div>
  )
}
