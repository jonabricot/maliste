import { ThemeProvider } from 'next-themes'
import { RouterProvider } from 'react-router'
import { router } from './router'
import { TooltipProvider } from './components/ui/tooltip'
import { AuthProvider } from './auth'

function App() {
  return <ThemeProvider 
    attribute="class"
    defaultTheme="system"
    enableSystem
  >
    <TooltipProvider>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </TooltipProvider>
  </ThemeProvider>
}

export default App
