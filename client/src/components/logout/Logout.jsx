import { useAuth0 } from '@auth0/auth0-react'
import './logout.css'

const Logout = () => {
    const {logout} = useAuth0()

    return (
        <div className='logout' id='logout'>
            <button onClick={() => logout({ logoutParams: { returnTo: `${import.meta.env.VITE_BASE_URL}` } })}>
                Log Out
            </button>
        </div>
    )
}

export default Logout