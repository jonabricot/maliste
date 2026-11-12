import { Hono } from 'hono'
import { processEnvFile } from './env.ts'
import z from 'zod'
import { zValidator } from '@hono/zod-validator'
import * as schema from './db/schema.ts'
import { and, asc, eq, inArray, or } from 'drizzle-orm'
import { cors } from 'hono/cors'
import { getLinkPreview } from 'link-preview-js'
import { db } from './db/client.ts'
import { auth, protectedMiddleware, sessionMiddleware } from './auth.ts'

processEnvFile()

const app = new Hono()
app.use('*', cors({origin: [process.env.FRONTEND_URL!], credentials: true }))
app.use('*', sessionMiddleware)
app.all("/api/auth/*", (c) => auth.handler(c.req.raw)); 

const ideaSchema = {
  id: z.int().optional().nullable(),
  name: z.string(),
  link: z.string().optional().nullable(),
}

const participantSchema = {
  id: z.int().optional().nullable(),
  name: z.string(),
}

const listchema = {
  name: z.string(),
  participants: z.array(z.object(participantSchema)),
  ideas: z.array(z.object(ideaSchema))
}

const listRequestSchema = z.object({
  ...listchema
})

const ideaSchemaRequest = z.object({
  ...ideaSchema
})


export const route = app
  .get("/list/:id", protectedMiddleware, async c => {
    const user = c.get('session')!.user
    const {id} = c.req.param()
    const list = await db.query.list.findFirst({
      with: { 
        ideas: {
          orderBy: { id: "asc" },
          with: { participants: true, author: true }
        },
        participants: true,
        author: true
      },
      where: { id }
    })

    if (!list) return c.json({}, 404)

    const userDb = await db.query.user.findFirst({
      with: { 
        sharedLists: {
          where: {
            id: list.id,
          }
        }
      },
      where: { id: user.id }
    })

    if (list.authorId !== user.id && userDb?.sharedLists.length === 0) {
      await db.insert(schema.sharedList).values({listId: list.id, userId: user.id});
    }

    const dbUser = await db.query.user.findFirst({ where: { id: user.id }, with: {participations: {where: {listId: list?.id}}}})

    return c.json({...list, participant: dbUser?.participations[0]??null})
  })
  // .get("/list/:id/shared", protectedMiddleware, async c => {
  //   const user = c.get('session')!.user
  //   const {id} = c.req.param()

  //   const list = await db.query.list.findFirst({
  //     where: { id }
  //   })

  //   if (!list) return c.json(null, 404)

  //   const userDb = await db.query.user.findFirst({
  //     with: { 
  //       sharedLists: {
  //         where: {
  //           id: list.id
  //         }
  //       }
  //     },
  //     where: { id: user.id }
  //   })

  //   if (userDb?.sharedLists.length === 0) {
  //     await db.insert(schema.sharedList).values({listId: list.id, userId: user.id});
  //   }

  //   const updatedUser = await db.query.user.findFirst({
  //     where: {id: user.id},
  //     with: {
  //       sharedLists: true
  //     }
  //   })

  //   return c.json(updatedUser)
  // })
  .get("/list", protectedMiddleware, async c => {
    const user = c.get('session')!.user
    const shared = c.req.queries('shared')

    const userDb = await db.query.user.findFirst({
      where: { id: user.id },
      with: { 
        lists: {
          with: { 
            ideas: true,
            participants: true,
          }
        },
        sharedLists: {
          with: { 
            ideas: true,
            participants: true,
          }
        }
      },
    })

    return c.json(userDb)
  })
  .post("/idea/:id/book", protectedMiddleware, async c => {
    const {id: idParam} = c.req.param()
    const id = parseInt(idParam)
    const user = c.get('session')!.user
    
    const idea = await db.query.idea.findFirst({where: {id}, with: {participants: true}})
    if (!idea) return c.notFound()

    const currentUserParticipant = await db.query.participant.findFirst({
      where: {
        listId: idea.listId!,
        users: {
          id: user.id
        }
      }
    })

    if (!currentUserParticipant) return c.json(null, 403)

    if (idea.participants.find(p => p.id === currentUserParticipant.id)) return c.json(idea)

    await db.insert(schema.participantToIdea).values({ ideaId: idea.id, participantId: currentUserParticipant.id })

    const updatedIdea = await db.query.idea.findFirst({ where: {id: idea.id}, with: { participants: true } })
    return c.json(updatedIdea)
  })
  .post("/idea/:id/unbook", protectedMiddleware, async c => {
    const {id: idParam} = c.req.param()
    const id = parseInt(idParam)
    const user = c.get('session')!.user

    const idea = await db.query.idea.findFirst({where: {id}})
    if (!idea) return c.notFound()

    const currentUserParticipant = await db.query.participant.findFirst({
      where: {
        listId: idea.listId!,
        users: {
          id: user.id
        }
      }
    })

    if (!currentUserParticipant) return c.json(null, 403)

    await db.delete(schema.participantToIdea).where(and(
      eq(schema.participantToIdea.ideaId, idea.id), 
      eq(schema.participantToIdea.participantId, currentUserParticipant.id)
    ))
    
    const updatedIdea = await db.query.idea.findFirst({ where: {id: idea.id}, with: { participants: true } })
    return c.json(updatedIdea)
  })
  .post("/list", zValidator('json', listRequestSchema), protectedMiddleware, async c => {
    const {ideas, participants, ...list} = await c.req.json<z.infer<typeof listRequestSchema>>()
    const user = c.get('session')!.user

    const [insertedList] = await db.insert(schema.list).values({...list, authorId: user.id}).returning()
    await db.insert(schema.idea).values(ideas.map(idea => ({...idea, listId: insertedList.id})))
    await db.insert(schema.participant).values(participants.map(participant => ({...participant, listId: insertedList.id})))

    const createdList = await db.query.list.findFirst({
      with: { 
        ideas: {orderBy: {id: 'asc'}},
        participants: {orderBy: {id: 'asc'}},
        author: true
      },
      where: {id: insertedList.id}
    })

    return c.json(createdList)
  })
  .post("/list/:id", zValidator('json', listRequestSchema), protectedMiddleware, async c => {
    const {id} = c.req.param()
    const {ideas, participants, ...list} = await c.req.json<z.infer<typeof listRequestSchema>>()
    const user = c.get('session')!.user

    const foundedList = await db.query.list.findFirst({
      with: { 
        ideas: true,
        participants: true
      },
      where: {id}
    })

    if (!foundedList) return c.json(null, 404)
    if (user.id !== foundedList.authorId) return c.json(null, 403)
    
    await db.update(schema.list).set(list).where(eq(schema.list.id, id))

    const deletedIdeas = foundedList.ideas.filter(idea => !ideas.map(i => i.id).includes(idea.id))
    const updatedIdeas = ideas.filter(idea => idea.id !== undefined)
    const newIdeas = ideas.filter(idea => idea.id === undefined)

    if (deletedIdeas.length > 0) {
      await db.delete(schema.idea).where(inArray(schema.idea.id, deletedIdeas.map(idea => idea.id)))
    }
    if (newIdeas.length > 0) {
      await db.insert(schema.idea).values(newIdeas.map(idea => ({...idea, listId: foundedList.id})))
    }
    for (const updatedIdea of updatedIdeas) {
      const {id, ...idea} = updatedIdea

      if(id) {
        await db.update(schema.idea).set(idea).where(eq(schema.idea.id, id))
      }
    }

    const deletedParticipants = foundedList.participants.filter(participant => !participants.map(i => i.id).includes(participant.id))
    const updatedParticipants = participants.filter(participant => participant.id !== undefined)
    const newParticipants = participants.filter(participant => participant.id === undefined)

    if (deletedParticipants.length > 0) {
      await db.delete(schema.participant).where(inArray(schema.participant.id, deletedParticipants.map(participant => participant.id)))
    }
    if (newParticipants.length > 0) {
      await db.insert(schema.participant).values(newParticipants.map(participant => ({...participant, listId: foundedList.id, authorId: user.id})))
    }
    for (const updatedParticipant of updatedParticipants) {
      const {id, ...participant} = updatedParticipant

      if(id) {
        await db.update(schema.participant).set(participant).where(eq(schema.participant.id, id))
      }
    }

    const updatedList = await db.query.list.findFirst({
      with: { 
        ideas: true,
        participants: true
      },
      where: {id}
    })

    return c.json(updatedList)
  })
  .post("/list/:id/participate", zValidator('json', z.object({id: z.number()})), protectedMiddleware, async c => {
    const {id} = c.req.param()
    const participant = await c.req.json()
    const user = c.get('session')!.user

    const foundedList = await db.query.list.findFirst({
      with: { 
        ideas: true,
        participants: true
      },
      where: {id}
    })

    if (!foundedList) return c.json(null, 404)
      
    const foundedParticipant = await db.query.participant.findFirst({where: { id: participant.id }})

    if (!foundedParticipant) return c.json(null, 404)

    const currentUserParticipant = await db.query.participant.findMany({
      where: {
        listId: foundedList.id,
        users: {
          id: user.id
        }
      }
    })

    await db.delete(schema.userToParticipant).where(inArray(schema.userToParticipant.participantId, currentUserParticipant.map(p => p.id)))
    await db.insert(schema.userToParticipant).values({ userId: user.id, participantId: foundedParticipant.id })

    const updatedList = await db.query.list.findFirst({
      with: { 
        ideas: true,
        participants: true,
      },
      where: {id}
    })

    return c.json(updatedList)
  })
  .post("/list/:id/idea", zValidator('json', ideaSchemaRequest), protectedMiddleware, async c => {
    const {id} = c.req.param()
    const {...idea} = await c.req.json<z.infer<typeof ideaSchemaRequest>>()
    const user = c.get('session')!.user

    const foundedList = await db.query.list.findFirst({
      where: {id}
    })

    if (!foundedList) return c.json(null, 404)
    if (!foundedList.allowIdeaProposal) return c.json(null, 403)

    const userDb = await db.query.user.findFirst({
      where: { id: user.id },
      with: {
        participations: {
          where: {
            listId: id
          }
        }
      }
    })

    const currentParticipant = userDb?.participations[0]
    if (!currentParticipant) return c.json({}, 403)

    await db.insert(schema.idea).values({...idea, listId: foundedList.id, authorId: currentParticipant.id})

    const updatedList = await db.query.list.findFirst({
      with: { 
        ideas: true,
        participants: true,
      },
      where: {id}
    })

    return c.json(updatedList)
  })
  .post("/list/:list/idea/:idea", zValidator('json', ideaSchemaRequest), protectedMiddleware, async c => {
    const {list, idea} = c.req.param()
    const {name, link} = await c.req.json<z.infer<typeof ideaSchemaRequest>>()
    const user = c.get('session')!.user

    const foundedList = await db.query.list.findFirst({
      where: {id: list}
    })

    if (!foundedList) return c.json(null, 404)
    if (!foundedList.allowIdeaProposal) return c.json(null, 403)

    const foundedIdea = await db.query.idea.findFirst({
      where: {id: Number(idea)}
    })

    if (!foundedIdea) return c.json(null, 404)

    const userDb = await db.query.user.findFirst({
      where: { id: user.id },
      with: {
        participations: {
          where: {
            listId: list
          }
        }
      }
    })

    const currentParticipant = userDb?.participations[0]
    if (!currentParticipant) return c.json({}, 403)

    await db.update(schema.idea).set({name, link}).where(eq(schema.idea.id, foundedIdea.id))

    const updatedList = await db.query.list.findFirst({
      with: { 
        ideas: true,
        participants: true,
      },
      where: {id: list}
    })

    return c.json(updatedList)
  })
  .delete("/list/:list/idea/:idea", protectedMiddleware, async c => {
    const {list, idea} = c.req.param()
    const user = c.get('session')!.user

    const foundedList = await db.query.list.findFirst({
      where: {id: list}
    })

    if (!foundedList) return c.json(null, 404)

    const foundedIdea = await db.query.idea.findFirst({
      where: {id: Number(idea)}
    })

    if (!foundedIdea) return c.json(null, 404)

    const userDb = await db.query.user.findFirst({
      where: { id: user.id },
      with: {
        participations: {
          where: {
            listId: list
          }
        }
      }
    })

    const currentParticipant = userDb?.participations[0]
    if (!currentParticipant) return c.json({}, 403)

    await db.delete(schema.idea).where(eq(schema.idea.id, foundedIdea.id))

    const updatedList = await db.query.list.findFirst({
      with: { 
        ideas: true,
        participants: true,
      },
      where: {id: list}
    })

    return c.json(updatedList)
  })

export default app;


