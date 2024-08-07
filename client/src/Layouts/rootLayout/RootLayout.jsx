import { Link, Outlet } from 'react-router-dom'
import './rootLayout.css'
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react';

// access the client
const queryClient = new QueryClient()

const RootLayout = () => {
    const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
    
    return (
        <QueryClientProvider client={queryClient}>
            <div className='rootLayout'>
                <header>
                    <Link to={"/"} className='logo-container'>
                        <img className='logo' src="/logo-2.svg" alt="" />
                    </Link>
                    <div className="user">
                        {isLoading ? null : isAuthenticated ? (<div className='profile'>
                            <img src={user.picture} alt={user.name} />
                        </div>) : (<button onClick={() => {
                            // todo: change to dashboard later
                            loginWithRedirect(`${import.meta.env.VITE_DEV_URL}/sign-up}`)
                        }}> Sign In </button>)}
                        {/* // todo: create a modal to view profile details and logout btn */}
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
        </QueryClientProvider>
    )
}

export default RootLayout