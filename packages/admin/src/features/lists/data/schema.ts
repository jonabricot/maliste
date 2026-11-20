import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const listSchema = z.object({
  id: z.string(),
  name: z.string(),
  authorId: z.string(),
})

export type List = z.infer<typeof listSchema>
