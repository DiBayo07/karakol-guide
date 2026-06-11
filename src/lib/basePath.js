/** Базовый путь деплоя (Vite BASE_URL), например /karakol-guide */
export const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || ''

/** Абсолютный URL-путь с учётом GitHub Pages */
export function withBase(path = '') {
  const base = import.meta.env.BASE_URL
  const clean = String(path).replace(/^\//, '')
  return `${base}${clean}`
}
