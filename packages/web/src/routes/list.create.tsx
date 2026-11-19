import { ListForm } from '@/components/entity/list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/list/create')({
  component: ListCreatePage,
})

function ListCreatePage() {
  return <ListForm/>
}