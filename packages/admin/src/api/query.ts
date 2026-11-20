import { QueryCache, QueryClient, useQuery } from "@tanstack/react-query";
import { client } from "./client";
import { AxiosError } from "axios";
import { handleServerError } from "@/lib/handle-server-error";
import { toast } from "sonner";
import {router} from '@/router'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error })

        if (failureCount >= 0 && import.meta.env.DEV) return false
        if (failureCount > 3 && import.meta.env.PROD) return false

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        )
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        handleServerError(error)

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast.error('Content not modified!')
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error('Session expired!')
        //   useAuthStore.getState().auth.reset()
          const redirect = `${router.history.location.href}`
          router.navigate({ to: '/sign-in', search: { redirect } })
        }
        if (error.response?.status === 500) {
          toast.error('Internal Server Error!')
          // Only navigate to error page in production to avoid disrupting HMR in development
          if (import.meta.env.PROD) {
            router.navigate({ to: '/500' })
          }
        }
        if (error.response?.status === 403) {
          // router.navigate("/forbidden", { replace: true });
        }
      }
    },
  }),
})

export function useListQuery(id: string) {
    return useQuery(getListQueryParams(id))
}

export function getListQueryParams(id: string) {
    return {
        queryKey: ['list', id],
        queryFn: async () => {
            const response = await client.list[":id"].$get({param: {id}})
            if (response.ok) {
                return await response.json()
            }
            return null
        }
    }
} 

export function getHomeQueryParams() {
    return {
        queryKey: ['lists'],
        queryFn: () => client.list.$get().then(r => r.json())
    }
}

export function useHomeQuery() {
    return useQuery(getHomeQueryParams())
}