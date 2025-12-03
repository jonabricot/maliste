import {processEnvFile} from './src/env.ts'
import { defineConfig } from 'drizzle-kit';

processEnvFile()

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});