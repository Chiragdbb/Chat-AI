import './dashboardLayout.css'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import ChatList from '../../components/chatList/ChatList'
import { useAuth0 } from '@auth0/auth0-react'

const DashboardLayout = () => {

    const { isAuthenticated, isLoading } = useAuth0()
    const navigate = useNavigate()
        
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/")
        }
    }, [isLoading, isAuthenticated, navigate])

    if (isLoading) return "Loading..."

    return (
        <div className='dashboardLayout'>
            <div className="menu"><ChatList /></div>
            <div className="content" id='content'><Outlet /></div>
        </div>
    )
}

export default DashboardLayout