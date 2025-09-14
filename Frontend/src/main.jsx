import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TransactionProvider } from './context/AppContext'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TransactionProvider>
      <BrowserRouter>
      <ThemeProvider>
    <App />
    </ThemeProvider>
    </BrowserRouter>
    </TransactionProvider>
  </StrictMode>,
)
