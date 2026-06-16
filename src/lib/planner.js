import { getPlannerTips } from '../i18n'

const CENTER = { lat: 42.4907, lng: 78.393 }

function distanceKm(a, b) {
  const dx = (a.lat - b.lat) * 111
  const dy = (a.lng - b.lng) * 85
  return Math.sqrt(dx * dx + dy * dy)
}

function zoneOrder(zone) {
  if (zone === 'city') return 0
  if (zone === 'near') return 1
  return 2
}

/** Сортировка точек: ближе к центру, логичный порядок зон, еда в обед */
function sortDayStops(stops) {
  return [...stops].sort((a, b) => {
    const za = zoneOrder(a.zone)
    const zb = zoneOrder(b.zone)
    if (za !== zb) return za - zb
    if (a.poiType === 'food' && b.poiType !== 'food') return 1
    if (b.poiType === 'food' && a.poiType !== 'food') return -1
    return distanceKm(CENTER, a) - distanceKm(CENTER, b)
  })
}

/**
 * Построение маршрута туриста по дням
 * @param {Object} params
 * @param {number} params.days
 * @param {string[]} params.interests
 * @param {string[]} params.selectedIds — выбранные POI id
 * @param {Array} params.allPois
 */
export function buildItinerary({ selectedIds = [], allPois = [], startLocation = null, lang = 'ru' }) {
  const selected = allPois.filter((p) => selectedIds.includes(p.id))
  if (selected.length === 0 && !startLocation) {
    return {
      days: [],
      totalStops: 0,
      tips: [],
    }
  }

  // Nearest-neighbor sort starting from either user location or Karakol center
  const sortedStops = []
  let current = startLocation || CENTER
  const unvisited = [...selected]

  while (unvisited.length > 0) {
    let closestIdx = 0
    let minD = distanceKm(current, unvisited[0])
    for (let i = 1; i < unvisited.length; i++) {
      const d = distanceKm(current, unvisited[i])
      if (d < minD) {
        minD = d
        closestIdx = i
      }
    }
    current = unvisited[closestIdx]
    sortedStops.push(unvisited.splice(closestIdx, 1)[0])
  }

  // Prepend user geolocation stop if available
  const stops = startLocation ? [startLocation, ...sortedStops] : sortedStops

  // Generate timeline starting at 09:00 (540 mins)
  let time = 9 * 60
  const timeline = stops.map((stop, i) => {
    const start = time
    const isUser = stop.poiType === 'user'
    const dur = isUser ? 0 : (stop.durationMin || 60)
    time += dur
    const end = time
    if (!isUser) {
      time += 30 // 30-min transit/break
    }
    return {
      ...stop,
      order: i + 1,
      startTime: formatTime(start),
      endTime: formatTime(end),
    }
  })

  // Calculate total sequential distance
  let totalDist = 0
  for (let i = 1; i < timeline.length; i++) {
    totalDist += distanceKm(timeline[i - 1], timeline[i])
  }

  const resultDay = {
    day: 1,
    stops: timeline,
    totalMin: timeline.reduce((sum, s) => sum + (s.poiType === 'user' ? 0 : (s.durationMin || 60)), 0),
    distanceKm: Math.round(totalDist * 10) / 10,
  }

  const tips = [
    lang === 'en'
      ? 'Start your day in the city center — easier to navigate.'
      : 'Начните день с центра города — так проще ориентироваться.',
    lang === 'en'
      ? 'Lunch at the market or Ashlyanfu café is a Karakol must.'
      : 'Обед на рынке или в кафе «Ашлянфу» — must-have в Караколе.',
    lang === 'en'
      ? 'Save your plan and show it to a guide or taxi driver.'
      : 'Сохраните маршрут и покажите гиду или водителю такси.',
  ]

  return {
    days: [resultDay],
    totalStops: timeline.length,
    tips,
  }
}

function formatTime(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function suggestReadyRoutes() {
  return []
}
