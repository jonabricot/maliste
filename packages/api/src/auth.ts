import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { db } from "./db/client.ts";
import { anonymous } from "better-auth/plugins"
import { createMiddleware } from "hono/factory";
import * as schema from './db/schema.ts'
import { HTTPException } from "hono/http-exception";


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
		schema,
    }),
    emailAndPassword: { 
        enabled: true, 
    }, 
    trustedOrigins: [process.env.FRONTEND_URL!], 
    plugins: [anonymous()]
});

type Session = {
	Variables: {
		session: typeof auth.$Infer.Session | null;
	};
};

export const sessionMiddleware = createMiddleware<Session>(async (c, next) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	c.set("session", session);

	await next();
});

export const protectedMiddleware = createMiddleware<Session>(async (c, next) => {
    const session = c.get('session')
    
    if (!session) {
		return c.json(null, 403)
	}

	await next();
});