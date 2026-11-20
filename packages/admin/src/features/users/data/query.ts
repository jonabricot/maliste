import { client } from "@/api/client";

export function getUsersQueryOption() {
    return {
        queryKey: ['users'],
        queryFn: () => client.admin.users.$get().then(r => r.json())
    }
}