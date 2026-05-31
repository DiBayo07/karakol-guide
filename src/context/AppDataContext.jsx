import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
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
  
  // НОВЫЙ КОД: состояние для достопримечательностей
  const [sights, setSights] = useState(() => {
    const saved = localStorage.getItem('karakol_sights')
    return saved ? JSON.parse(saved) : []
  })

  // НОВЫЙ КОД: сохраняем sights в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('karakol_sights', JSON.stringify(sights))
  }, [sights])

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

  // НОВЫЙ КОД: функции для работы с достопримечательностями
  const addSight = useCallback((sight) => {
    setSights(prev => [...prev, { ...sight, id: Date.now() }])
  }, [])

  const updateSight = useCallback((id, updatedSight) => {
    setSights(prev => prev.map(s => s.id === id ? { ...updatedSight, id } : s))
  }, [])

  const deleteSight = useCallback((id) => {
    setSights(prev => prev.filter(s => s.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      routes,
      messages,
      admin,
      sights,           // ← добавили
      refreshRoutes,
      updateRoutes,
      submitMessage,
      loginAdmin,
      logoutAdmin,
      addSight,         // ← добавили
      updateSight,      // ← добавили
      deleteSight,      // ← добавили
    }),
    [routes, messages, admin, sights, refreshRoutes, updateRoutes, submitMessage, loginAdmin, logoutAdmin, addSight, updateSight, deleteSight],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}