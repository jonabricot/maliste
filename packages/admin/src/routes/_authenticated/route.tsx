import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async ({context}) => {
    if (!context.auth.user || context.auth.user.role !== 'admin') {
      throw redirect({to: '/sign-in'})
    }
  }
})
