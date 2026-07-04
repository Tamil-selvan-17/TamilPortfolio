import { z } from 'zod'

const impactSchema = z.object({
  value: z.number(),
  suffix: z.string(),
  label: z.string(),
})

const projectLinksSchema = z.object({
  live: z.string().nullable(),
  github: z.string().nullable(),
})

const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  stack: z.array(z.string()),
  summary: z.string(),
  impact: z.array(impactSchema),
  problem: z.string(),
  solution: z.string(),
  featured: z.boolean(),
  links: projectLinksSchema,
})

export const projectsSchema = z.array(projectSchema)

export type Project = z.infer<typeof projectSchema>
export type Projects = z.infer<typeof projectsSchema>
export type ImpactMetric = z.infer<typeof impactSchema>
