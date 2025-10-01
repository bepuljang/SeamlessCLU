import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CANProvider } from './context/CANProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CANProvider>
      <App />
    </CANProvider>
  </StrictMode>,
)
