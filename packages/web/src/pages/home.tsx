import { client } from "@/api/client"
import { ListTeaser } from "@/components/entity/list"
import { Button } from "@/components/ui/button"
import { Title } from "@/components/ui/title"
import { LucidePlus } from "lucide-react"
import { useQuery } from "react-query"
import { Link } from "react-router"

export function HomePage() {
    const {data} = useQuery({
        queryKey: ['lists'],
        queryFn: async () => {
            const response = await client.list.$get()            
            const lists = await response.json()
            return lists
        }
    })

    return <div className="container mx-auto p-4 space-y-8">
        <section>
            <div className="flex gap-4 items-center mb-4">
                <Title variant={"h1"}>Vos listes</Title>
                <Button render={<Link to="/list/create"/>}><LucidePlus/>Créer une liste</Button>
            </div>
            {data && data.lists.length === 0 && <p className="text-muted-foreground text-sm">Vous n'avez pas encore de liste.</p>}
            {data && data.lists.length > 0 && <div className="grid grid-cols-[repeat(auto-fill,minmax(20ch,1fr))] gap-4">
                {data.lists.map(list => <ListTeaser entity={list}/>)}
            </div>}
        </section>
        {data && data.sharedLists?.length > 0 && <section>
            <Title variant={"h1"} className="mb-4">Listes d'amis</Title>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(20ch,1fr))] gap-4">
                { data.sharedLists?.map(list => <ListTeaser entity={list}/>)}
            </div>
        </section>}
    </div>
}