import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const client = createClient('https://tdxuvdxhfilbcemhgsbr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNzA3MzUwNSwiZXhwIjoxOTUyNjQ5NTA1fQ.yp6-7ngA3qWf07MThrDgfQCOxhULpKG4z7SFttN--Xw')

export { client }