import { OrganicSkills } from '@/components/sections/OrganicSkills'
import { getSkills } from '@/lib/content'
import { generatePageMetadata } from '@/lib/seo'

export const metadata = generatePageMetadata(
  'Skills',
  'Technical skills and expertise of Tamilselvan G.',
  '/skills'
)

export default function SkillsPage() {
  const skills = getSkills()

  return (
    <div className="relative min-h-screen py-32 px-6 md:px-8 overflow-hidden z-10 text-slate-800">
      <OrganicSkills skillsGroups={skills} />
    </div>
  )
}
