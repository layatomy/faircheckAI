import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('faircheck_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = useCallback((userData) => {
    const userInfo = {
      name: userData.name || 'Demo User',
      email: userData.email || 'demo@faircheck.ai',
      avatar: userData.picture || userData.avatar || null,
    }
    setUser(userInfo)
    localStorage.setItem('faircheck_user', JSON.stringify(userInfo))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('faircheck_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
