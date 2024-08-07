import './chatList.css'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'

const ChatList = () => {
    const { getAccessTokenSilently } = useAuth0()

    const { isPending, error, data } = useQuery({
        queryKey: ['userChats'],
        queryFn: async () => {
            try {
                const token = await getAccessTokenSilently()
                
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/userchats`, {
                    credentials: "include",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': "application/json"
                    },
                })
                const data = await res.json()
                return data
            } catch (e) {
                console.log(e)
                throw new Error("Network response not ok")
            }
        }
    })

    const sortDataByTime = data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return (
        <div className='chatList'>
            <span className='title'>DASHBOARD</span>
            <Link to="/dashboard">Create a new Chat</Link>
            <Link to="/">Explore Chat AI</Link>
            <div className='hr'></div>
            <span className='title'>RECENT CHATS</span>
            <div className='list'>
                {isPending ? (
                    "Loading..."
                ) : error ? (
                    "Something went wrong!"
                ) : sortDataByTime && sortDataByTime.length > 0 ? (
                    sortDataByTime.map(chat => (
                        <Link to={`/dashboard/chat/${chat._id}`} key={chat._id}>{chat.title}</Link>
                    ))
                ) : (
                    null // Display nothing if there are no chats
                )}
            </div>
        </div>
    )
}

export default ChatList