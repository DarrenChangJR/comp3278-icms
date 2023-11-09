import { useEffect, useState } from 'react'

export const useAuth = () => {
  const accessToken = localStorage.getItem('access_token')
  const [loggedIn, setLoggedIn] = useState(!!accessToken)

  const login = (accessToken) => {
    localStorage.setItem('access_token', accessToken)
    setLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setLoggedIn(false)
  }

  return {
    loggedIn,
    login,
    logout,
  }
}
