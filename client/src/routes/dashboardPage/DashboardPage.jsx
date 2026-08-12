import { useState } from 'react'
import './dashboardPage.css'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import toast from 'react-hot-toast'

const SUGGESTIONS = [
    {
        id: 'chat',
        icon: '/chat.png',
        label: 'Create a New Chat',
        prompt: 'Help me brainstorm ideas for a new project.',
    },
    {
        id: 'image',
        icon: '/image.png',
        label: 'Analyze Image',
        prompt: 'I will upload an image next. Explain what you see and highlight the important details.',
    },
    {
        id: 'code',
        icon: '/code.png',
        label: 'Help me with Code',
        prompt: 'Help me write and debug code. Ask what language and problem I am working on.',
    },
]

const DashboardPage = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [newQuestion, setNewQuestion] = useState("")
    const { getAccessTokenSilently } = useAuth0()

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
            }).then(async (res) => {
                if (!res.ok) {
                    throw new Error(await res.text() || 'Failed to create chat')
                }
                return res.json()
            })
        },
        onSuccess: (id) => {
            queryClient.invalidateQueries({ queryKey: ['userChats'] })
            navigate(`/dashboard/chat/${id}`)
        },
        onError: () => {
            toast.error('Could not start chat. Try again in a moment.')
        },
    })

    const startChat = (text) => {
        const trimmed = text?.trim()
        if (!trimmed || mutation.isPending) return
        mutation.mutate(trimmed)
        setNewQuestion("")
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        startChat(e.target.text.value)
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
                    {SUGGESTIONS.map((suggestion) => (
                        <button
                            key={suggestion.id}
                            type="button"
                            className="option"
                            disabled={mutation.isPending}
                            onClick={() => startChat(suggestion.prompt)}
                        >
                            <img src={suggestion.icon} alt="" />
                            <span>{suggestion.label}</span>
                        </button>
                    ))}
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
                        disabled={mutation.isPending}
                    />
                    <button type="submit" disabled={mutation.isPending}>
                        <img src="/arrow.png" alt="" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default DashboardPage
