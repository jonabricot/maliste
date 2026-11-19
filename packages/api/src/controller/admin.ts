import { adminProtectedMiddleware } from "../auth.ts";
import { Hono } from 'hono'
import { db } from "../db/client.ts";

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

export default app