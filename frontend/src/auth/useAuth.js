import React, { createContext, useState, useContext } from 'react'

// Create a context
const AuthContext = createContext()

// Create a provider component
export const AuthProvider = ({ children }) => {
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

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Create a hook that uses the context
export const useAuth = () => {
  return useContext(AuthContext)
}
