import { createRouter } from "@tanstack/react-router"
import { queryClient } from "./api/query"
import { routeTree } from './routeTree.gen'
import { QueryClient } from "@tanstack/react-query"
import { defaultAuthContext, useAuth } from "./auth"

export interface RouterContext {
  auth: ReturnType<typeof useAuth>,
  queryClient: QueryClient,
}

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: { queryClient, auth: defaultAuthContext },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
