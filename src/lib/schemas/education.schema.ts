import { z } from 'zod'

const educationEntrySchema = z.object({
  degree: z.string(),
  field: z.string(),
  institution: z.string(),
  location: z.string(),
  graduationYear: z.number(),
  highlights: z.array(z.string()).optional().default([]),
})

export const educationSchema = z.array(educationEntrySchema)

export type EducationEntry = z.infer<typeof educationEntrySchema>
export type Education = z.infer<typeof educationSchema>
