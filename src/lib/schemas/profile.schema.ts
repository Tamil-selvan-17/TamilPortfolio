import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string(),
  initials: z.string(),
  title: z.string(),
  taglines: z.array(z.string()),
  summary: z.string(),
  location: z.string(),
  email: z.string(),
  links: z.object({
    github: z.string().nullable(),
    linkedin: z.string().nullable(),
    twitter: z.string().nullable(),
    website: z.string().nullable(),
  }),
  availability: z.object({
    status: z.enum(['open', 'closed', 'selective']),
    label: z.string(),
  }),
  resumeVersion: z.string(),
  resumeUpdatedAt: z.string(),
  resumeUrl: z.string(),
})

export type Profile = z.infer<typeof profileSchema>
