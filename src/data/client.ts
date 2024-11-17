import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const client = createClient('https://pywlxvteslthmqrixtci.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5d2x4dnRlc2x0aG1xcml4dGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3NzY5NDUsImV4cCI6MjA0NzM1Mjk0NX0.a51hB037Y8kY7EZ3FqpQGBt3VKHVEaOAGBBSVDzwHAE')

export { client }