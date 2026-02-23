import { createContext, useState, useEffect } from 'react'
import { getCurrentUser } from '../api/auth'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      getCurrentUser(token)
        .then((res) => {
          setUser(res.data.user)
        })
        .catch(() => {
          logout()
        })
    }
  }, [token])

  const login = (userData) => {
    localStorage.setItem('token', userData.token)
    setToken(userData.token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}