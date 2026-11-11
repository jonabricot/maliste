import { serve } from "@hono/node-server"
import app from "./server.ts"

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})


