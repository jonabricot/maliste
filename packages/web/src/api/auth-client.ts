
import { createAuthClient } from "better-auth/client"
import { adminClient, anonymousClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_URL,
    plugins: [
        anonymousClient(),
        adminClient()
    ]
})