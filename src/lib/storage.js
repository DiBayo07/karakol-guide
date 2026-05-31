const KEYS = {
  routes: 'karakol_routes',
  messages: 'karakol_messages',
  admin: 'karakol_admin_logged_in',
  itineraries: 'karakol_saved_itineraries',
}

export function getStoredRoutes(defaultRoutes) {
  try {
    const raw = localStorage.getItem(KEYS.routes)
    if (!raw) return defaultRoutes
    const stored = JSON.parse(raw)
    if (Array.isArray(stored) && stored.length > 0) return stored
    return defaultRoutes
  } catch {
    return defaultRoutes
  }
}

export function saveRoutes(routes) {
  localStorage.setItem(KEYS.routes, JSON.stringify(routes))
}

export function getMessages() {
  try {
    const raw = localStorage.getItem(KEYS.messages)
    if (raw) return JSON.parse(raw)
    const legacy = localStorage.getItem('contact_messages')
    if (legacy) {
      const parsed = JSON.parse(legacy)
      localStorage.setItem(KEYS.messages, legacy)
      return parsed
    }
    return []
  } catch {
    return []
  }
}

export function addMessage(msg) {
  const list = getMessages()
  list.unshift({
    ...msg,
    id: Date.now(),
    date: new Date().toISOString(),
    status: 'new',
  })
  localStorage.setItem(KEYS.messages, JSON.stringify(list))
  return list
}

export function isAdminLoggedIn() {
  return sessionStorage.getItem(KEYS.admin) === 'true'
}

export function setAdminLoggedIn(value) {
  if (value) sessionStorage.setItem(KEYS.admin, 'true')
  else sessionStorage.removeItem(KEYS.admin)
}

export function saveItinerary(plan) {
  const list = JSON.parse(localStorage.getItem(KEYS.itineraries) || '[]')
  list.unshift({ ...plan, savedAt: new Date().toISOString() })
  localStorage.setItem(KEYS.itineraries, JSON.stringify(list.slice(0, 10)))
}
