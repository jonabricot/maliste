import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './auth.tsx'
import { queryClient } from './api/query.ts'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from './components/ui/tooltip.tsx'
import { AppRouterProvider } from './router.tsx'
import { QueryClientProvider } from '@tanstack/react-query'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <TooltipProvider>
            <AppRouterProvider/>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)
