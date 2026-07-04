import { z } from 'zod'

const metricSchema = z.object({
  value: z.number(),
  suffix: z.string(),
  label: z.string(),
})

const highlightSchema = z.object({
  text: z.string(),
  metric: metricSchema.optional(),
})

const experienceEntrySchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  progression: z.array(z.string()).optional().default([]),
  highlights: z.array(highlightSchema),
  techStack: z.array(z.string()),
})

export const experienceSchema = z.array(experienceEntrySchema)

export type ExperienceEntry = z.infer<typeof experienceEntrySchema>
export type Experience = z.infer<typeof experienceSchema>
export type Highlight = z.infer<typeof highlightSchema>
export type Metric = z.infer<typeof metricSchema>
