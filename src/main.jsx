import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Community from './Components/Community'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Community/>
  </StrictMode>,
)
