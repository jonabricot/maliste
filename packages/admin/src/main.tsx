import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { DirectionProvider } from './context/direction-provider'
import { FontProvider } from './context/font-provider'
import { ThemeProvider } from './context/theme-provider'
// Styles
import './styles/index.css'
import { router } from './router'
import { queryClient } from './api/query'
import { AuthProvider, useAuth } from './auth'

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <FontProvider>
              <DirectionProvider>
                <Bootstrap/>
              </DirectionProvider>
            </FontProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}

function Bootstrap() {
  const auth = useAuth()

  return <RouterProvider router={router} context={{auth}}/>
}
