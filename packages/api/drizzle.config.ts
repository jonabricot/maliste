import {processEnvFile} from './src/env.ts'
import { defineConfig } from 'drizzle-kit';

processEnvFile()

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.*',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});