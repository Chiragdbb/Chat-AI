import { Link } from 'react-router-dom'
import './chatList.css'
import { useEffect, useState } from 'react'

const ChatList = () => {
    const [data, setData] = useState([])

    useEffect(async () => {
        const res = await fetch(`${import.meta.env.VITE_LOCALHOST}/api/userchats`, {
            credentials: "include"
        })
        setData(res)
    }, [])

    return (
        <div className='chatList'>
            <span className='title'>DASHBOARD</span>
            <Link to="/dashboard">Create a new Chat</Link>
            <Link to="/">Explore Chat AI</Link>
            <div className='hr'></div>
            <span className='title'>RECENT CHATS</span>
            <div className='list'>
                <Link to="/">My Chat Title</Link>
                {data && (<div>
                    {data.map(title => (
                        <Link to="/" key={title._id}>{title}</Link>
                    ))}
                </div>)
                }
            </div>
        </div>
    )
}

export default ChatList