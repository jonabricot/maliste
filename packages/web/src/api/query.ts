import { QueryClient, useQuery } from "@tanstack/react-query";
import { client } from "./client";

export const queryClient = new QueryClient()

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