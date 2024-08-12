import './dashboardLayout.css'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import ChatList from '../../components/chatList/ChatList'
import { useAuth0 } from '@auth0/auth0-react'
import sidebar from '/sidebar.svg'

const DashboardLayout = () => {

    const { isAuthenticated, isLoading } = useAuth0()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/")
        }
    }, [isLoading, isAuthenticated, navigate])

    if (isLoading) return "Loading..."


    const clickHandler = () => {
        const dashboardLayout = document.querySelector(".dashboardLayout")
        const sidebarLogo = document.querySelector(".close-sidebar")

        sidebarLogo.classList.toggle("rotate")
        dashboardLayout.classList.toggle("closed")
    }

    const contentHandler = () => {
        const dashboardLayout = document.querySelector(".dashboardLayout")
        if (document.documentElement.clientWidth <= 500 && !dashboardLayout.classList.contains("closed")) {
            clickHandler()
        }
    }

    return (
        <>
            <div
                className='close-sidebar'
                onClick={clickHandler}>
                <img src={sidebar} alt="sidebar" />
            </div>
            <div className='dashboardLayout'>
                <aside className="menu"><ChatList /></aside>
                <div className="content" id='content' onClick={contentHandler}><Outlet /></div>
            </div>
        </>
    )
}

export default DashboardLayout