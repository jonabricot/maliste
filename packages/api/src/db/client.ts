import { drizzle } from "drizzle-orm/node-postgres";
import {relations} from './relations.ts'
import { processEnvFile } from "../env.ts";

processEnvFile()
export const db = drizzle(process.env.DATABASE_URL!, {relations});