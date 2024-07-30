import { Link } from 'react-router-dom'
import './homePage.css'
import { TypeAnimation } from 'react-type-animation'
import { useState } from 'react'

const HomePage = () => {
    const [typingStatus, setTypingStatus] = useState("human1")

    return (
        <div className='homePage'>
            <img src="/orbital.png" alt="" className='orbital' />
            <div className='left'>
                <h1>CHAT AI</h1>
                <h2>Supercharger your creativity and productivity</h2>
                <h3>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas vero, necessitatibus.</h3>
                <Link to={"dashboard"}>Get Started</Link>
            </div>
            <div className='right'>
                <div className='imgContainer'>
                    <div className='bgContainer'>
                        <div className='bg'></div>
                    </div>
                    <img src="/bot.png" alt="" className='bot' />
                    <div className='chat'>
                        <img src={typingStatus === "human1" ? "human1.jpeg" : typingStatus === "human2" ? "human2.jpeg" : "bot.png"} alt="" />
                        <TypeAnimation
                            sequence={[
                                'Human 1: We produce food for Mice',
                                2000, () => setTypingStatus("human1"),
                                'Bot: We produce food for Hamsters',
                                2000, () => setTypingStatus("bot"),
                                'Human 2: We produce food for Guinea Pigs',
                                2000, () => setTypingStatus("human2"),
                                'Bot: We produce food for Chinchillas',
                                2000, () => setTypingStatus("bot"),
                            ]}
                            wrapper="span"
                            repeat={Infinity}
                            cursor={true}
                            omitDeletionAnimation={true}
                        />
                    </div>
                </div>
            </div>
            <div className='terms'>
                <img src="/logo.png" alt="" />
                <div className='links'>
                    <Link to="/">Terms of Service</Link>
                    <Link to="/">Privacy Policy</Link>
                </div>
            </div>
        </div>
    )
}

export default HomePage