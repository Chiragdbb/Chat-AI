import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import HomePage from "./routes/homePage/HomePage"
import DashboardPage from './routes/dashboardPage/DashboardPage'
import ChatPage from './routes/chatPage/ChatPage'
import RootLayout from './Layouts/rootLayout/RootLayout'
import DashboardLayout from './Layouts/dashboardLayout/DashboardLayout'
import { Auth0Provider } from '@auth0/auth0-react'
import { Toaster } from 'react-hot-toast'

// auth0 credentials
const AUTH_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN
const AUTH_CLIENT = import.meta.env.VITE_AUTH0_CLIENT_ID
const AUTH_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE

// routing
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route path='' element={<HomePage />} />
      <Route path='dashboard' element={<DashboardLayout />} >
        <Route path='' element={<DashboardPage />} />
        <Route path='chat/:id' element={<ChatPage />} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={AUTH_DOMAIN}
    clientId={AUTH_CLIENT}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: AUTH_AUDIENCE
    }}
    useRefreshTokens={true}
    useRefreshTokensFallback={true}
    cacheLocation='localstorage'
  >
    <RouterProvider router={router} />
    <Toaster
      toastOptions={{
        className: 'toaster',
      }} />
  </Auth0Provider>

)