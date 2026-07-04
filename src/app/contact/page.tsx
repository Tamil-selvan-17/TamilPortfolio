import { ContactCTA } from '@/components/sections/ContactCTA'
import { generatePageMetadata } from '@/lib/seo'

export const metadata = generatePageMetadata(
  'Contact',
  'Get in touch for opportunities.',
  '/contact'
)

export default function ContactPage() {
  return (
    <div className="relative min-h-screen py-32 z-10 text-slate-800 flex items-center justify-center">
      <ContactCTA />
    </div>
  )
}
