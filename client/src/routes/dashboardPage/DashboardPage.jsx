import { useState } from 'react'
import './dashboardPage.css'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'

const DashboardPage = () => {
    // use created Query client
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [newQuestion, setNewQuestion] = useState("")
    const { getAccessTokenSilently } = useAuth0()

    // TODO: CHECK THIS OUT
    const mutation = useMutation({
        mutationFn: async (text) => {
            const token = await getAccessTokenSilently()

            return await fetch(`${import.meta.env.VITE_SERVER_URL}/api/chats`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ text })
            }).then(res => res.json())
        },
        onSuccess: (id) => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['userChats'] })
            navigate(`/dashboard/chat/${id}`)
        },
    })

    const submitHandler = async (e) => {
        e.preventDefault()

        const text = e.target.text.value
        if (!text) return

        mutation.mutate(text)
        setNewQuestion("")
    }

    const changeHandler = (e) => {
        setNewQuestion(e.target.value)
    }

    return (
        <div className='dashboardPage' id='dashboardPage'>
            <div className='texts'>
                <div className='logo'>
                    <img src="/logo-2.svg" alt="" />
                    <h2 id='dash-title'>CHAT AI</h2>
                </div>
                <div className='options'>
                    <div className="option">
                        <img src="/chat.png" alt="" />
                        <span>Create a New Chat</span>
                    </div>
                    <div className="option">
                        <img src="/image.png" alt="" />
                        <span>Analyze Image</span>
                    </div>
                    <div className="option">
                        <img src="/code.png" alt="" />
                        <span>Help me with my Code</span>
                    </div>
                </div>
            </div>
            <div className='formContainer'>
                <form onSubmit={submitHandler}>
                    <input
                        type="text"
                        name='text'
                        placeholder='Ask me anything...' autoComplete='off'
                        onChange={changeHandler}
                        value={newQuestion}
                        spellCheck={false}
                    />
                    <button>
                        <img src="/arrow.png" alt="" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default DashboardPage