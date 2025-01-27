import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Contexts/AuthContext.jsx';
import { SetSelectedProvider } from './Contexts/SetSelectedContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <AuthProvider>
          <SetSelectedProvider>
            <App />
          </SetSelectedProvider>
        </AuthProvider>
    </BrowserRouter> 
  </StrictMode>,
)
