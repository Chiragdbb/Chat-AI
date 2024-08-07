import React from "react";
import './signInPage.css'
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const { isAuthenticated, user, loginWithRedirect, isLoading } = useAuth0();
  const navigate = useNavigate()

  if (!isLoading) {
    isAuthenticated ? navigate("/dashboard") : null;
  }

  return (
    <div className='signInPage'>
      {isLoading
        ? "Loading..."
        : isAuthenticated
          ? "Already Authenticated, redirect to dashboard"
          : (
            <button onClick={() => {
              // todo: change to dashboard later
              loginWithRedirect(`${import.meta.env.VITE_DEV_URL}/sign-up}`)
            }}> Sign In </button>
          )}
    </div>
  )
}

export default SignInPage