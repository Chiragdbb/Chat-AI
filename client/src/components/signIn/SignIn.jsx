import { useAuth0 } from '@auth0/auth0-react'
import './signIn.css'

const SignIn = () => {
    const { loginWithRedirect } = useAuth0()

    return (
        <div className='signIn' id='signIn'>
            <button onClick={() => {
                loginWithRedirect({
                    redirect_uri: `${import.meta.env.VITE_BASE_URL}/dashboard`
                })
            }
            }> Sign In </button>
        </div>
    )
}

export default SignIn