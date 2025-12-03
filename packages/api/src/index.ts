import { Hono } from 'hono'
import { processEnvFile } from './env.js'
import z from 'zod'
import { zValidator } from '@hono/zod-validator'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './db/schema.ts'
import { and, asc, eq, inArray, or } from 'drizzle-orm'

processEnvFile()

const app = new Hono()
const db = drizzle(process.env.POSTGRES_URL!, {schema});

const listSchema = z.object({
  user: z.string(), 
  token: z.string(),
  name: z.string(),
  participants: z.array(z.string()),
  ideas: z.array(z.object({
    id: z.int().optional().nullable(),
    name: z.string(),
    link: z.string().optional().nullable()
  }))
})

export const route = app
  .get("/auth/anonymous", async (c) => {
    const [user] = await db.insert(schema.users).values({}).returning()
    return c.json(user)
  })
  .post("/auth/anonymous", zValidator('json', z.object({id: z.string(), token: z.string()})), async c => {
    const {id, token} = await c.req.json()
    const user = await db.query.users.findFirst({where: and(eq(schema.users.id, id), eq(schema.users.token, token))})

    if (user) {
      return c.json(user)
    }

    return c.json({}, 403)
  })
  .get("/list/:id", async c => {
    const {id} = c.req.param()
    const list = await db.query.lists.findFirst({
      with: { 
        ideas: {orderBy: asc(schema.ideas.id)},
        author: true
      },
      where: eq(schema.lists.id, id)
    })

    return c.json(list)
  })
  .get("/list", async c => {
    const user = c.req.query('user')
    const token = c.req.query('token')
    const shared = c.req.queries('shared')

    if (!user || !token) return c.json([], 403)

    const foundedUser = await db.query.users.findFirst({where: and(eq(schema.users.id, user), eq(schema.users.token, token))})
    if (!foundedUser) return c.json([], 403)

    const list = await db.query.lists.findMany({
      with: { 
        ideas: {orderBy: asc(schema.ideas.id)},
        author: true
      },
      where: or(eq(schema.lists.authorId, foundedUser.id), inArray(schema.lists.id, shared??[]))
    })

    return c.json(list)
  })
  .post("/idea/:id/book", zValidator('json', z.object({user: z.string(), token: z.string(), participant: z.string()})), async c => {
    const {user, token, participant} = await c.req.json()
    const {id: idParam} = c.req.param()
    const id = parseInt(idParam)
    const foundedUser = await db.query.users.findFirst({where: and(eq(schema.users.id, user), eq(schema.users.token, token))})

    if (!foundedUser) {
      return c.json(undefined, 403)
    }

    const idea = await db.query.ideas.findFirst({where: eq(schema.ideas.id, id)})
    if (!idea) return c.notFound()

    if (idea.participants?.includes(participant)) return c.json(idea)
    
    const [updatedIdea] = await db.update(schema.ideas).set({participants: [...(idea.participants ?? []), participant]}).where(eq(schema.ideas.id, id)).returning()
    return c.json(updatedIdea)
  })
  .post("/idea/:id/unbook", zValidator('json', z.object({user: z.string(), token: z.string(), participant: z.string()})), async c => {
    const {user, token, participant} = await c.req.json()
    const {id: idParam} = c.req.param()
    const id = parseInt(idParam)
    const foundedUser = await db.query.users.findFirst({where: and(eq(schema.users.id, user), eq(schema.users.token, token))})

    if (!foundedUser) {
      return c.json(undefined, 403)
    }

    const idea = await db.query.ideas.findFirst({where: eq(schema.ideas.id, id)})
    if (!idea) return c.notFound()

    const participantIndex = (idea.participants??[]).findIndex(p => p === participant)
    if (participantIndex === -1) return c.json(idea)

    const newParticipantsList = [
      ...(idea.participants ?? []).slice(0, participantIndex),
      ...(idea.participants ?? []).slice(participantIndex+1),
    ]
    
    const [updatedIdea] = await db.update(schema.ideas).set({participants: newParticipantsList}).where(eq(schema.ideas.id, id)).returning()
    return c.json(updatedIdea)
  })
  .post("/list", zValidator('json', listSchema), async c => {
    const {user, token, ideas, ...list} = await c.req.json<z.infer<typeof listSchema>>()

    if (!user || !token) return c.json(null, 403)

    const foundedUser = await db.query.users.findFirst({where: and(eq(schema.users.id, user), eq(schema.users.token, token))})
    if (!foundedUser) return c.json(null, 403)

    const [insertedList] = await db.insert(schema.lists).values({...list, authorId: foundedUser.id}).returning()
    await db.insert(schema.ideas).values(ideas.map(idea => ({name: idea.name, link: idea.link, listId: insertedList.id})))

    const createdList = await db.query.lists.findFirst({
      with: { 
        ideas: {orderBy: asc(schema.ideas.id)},
        author: true
      },
      where: eq(schema.lists.id, insertedList.id)
    })

    return c.json(createdList)
  })
  .post("/list/:id", zValidator('json', listSchema), async c => {
    const {id} = c.req.param()
    const {user, token, ideas, ...list} = await c.req.json<z.infer<typeof listSchema>>()

    if (!user || !token) return c.json(null, 403)

    const foundedUser = await db.query.users.findFirst({where: and(eq(schema.users.id, user), eq(schema.users.token, token))})
    if (!foundedUser) return c.json(null, 403)

    const foundedList = await db.query.lists.findFirst({
      with: { 
        ideas: true,
      },
      where: eq(schema.lists.id, id)
    })

    if (!foundedList) return c.json(null, 404)
    if (foundedUser.id !== foundedList.authorId) return c.json(null, 403)
    
    await db.update(schema.lists).set(list).where(eq(schema.lists.id, id))

    const deletedIdeas = foundedList.ideas.filter(idea => !ideas.map(i => i.id).includes(idea.id))
    const updatedIdeas = ideas.filter(idea => idea.id !== undefined)
    const newIdeas = ideas.filter(idea => idea.id === undefined)

    if (deletedIdeas.length > 0) {
      await db.delete(schema.ideas).where(inArray(schema.ideas.id, deletedIdeas.map(idea => idea.id)))
    }
    if (newIdeas.length > 0) {
      await db.insert(schema.ideas).values(newIdeas.map(idea => ({...idea, listId: foundedList.id})))
    }
    for (const updatedIdea of updatedIdeas) {
      const {id, ...idea} = updatedIdea

      if(id) {
        await db.update(schema.ideas).set(idea).where(eq(schema.ideas.id, id))
      }
    }

    const updatedList = await db.query.lists.findFirst({
      with: { 
        ideas: true,
      },
      where: eq(schema.lists.id, id)
    })

    return c.json(updatedList)
  })

export default app;


