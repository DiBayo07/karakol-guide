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
export function buildItinerary({ days, interests, selectedIds, allPois }) {
  const interestSet = new Set(interests)
  let pool = allPois.filter((p) => p.interests?.some((i) => interestSet.has(i)))

  if (selectedIds.length > 0) {
    const selected = allPois.filter((p) => selectedIds.includes(p.id))
    const rest = pool.filter((p) => !selectedIds.includes(p.id))
    pool = [...selected, ...rest]
  }

  const maxPerDay = days === 1 ? 5 : days === 2 ? 4 : 3
  const maxTotal = maxPerDay * days
  pool = pool.slice(0, maxTotal)

  const byZone = { city: [], near: [], mountain: [] }
  pool.forEach((p) => {
    const z = p.zone || 'city'
    if (byZone[z]) byZone[z].push(p)
    else byZone.city.push(p)
  })

  const dayPlans = []
  let dayIndex = 0

  const distribute = (items, preferDay) => {
    while (items.length && dayIndex < days) {
      const day = dayPlans[dayIndex] || (dayPlans[dayIndex] = { day: dayIndex + 1, stops: [], totalMin: 0 })
      if (day.stops.length >= maxPerDay) {
        dayIndex++
        continue
      }
      const next = items.shift()
      if (preferDay !== undefined && dayIndex < preferDay) {
        dayIndex = preferDay
        continue
      }
      day.stops.push(next)
      day.totalMin += next.durationMin || 60
      if (day.stops.length >= maxPerDay) dayIndex++
    }
    items.length && distribute(items)
  }

  distribute([...byZone.city])
  if (days >= 2) distribute([...byZone.near], 1)
  if (days >= 3) distribute([...byZone.mountain], 2)
  else distribute([...byZone.near, ...byZone.mountain])

  const result = dayPlans
    .filter(Boolean)
    .map((d) => {
      const ordered = sortDayStops(d.stops)
      let time = 9 * 60
      const timeline = ordered.map((stop, i) => {
        const start = time
        const dur = stop.durationMin || 60
        time += dur + 30
        return {
          ...stop,
          order: i + 1,
          startTime: formatTime(start),
          endTime: formatTime(time - 30),
        }
      })
      const dist = timeline.reduce((sum, s, i) => {
        if (i === 0) return sum
        return sum + distanceKm(timeline[i - 1], s)
      }, 0)
      return {
        day: d.day,
        stops: timeline,
        totalMin: d.totalMin,
        distanceKm: Math.round(dist * 10) / 10,
      }
    })

  return {
    days: result,
    totalStops: result.reduce((n, d) => n + d.stops.length, 0),
    tips: getTips(days, interests),
  }
}

function formatTime(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function getTips(days, interests) {
  const tips = ['Начните день с центра города — так проще ориентироваться.']
  if (interests.includes('nature') && days >= 2) {
    tips.push('Горные точки лучше планировать на 2–3-й день после акклиматизации.')
  }
  if (interests.includes('food')) {
    tips.push('Обед на рынке или в кафе «Ашлянфу» — must-have в Караколе.')
  }
  tips.push('Сохраните маршрут и покажите гиду или водителю такси.')
  return tips
}

export function suggestReadyRoutes(routes, interests, days) {
  const interestSet = new Set(interests)
  return routes
    .filter((r) => {
      const d = parseInt(r.duration, 10) || 1
      if (days === 1 && d > 1) return false
      if (days === 2 && d > 3) return false
      if (r.type === 'cultural' && interestSet.has('food')) return true
      if (r.type === 'hiking' && interestSet.has('nature')) return true
      if (r.type === 'cultural' && interestSet.has('culture')) return true
      return d <= days + 1
    })
    .slice(0, 3)
}
