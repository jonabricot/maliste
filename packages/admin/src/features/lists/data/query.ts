import { client } from "@/api/client";

export function getListsQueryOptions() {
    return {
        queryKey: ['lists'],
        queryFn: () => client.admin.lists.$get().then(r => r.json())
    }
}