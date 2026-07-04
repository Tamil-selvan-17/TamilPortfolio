import { profileSchema } from './schemas/profile.schema'
import { experienceSchema } from './schemas/experience.schema'
import { projectsSchema } from './schemas/project.schema'
import { skillsSchema } from './schemas/skills.schema'
import { educationSchema } from './schemas/education.schema'
import { certificationsSchema } from './schemas/certifications.schema'

import profileData from '@/content/profile.json'
import experienceData from '@/content/experience.json'
import projectsData from '@/content/projects.json'
import skillsData from '@/content/skills.json'
import educationData from '@/content/education.json'
import certificationsData from '@/content/certifications.json'
import siteData from '@/content/site.json'

/**
 * Each loader validates the JSON at call-time via Zod.
 * In a server component, this runs at request/build time —
 * any schema violation throws and fails the build cleanly.
 */

function calculateTotalYearsExperience(): number {
  try {
    const experience = experienceSchema.parse(experienceData)
    if (experience.length === 0) return 0
    
    const earliestDate = experience.reduce((earliest, job) => {
      const jobDate = new Date(job.startDate)
      return jobDate < earliest ? jobDate : earliest
    }, new Date())

    const diffTime = Math.abs(new Date().getTime() - earliestDate.getTime())
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25))
  } catch (e) {
    return 0
  }
}

export function getProfile() {
  const profile = profileSchema.parse(profileData)
  const years = calculateTotalYearsExperience()
  if (years > 0) {
    profile.summary = profile.summary.replace(/\{\{YEARS\}\}/g, years.toString())
  }
  return profile
}

export function getExperience() {
  return experienceSchema.parse(experienceData)
}

export function getProjects() {
  return projectsSchema.parse(projectsData)
}

export function getFeaturedProjects() {
  return getProjects().filter((p) => p.featured)
}

export function getProjectBySlug(slug: string) {
  return getProjects().find((p) => p.slug === slug) ?? null
}

export function getSkills() {
  return skillsSchema.parse(skillsData)
}

export function getEducation() {
  return educationSchema.parse(educationData)
}

export function getCertifications() {
  return certificationsSchema.parse(certificationsData)
}

export function getSiteConfig() {
  const config = JSON.parse(JSON.stringify(siteData))
  const years = calculateTotalYearsExperience()
  if (years > 0) {
    config.seo.description = config.seo.description.replace(/\{\{YEARS\}\}/g, years.toString())
  }
  return config
}

/** Collect all unique tech tags across all projects */
export function getAllTechTags(): string[] {
  const projects = getProjects()
  const tags = new Set<string>()
  projects.forEach((p) => p.stack.forEach((t) => tags.add(t)))
  return Array.from(tags).sort()
}
