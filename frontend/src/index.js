import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/login'
import NotFound from './pages/notfound'
import { createTheme, ThemeProvider } from '@mui/material'
import { AuthProvider } from './auth/useAuth';

const theme = createTheme()

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // errorElement: <NotFound />,
  },
  {
    path: '/login',
    element: <Login />,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
