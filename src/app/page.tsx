import CleanHero from '@/components/ui/CleanHero'
import { OrganicAbout } from '@/components/sections/OrganicAbout'
import { OrganicExperience } from '@/components/sections/OrganicExperience'
import { OrganicProjects } from '@/components/sections/OrganicProjects'
import { OrganicSkills } from '@/components/sections/OrganicSkills'
import { ContactCTA } from '@/components/sections/ContactCTA'
import { getExperience, getProjects, getSkills } from '@/lib/content'

export default function Home() {
  const experience = getExperience()
  const projects = getProjects()
  const skills = getSkills()
  return (
    <main className="w-full relative bg-transparent">
      
      {/* 1. The 3D Sphere Landing - Hero */}
      <CleanHero />

      {/* 2. Main Content Sections (Transparent to show global 3D Sphere) */}
      <div className="w-full relative z-20 text-slate-900 dark:text-white flex flex-col gap-10">
        <OrganicAbout />
        <OrganicSkills skillsGroups={skills} />
        <OrganicExperience experience={experience} />
        <OrganicProjects projects={projects} />
        
        {/* Contact Section */}
        <section id="contact" className="py-20 flex justify-center border-t border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm bg-white/30 dark:bg-slate-950/30">
          <ContactCTA />
        </section>
      </div>

    </main>
  )
}
