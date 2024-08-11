import { useNavigate } from 'react-router-dom'
import './homePage.css'
import { TypeAnimation } from 'react-type-animation'
import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import toast from 'react-hot-toast'

const HomePage = () => {
    const [typingStatus, setTypingStatus] = useState("human1")
    const { isAuthenticated, isLoading } = useAuth0()
    const navigate = useNavigate()

    const clickHandler = () => {
        if (!isLoading) {
            if (!isAuthenticated) {
                toast.error("Not Signed In!")
            } else {
                navigate("/dashboard")
            }
        }
    }

    return (
        <div className='homePage'>
            <img src="/orbital.png" alt="" id='orbital' className='orbital' />
            <div className='left'>
                <div className='left left-2'>
                    <h1>CHAT AI</h1>
                    <h2>Supercharger your creativity and productivity</h2>
                    <h3>Elevate your communication with Chat AI, fueled by Gemini, the intelligent text model built to improve and simplify your conversations.</h3>
                </div>
                <div className="dash" onClick={clickHandler}>
                    Get Started
                </div>
            </div>
            <div className='right'>
                <div className='imgContainer'>
                    <div className='bgContainer' id='bgContainer'>
                        <div className='bg' id='bg'></div>
                    </div>
                    <img src="/bot.png" alt="" className='bot' />
                    <div className='chat' id='chat'>
                        <img src={typingStatus === "human1" ? "human1.jpeg" : typingStatus === "human2" ? "human2.jpeg" : "bot.png"} alt="" />
                        <TypeAnimation
                            sequence={[
                                () => setTypingStatus("human1"), 'Customer 1: What do you offer for Mice?', 2000,
                                () => setTypingStatus("bot"), 'Bot: We have premium food for Mice!', 2000,
                                () => setTypingStatus("human2"), 'Customer 2: What about Hamsters?', 2000,
                                () => setTypingStatus("bot"), 'Bot: We also provide nutritious food for Hamsters!', 2000,
                                () => setTypingStatus("human1"), 'Customer 3: Do you have something for Guinea Pigs?', 2000,
                                () => setTypingStatus("bot"), 'Bot: Absolutely! We offer healthy food for Guinea Pigs!', 2000,
                            ]}
                            wrapper="span"
                            repeat={Infinity}
                            cursor={true}
                            omitDeletionAnimation={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage