import { createRootRouteWithContext, Outlet, useRouterState } from '@tanstack/react-router'
import type { RouterContext } from '@/router'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const matches = useRouterState({ select: (s) => s.matches })

  const backs = matches
    .filter((match) => match.context.back)
  
  return <div className="container mx-auto p-4 space-y-12">
    {backs.length > 0 && backs[backs.length-1].context.back?.()}
    <Outlet/>
  </div>
}