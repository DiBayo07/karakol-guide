import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { DEFAULT_ROUTES } from '../data/content'
import {
  getStoredRoutes,
  saveRoutes,
  getMessages,
  addMessage,
  isAdminLoggedIn,
  setAdminLoggedIn,
} from '../lib/storage'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [routes, setRoutes] = useState(() => getStoredRoutes(DEFAULT_ROUTES))
  const [messages, setMessages] = useState(() => getMessages())
  const [admin, setAdmin] = useState(isAdminLoggedIn)

  const refreshRoutes = useCallback(() => {
    setRoutes(getStoredRoutes(DEFAULT_ROUTES))
  }, [])

  const updateRoutes = useCallback((next) => {
    saveRoutes(next)
    setRoutes(getStoredRoutes(DEFAULT_ROUTES))
  }, [])

  const submitMessage = useCallback((msg) => {
    const list = addMessage(msg)
    setMessages(list)
    return list
  }, [])

  const loginAdmin = useCallback((ok) => {
    setAdminLoggedIn(ok)
    setAdmin(ok)
  }, [])

  const logoutAdmin = useCallback(() => {
    setAdminLoggedIn(false)
    setAdmin(false)
  }, [])

  const value = useMemo(
    () => ({
      routes,
      messages,
      admin,
      refreshRoutes,
      updateRoutes,
      submitMessage,
      loginAdmin,
      logoutAdmin,
    }),
    [routes, messages, admin, refreshRoutes, updateRoutes, submitMessage, loginAdmin, logoutAdmin],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
