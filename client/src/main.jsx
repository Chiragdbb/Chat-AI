import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import HomePage from "./routes/homePage/HomePage"
import DashboardPage from './routes/dashboardPage/DashboardPage'
import ChatPage from './routes/chatPage/ChatPage'
import RootLayout from './Layouts/rootLayout/RootLayout'
import DashboardLayout from './Layouts/dashboardLayout/DashboardLayout'
import SignInPage from './routes/signInPage/SignInPage'
import SignUpPage from './routes/signUpPage/SignUpPage'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route path='' element={<HomePage />} />
      <Route path='dashboard' element={<DashboardLayout />} >
        <Route path='' element={<DashboardPage />} />
        <Route path='chat/:id' element={<ChatPage />} />
      </Route>
      <Route path='sign-in/*' element={<SignInPage />} />
      <Route path='sign-up/*' element={<SignUpPage />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
