import './rootLayout.css'
import moon from '/moon.svg'
import sun from '/sun.svg'
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react';
import Logout from '../../components/logout/Logout';
import SignIn from '../../components/signIn/SignIn';

// access the client
const queryClient = new QueryClient()
const RootLayout = () => {
    const { user, isAuthenticated, isLoading } = useAuth0()
    const [darkTheme, setDarkTheme] = useState(true)

    useEffect(() => {
        const localTheme = localStorage.getItem("darkTheme") === "true"
        setDarkTheme(localTheme)

        localTheme
            ? document.body.classList.add("dark")
            : document.body.classList.remove("dark")
    }, [])

    const themeSwitcher = () => {
        setDarkTheme(prev => {
            const newTheme = !prev
            document.body.classList.toggle("dark")

            newTheme
                ? toast('Hello Darkness!', {
                    icon: '🌙',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                }) : toast('Hello Sunshine!', {
                    icon: '🌞',
                    style: {
                        borderRadius: '10px',
                        background: '#fff',
                        color: '#333',
                    }
                })

            localStorage.setItem("darkTheme", newTheme.toString())
            return newTheme
        }
        )
    }

    return (
        <QueryClientProvider client={queryClient}>
            <div className='rootLayout'>
                <header>
                    <Link to={"/"} className='logo-container'>
                        <img id='logo' className='logo' src="/logo-2.svg" alt="" />
                    </Link>
                    <div className="user">
                        <div className='theme' id='theme' onClick={themeSwitcher}>
                            {darkTheme
                                ? <img src={sun} alt="theme" />
                                : <img src={moon} alt="theme" />
                            }
                        </div>
                        {isAuthenticated && (<div className='profile'>
                            <img src={user.picture} alt={user.name} />
                        </div>)}
                        {!isLoading && (
                            isAuthenticated ? <Logout /> : <SignIn />
                        )}
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