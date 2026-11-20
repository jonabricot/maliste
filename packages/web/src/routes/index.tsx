import { getHomeQueryParams } from '@/api/query'
import { useAuth } from '@/auth'
import { ListTeaser } from '@/components/entity/list'
import { ResponsivePopover, ResponsivePopoverContent, ResponsivePopoverTrigger } from '@/components/reponsive-popover'
import { Button } from '@/components/ui/button'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item'
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/components/ui/popover'
import { Title } from '@/components/ui/title'
import { Link, createFileRoute } from '@tanstack/react-router'
import type { ListType } from 'api/types'
import { LucideHatGlasses, LucidePlus, LucideUser } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomeComponent,
  loader: ({context}) => context.queryClient.query(getHomeQueryParams()),
})

function HomeComponent() {
  const {lists, sharedLists} = Route.useLoaderData()
  const {user} = useAuth()

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
        <ResponsivePopover>
            <ResponsivePopoverTrigger render={<Button variant="outline" size="sm"/>}>
                {user?.isAnonymous ? <><LucideHatGlasses/> Utilisateur anonyme</> : <><LucideUser/> {user?.email}</>}
            </ResponsivePopoverTrigger>
            <ResponsivePopoverContent className="p-0">
                <div className="p-4 space-y-4">
                    <Item className="p-0">
                        <ItemContent>
                            <ItemTitle>Utilisateur connecté</ItemTitle>
                            <ItemDescription>Cette application utilise un système d'utilisateur anonyme. </ItemDescription>
                        </ItemContent>
                    </Item>
                    <Item variant={"muted"}>
                        <ItemContent className="grid grid-cols-[auto_1fr] gap-x-4">
                            <ItemDescription>Nom</ItemDescription>
                            <ItemTitle>{user?.isAnonymous ? <>Utilisateur anonyme</> : user?.name}</ItemTitle>
                            <ItemDescription>Email</ItemDescription>
                            <ItemTitle className="break-all">{user?.email}</ItemTitle>
                        </ItemContent>
                    </Item>
                    <p className="text-muted-foreground">La création de compte n'est pas encore disponible.</p>
                </div>
            </ResponsivePopoverContent>
        </ResponsivePopover>
    </div>
}