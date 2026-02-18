import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../shared/styles/index.css'
import App from './App.tsx'
import { SessionProvider } from '../features/session/context/SessionContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { DemoProvider } from '../features/demo/context/DemoContext.tsx'
import { AuthProvider } from '../features/auth/context/AuthContext.tsx'
import { UserProvider } from '../domains/user/context/UserContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <SessionProvider>
              <DemoProvider>
                <App />
              </DemoProvider>
          </SessionProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
