import { getListQueryParams } from '@/api/query'
import { BackButton } from '@/components/back-button'
import { ListForm } from '@/components/entity/list'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import type { ListType } from 'api/types'

export const Route = createFileRoute('/list_/$id/edit')({
  component: ListEditPage,
  loader: async ({context, params}) => {
    if (!context.auth.user) throw redirect({to: '/'})

    const list = await context.queryClient.query(getListQueryParams(params.id))
    if (!list || list.authorId !== context.auth.user.id) throw notFound()

    return list
  },
  context: () => ({
    back: () => <BackButton to="..">Retour à la liste</BackButton>
  }),
})

function ListEditPage() {
  const list = Route.useLoaderData()

  return <ListForm entity={list as unknown as ListType}/>
}