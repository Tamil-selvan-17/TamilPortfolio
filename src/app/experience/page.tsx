import { OrganicExperience } from '@/components/sections/OrganicExperience'
import { getExperience } from '@/lib/content'
import { generatePageMetadata } from '@/lib/seo'

export const metadata = generatePageMetadata(
  'Experience',
  'Full work history.',
  '/experience'
)

export default function ExperiencePage() {
  const experience = getExperience()

  return (
    <div className="relative min-h-screen z-10 text-slate-800">
      <OrganicExperience experience={experience} />
    </div>
  )
}
