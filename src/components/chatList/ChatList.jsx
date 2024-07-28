import { Link } from 'react-router-dom'
import './chatList.css'

const ChatList = () => {
    return (
        <div className='chatList'>
            <span className='title'>DASHBOARD</span>
            <Link to="/dashboard">Create a new Chat</Link>
            <Link to="/">Explore Chat AI</Link>
            <Link to="/">Contact</Link>
            <hr />
            <span className='title'>RECENT CHATS</span>
            <div className='list'>
                <Link to="/">My Chat Title</Link>
                <Link to="/">My Chat Title</Link>
                <Link to="/">Lorem ipsum dolor</Link>
                <Link to="/">Lorem ipsum dolor sit amet</Link>
                <Link to="/">My Chat Title</Link>
                <Link to="/">Lorem, ipsum</Link>
                <Link to="/">Lorem, ipsum dolor</Link>
                <Link to="/">Lorem, ipsum dolor</Link>
                <Link to="/">Lorem, ipsum dolor</Link>

            </div>
            {/* <hr />
            <div className='upgrade'>
                <img src="/logo.png" alt="" />
                <div className='texts'>
                    <span>Upgrade to Chat AI Pro</span>
                    <span>Get unlimited access to all features</span>
                </div>
            </div> */}
        </div>
    )
}

export default ChatList