import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { DEFAULT_ROUTES, SIGHTS, FOOD_PLACES } from '../data/content'
import {
  getStoredRoutes,
  saveRoutes,
  getStoredSights,
  saveSights,
  getStoredFood,
  saveFood,
  getMessages,
  addMessage,
  isAdminLoggedIn,
  setAdminLoggedIn,
} from '../lib/storage'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [routes, setRoutes] = useState(() => getStoredRoutes(DEFAULT_ROUTES))
  const [sights, setSights] = useState(() => getStoredSights(SIGHTS))
  const [foodPlaces, setFoodPlaces] = useState(() => getStoredFood(FOOD_PLACES))
  const [messages, setMessages] = useState(() => getMessages())
  const [admin, setAdmin] = useState(isAdminLoggedIn)

  const refreshRoutes = useCallback(() => {
    setRoutes(getStoredRoutes(DEFAULT_ROUTES))
  }, [])

  const updateRoutes = useCallback((next) => {
    saveRoutes(next)
    setRoutes(getStoredRoutes(DEFAULT_ROUTES))
  }, [])

  const updateSights = useCallback((next) => {
    saveSights(next)
    setSights(getStoredSights(SIGHTS))
  }, [])

  const updateFoodPlaces = useCallback((next) => {
    saveFood(next)
    setFoodPlaces(getStoredFood(FOOD_PLACES))
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
      sights,
      foodPlaces,
      messages,
      admin,
      refreshRoutes,
      updateRoutes,
      updateSights,
      updateFoodPlaces,
      submitMessage,
      loginAdmin,
      logoutAdmin,
    }),
    [
      routes,
      sights,
      foodPlaces,
      messages,
      admin,
      refreshRoutes,
      updateRoutes,
      updateSights,
      updateFoodPlaces,
      submitMessage,
      loginAdmin,
      logoutAdmin,
    ],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
