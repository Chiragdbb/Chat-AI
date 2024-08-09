import './chatList.css'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import remove from '/remove.svg'
import toast from 'react-hot-toast'

const ChatList = () => {
    const { getAccessTokenSilently } = useAuth0()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

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
                throw new Error("Network response not ok", e)
            }
        }
    })

    const mutation = useMutation({
        mutationFn: async (chatId) => {
            try {
                const token = await getAccessTokenSilently()

                await fetch(`${import.meta.env.VITE_SERVER_URL}/api/chat/${chatId}`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
            } catch (e) {
                console.log(e)
                throw new Error("Error white deleting chat :", chatId)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userChats'] })
            navigate("/dashboard")
            toast.success("Chat deleted succesfully!")
        }
    })

    const sortDataByTime = data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return (
        <div className='chatList' id='chatList'>
            <span className='title'>DASHBOARD</span>
            <Link to="/dashboard">Create a new Chat</Link>
            <Link to="/">Explore Chat AI</Link>
            <div className='hr'></div>
            <span className='title'>RECENT CHATS</span>
            <div className='list'>
                {isPending ? (
                    <div className='loading'>Loading...</div>
                ) : error ? (
                    <div className='loading'>Something went wrong!</div>
                ) : sortDataByTime && sortDataByTime.length > 0 ? (
                    sortDataByTime.map(chat => (
                        <div
                            key={chat._id}
                            className='chat'
                        >
                            <Link to={`/dashboard/chat/${chat._id}`} className='chat-title'>
                                {chat.title}
                            </Link>
                            <div className="remove-container">
                                <div className='remove-btn' onClick={() => mutation.mutate(chat._id)}>
                                    <img src={remove} alt="" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    null // Display nothing if there are no chats
                )}
            </div>
        </div>
    )
}

export default ChatList