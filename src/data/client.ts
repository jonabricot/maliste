import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const client = createClient(import.meta.env.VITE_SUPABASE_ENDPOINT, import.meta.env.VITE_SUPABASE_PUBLIC_KEY)

export { client }