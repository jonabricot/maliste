import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { db } from "./db/client.ts";
import { admin, anonymous } from "better-auth/plugins"
import { createMiddleware } from "hono/factory";
import * as schema from './db/schema.ts'


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
		schema,
    }),
    emailAndPassword: { 
        enabled: true, 
    }, 
    trustedOrigins: [process.env.FRONTEND_URL!, process.env.ADMIN_FRONTEND_URL!], 
    plugins: [anonymous(), admin()],
	session: {
        expiresIn: 60 * 60 * 24 * 30 * 6, // 6 months,
    },
	logger: {
		disabled: false,
		disableColors: false,
		level: "debug",
		log: (level, message, ...args) => {
			console.log(`[${level}] ${message}`, ...args);
		}
	}
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

export const adminProtectedMiddleware = createMiddleware<Session>(async (c, next) => {
    const session = c.get('session')
    
    if (!session) {
		return c.json(null, 403)
	}

	if (session.user.role !== "admin") return c.json(null, 403)

	await next();
});