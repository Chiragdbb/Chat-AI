import { useState } from 'react'
import './dashboardPage.css'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const DashboardPage = () => {
    // use created Query client
    const queryClient = useQueryClient()

    const navigate = useNavigate()
    const [newQuestion, setNewQuestion] = useState("")

    // TODO: CHECK THIS OUT
    const mutation = useMutation({
        mutationFn: async (text) => {
            return await fetch(`${import.meta.env.VITE_SERVER_URL}/api/chats`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': "application/json",
                    // for testing
                    'Cookie': ''
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
        <div className='dashboardPage'>
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