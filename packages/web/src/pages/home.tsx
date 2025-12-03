import { client } from "@/api/client"
import { ListTeaser } from "@/components/entity/list"
import { Button } from "@/components/ui/button"
import { Title } from "@/components/ui/title"
import { useAppStore } from "@/store"
import { LucidePlus } from "lucide-react"
import { useMemo } from "react"
import { useQuery } from "react-query"
import { Link } from "react-router"

export function HomePage() {
    const {user, sharedList} = useAppStore()

    const {data} = useQuery({
        queryKey: ['lists'],
        queryFn: async () => {
            const response = await client.list.$get({query: {user: user?.id, token: user?.token, shared: sharedList}})            
            const lists = await response.json()
            return lists
        }
    })

    const personalLists = useMemo(() => data?.filter(list => list.authorId === user?.id), [data])
    const sharedLists = useMemo(() => data?.filter(list => list.authorId !== user?.id), [data])

    return <div className="container mx-auto p-4 space-y-8">
        <section>
            <div className="flex gap-4 items-center mb-4">
                <Title variant={"h1"}>Vos listes</Title>
                <Button asChild><Link to="/list/create"><LucidePlus/>Créer une liste</Link></Button>
            </div>
            {(!personalLists || personalLists.length === 0) && <p className="text-muted-foreground text-sm">Vous n'avez pas encore de liste.</p>}
            {personalLists && personalLists.length > 0 && <div className="grid grid-cols-[repeat(auto-fill,minmax(20ch,1fr))] gap-4">
                {personalLists?.map(list => <ListTeaser entity={list}/>)}
            </div>}
        </section>
        {sharedLists && sharedLists?.length > 0 && <section>
            <Title variant={"h1"} className="mb-4">Listes d'amis</Title>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(20ch,1fr))] gap-4">
                {sharedLists?.map(list => <ListTeaser entity={list}/>)}
            </div>
        </section>}
    </div>
}