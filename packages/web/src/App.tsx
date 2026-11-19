import { router } from './router'
import { useAuth } from './auth'
import { RouterProvider } from '@tanstack/react-router'

export function App() {
  const auth = useAuth()

  return <RouterProvider router={router} context={{ auth }} />
}