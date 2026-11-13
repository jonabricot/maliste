import { Link, useParams } from "react-router"
import {useQuery} from 'react-query'
import { client } from "@/api/client"
import { ListDetails, ListForm } from "@/components/entity/list"
import { Button } from "@/components/ui/button"
import { LucideArrowLeft } from "lucide-react"
import type { ListType } from "api/types"

export function ListPage() {
    const {id} = useParams()
    if (!id) return

    const {data, isFetching} = useQuery({
        queryKey: ['list', id],
        queryFn: async () => {
            const response = await client.list[':id'].$get({param: {id}})
            return await response.json()
        }
    })

    return <div className="container mx-auto p-4 space-y-12">
        <Button variant={"link"} size="none" render={<Link to="/"/>} nativeButton={false}>
            <LucideArrowLeft className="size-[1em]"/>Retour à l'accueil
        </Button>
        {data && <ListDetails entity={data as unknown as ListType} loading={isFetching}/>}
    </div>
}

export function ListCreatePage() {
    return <div className="container mx-auto p-4 space-y-12">
        <Button variant={"link"} size="none" render={<Link to="/"/>} nativeButton={false}>
            <LucideArrowLeft className="size-[1em]"/>Retour à l'accueil
        </Button>
        <ListForm/>
    </div>
}

export function ListEditPage() {
    const {id} = useParams()
    if (!id) return

    const {data} = useQuery({
        queryKey: ['list', id],
        queryFn: async () => {
            const response = await client.list[':id'].$get({param: {id}})
            return await response.json()
        }
    })

    return <div className="container mx-auto p-4 space-y-12">
        <Button variant={"link"} size="none" render={<Link to="/"/>} nativeButton={false}>
            <LucideArrowLeft className="size-[1em]"/>Retour à l'accueil
        </Button>
        {data && <ListForm entity={data as unknown as ListType}/>}
    </div>
}