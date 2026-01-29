import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SessionProvider } from './context/SessionContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import { DemoProvider } from './context/DemoContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <DemoProvider>
          <App />
        </DemoProvider>
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>,
)
