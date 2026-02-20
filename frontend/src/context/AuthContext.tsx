import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User, AuthResponse } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: AuthResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch { localStorage.clear() }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((data: AuthResponse) => {
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }, [])

  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
    window.location.href = '/'
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
