import { useAuth0 } from '@auth0/auth0-react'
import './signIn.css'

const SignIn = () => {
    const { loginWithRedirect } = useAuth0()

    return (
        <div className='signIn' id='signIn'>
            <button onClick={() => {
                loginWithRedirect({
                    appState: { returnTo: '/dashboard' },
                })
            }
            }> Sign In </button>
        </div>
    )
}

export default SignIn