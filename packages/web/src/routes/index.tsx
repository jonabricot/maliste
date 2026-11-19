import { getHomeQueryParams } from '@/api/query'
import { ListTeaser } from '@/components/entity/list'
import { Button } from '@/components/ui/button'
import { Title } from '@/components/ui/title'
import { Link, createFileRoute } from '@tanstack/react-router'
import type { ListType } from 'api/types'
import { LucidePlus } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomeComponent,
  loader: ({context}) => context.queryClient.query(getHomeQueryParams()),
})

function HomeComponent() {
  const {lists, sharedLists} = Route.useLoaderData()

  return <div className="space-y-8">
        <section>
            <div className="flex gap-4 items-center mb-4">
                <Title variant={"h1"}>Vos listes</Title>
                <Button render={<Link to="/list/create"/>} nativeButton={false}><LucidePlus/>Créer une liste</Button>
            </div>
            {lists.length === 0 && <p className="text-muted-foreground text-sm">Vous n'avez pas encore de liste.</p>}
            {lists.length > 0 && <div className="grid grid-cols-[repeat(auto-fill,minmax(20ch,1fr))] gap-4">
                {lists.map(list => <ListTeaser key={list.id} entity={list as unknown as ListType}/>)}
            </div>}
        </section>
        {sharedLists.length > 0 && <section>
            <Title variant={"h1"} className="mb-4">Listes d'amis</Title>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(20ch,1fr))] gap-4">
                { sharedLists.map(list => <ListTeaser key={list.id} entity={list as unknown as ListType}/>)}
            </div>
        </section>}
    </div>
}