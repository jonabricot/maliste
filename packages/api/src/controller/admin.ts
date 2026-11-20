import { adminProtectedMiddleware } from "../auth.ts";
import { Hono } from 'hono'
import { db } from "../db/client.ts";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import * as schema from '../db/schema.ts'
import { eq } from "drizzle-orm";

const listRequestSchema = z.object({
    name: z.string(),
    authorId: z.string()
})

const app = new Hono()
    .use('*', adminProtectedMiddleware)
    .get('/users', async (c) => {
        const users = await db.query.user.findMany({ limit: 100 })
        return c.json(users)
    })
    .get('/lists', async (c) => {
        const entities = await db.query.list.findMany({ limit: 100 })
        return c.json(entities)
    })
    .post('/list/:id', zValidator('json', listRequestSchema), async (c) => {
        const {id} = c.req.param()
        const data = await c.req.json()

        const list = await db.query.list.findFirst({where: {id}})
        if (!list) return c.json(null, 404)

        const updatedList = await db.update(schema.list).set(data).where(eq(schema.list.id, id))
        return c.json(updatedList)
    })

export default app