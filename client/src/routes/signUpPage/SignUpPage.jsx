import './signUpPage.css'
import { useAuth0 } from "@auth0/auth0-react";

const SignUpPage = () => {
  const { logout, isAuthenticated, user, isLoading } = useAuth0();

  return (
    <div className='signUpPage'>
      {isLoading
        ? "Loading..."
        : isAuthenticated
          ? (
            <button onClick={() => logout({ logoutParams: { returnTo: `${import.meta.env.VITE_BASE_URL}/sign-in` } })}>
              {/* // todo: change to homepage later */}
              Log Out
            </button>
          )
          : "Not Authenticated, Redirect to Sign-In"
      }
    </div>
  )
}

export default SignUpPage
