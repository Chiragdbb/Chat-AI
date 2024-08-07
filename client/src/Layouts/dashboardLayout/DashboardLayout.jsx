import './dashboardLayout.css'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import ChatList from '../../components/chatList/ChatList'
import { useAuth0 } from '@auth0/auth0-react'

const DashboardLayout = () => {

    const { isAuthenticated, user, isLoading } = useAuth0()
    const navigate = useNavigate()

    // if (!isLoading && isAuthenticated) console.log(user.sub)
        
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/sign-in")
        }
    }, [isLoading, isAuthenticated, navigate])

    if (isLoading) return "Loading..."

    return (
        <div className='dashboardLayout'>
            <div className="menu"><ChatList /></div>
            <div className="content"><Outlet /></div>
        </div>
    )
}

export default DashboardLayout