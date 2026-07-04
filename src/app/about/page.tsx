import { OrganicAbout } from '@/components/sections/OrganicAbout'
import { generatePageMetadata } from '@/lib/seo'

export const metadata = generatePageMetadata(
  'About',
  'Learn more about Tamilselvan G.',
  '/about'
)

export default function AboutPage() {
  return (
    <div className="relative min-h-screen py-32 overflow-hidden z-10 text-slate-800">
      <OrganicAbout />
    </div>
  )
}
