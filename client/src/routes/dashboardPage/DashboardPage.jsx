import { useState } from 'react'
import './dashboardPage.css'
import { useAuth } from '@clerk/clerk-react'

const DashboardPage = () => {
    const { userId } = useAuth()

    const [newQuestion, setNewQuestion] = useState("")

    const submitHandler = async (e) => {
        e.preventDefault()

        const text = e.target.text.value
        if (!text) return

        await fetch(`${import.meta.env.VITE_LOCALHOST}/api/chats`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({ userId, text })
        })

        setNewQuestion("")
    }

    const changeHandler = (e)=>{
        setNewQuestion(e.target.value)
    }

    return (
        <div className='dashboardPage'>
            <div className='texts'>
                <div className='logo'>
                    <img src="/logo.png" alt="" />
                    <h1>CHAT AI</h1>
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