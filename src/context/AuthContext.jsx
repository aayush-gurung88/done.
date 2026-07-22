import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'

const AuthContext = createContext(null)
const STORAGE_KEY = 'dev_log_auth_user'
const API_URL = 'http://127.0.0.1:8000'

function getSavedUser() {
  const serialized = localStorage.getItem(STORAGE_KEY)
  if (!serialized) return null
  try {
    return JSON.parse(serialized)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSavedUser())

  const persistUser = nextUser => {
    setUser(nextUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
  }

  const signIn = async ({ email, password }) => {
    try {
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)

      const res = await fetch(`${API_URL}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      })

      if (!res.ok) return { success: false, message: 'Invalid email or password.' }

      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      persistUser({ email })
      return { success: true }
    } catch {
      return { success: false, message: 'Server error. Try again.' }
    }
  }

  const signUp = async ({ fullName, email, password }) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password })
      })

      if (!res.ok) return { success: false, message: 'Email already exists.' }

      return { success: true }
    } catch {
      return { success: false, message: 'Server error. Try again.' }
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signOut,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}

export function RequireAuth({ children }) {
  const auth = useAuth()
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}
