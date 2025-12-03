import { ThemeProvider } from 'next-themes'
import { RouterProvider } from 'react-router'
import { router } from './router'
import { useAuth } from '@/hooks/auth'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

function App() {
  useAuth()

  return <div>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <RouterProvider router={router}/>
      </ThemeProvider>
    </QueryClientProvider>
  </div>
}

export default App
