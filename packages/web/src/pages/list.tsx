import { Link, useParams } from "react-router"
import {useQuery} from 'react-query'
import { client } from "@/api/client"
import { ListDetails, ListForm } from "@/components/entity/list"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo } from "react"
import { useAppStore } from "@/store"
import { LucideArrowLeft } from "lucide-react"

export function ListPage() {
    const {user, sharedList, addSharedList} = useAppStore()
    const {id} = useParams()
    if (!id) return

    const {data, isFetching} = useQuery({
        queryKey: ['list', id],
        queryFn: async () => {
            const response = await client.list[':id'].$get({param: {id}})
            return await response.json()
        }
    })

    useEffect(() => {
        if(data && user && data.authorId !== user.id && !sharedList.includes(data.id)) {
            addSharedList(data.id)
        }
    }, [data, user, sharedList])

    return <div className="container mx-auto p-4 space-y-12">
        <Button variant={"link"} asChild>
            <Link to="/"><LucideArrowLeft className="size-[1em]"/>Retour à l'accueil</Link>
        </Button>
        {data && <ListDetails entity={data} loading={isFetching}/>}
    </div>
}

export function ListCreatePage() {
    return <div className="container mx-auto p-4 space-y-12">
        <Button variant={"link"} asChild>
            <Link to="/"><LucideArrowLeft className="size-[1em]"/>Retour à l'accueil</Link>
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

    const editionEntity = useMemo(() => {
        if (!data) return null

        const {participants, ideas, author: _, createdAt: ___, ...entity} = data

        return {
            ...entity,
            participants: (participants??[]).map(name => ({name})),
            ideas: (ideas??[]).map(({createdAt: _, listId: __, participants: ___, ...idea}) => idea)
        }
    }, [data])

    return <div className="container mx-auto p-4 space-y-12">
        <Button variant={"link"} asChild>
            <Link to="/"><LucideArrowLeft className="size-[1em]"/>Retour à l'accueil</Link>
        </Button>
        {editionEntity && <ListForm entity={editionEntity}/>}
    </div>
}