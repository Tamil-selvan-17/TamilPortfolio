import { z } from 'zod'

const certificationSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  credentialId: z.string().optional(),
  url: z.string().optional(),
  badgeColor: z.string().optional(),
})

export const certificationsSchema = z.array(certificationSchema)

export type Certification = z.infer<typeof certificationSchema>
export type Certifications = z.infer<typeof certificationsSchema>
