import { getListQueryParams } from '@/api/query'
import { BackButton } from '@/components/back-button'
import { ListDetails } from '@/components/entity/list'
import { createFileRoute } from '@tanstack/react-router'
import type { ListType } from 'api/types'

export const Route = createFileRoute('/list/$id')({
  component: ListDetailsPage,
  loader: async ({context, params}) => context.queryClient.query(getListQueryParams(params.id)),
  context: () => ({
    back: () => <BackButton to="/">Retour à l'accueil</BackButton>
  }),
  pendingComponent: () => 'loading'
})

function ListDetailsPage() {
  const list = Route.useLoaderData()

  return <ListDetails entity={list as unknown as ListType}/>
}