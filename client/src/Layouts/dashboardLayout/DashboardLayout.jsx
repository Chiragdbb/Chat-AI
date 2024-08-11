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

    return (
        <>
            <div
                className='close-sidebar'
                onClick={clickHandler}>
                <img src={sidebar} alt="" />
            </div>
            <div className='dashboardLayout'>
                <div className="menu"><ChatList /></div>
                <div className="content" id='content'><Outlet /></div>
            </div>
        </>
    )
}

export default DashboardLayout