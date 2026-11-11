import { ThemeProvider } from 'next-themes'
import { RouterProvider } from 'react-router'
import { router } from './router'
import { useAuth } from '@/hooks/auth'
import { QueryClient, QueryClientProvider } from 'react-query'
import { TooltipProvider } from './components/ui/tooltip'
import { useAppStore } from './store'

const queryClient = new QueryClient()

function App() {
  const {user} = useAppStore()
  useAuth()

  return <div>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <TooltipProvider>
          {user && <RouterProvider router={router}/>}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </div>
}

export default App
