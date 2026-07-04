import { z } from 'zod'

const skillSchema = z.object({
  name: z.string(),
  level: z.number().min(1).max(5),
  yearsUsed: z.number().optional(),
})

const skillGroupSchema = z.object({
  category: z.string(),
  icon: z.string(),
  skills: z.array(skillSchema),
})

export const skillsSchema = z.array(skillGroupSchema)

export type Skill = z.infer<typeof skillSchema>
export type SkillGroup = z.infer<typeof skillGroupSchema>
export type Skills = z.infer<typeof skillsSchema>
