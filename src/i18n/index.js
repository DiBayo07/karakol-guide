import { translations, sightTranslationsEn, foodTranslationsEn } from './translations'

const STORAGE_KEY = 'karakol_lang'

export function getStoredLang() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'en' || v === 'ru') return v
  } catch {
    /* ignore */
  }
  return 'ru'
}

export function saveLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang)
}

function getByPath(obj, path) {
  if (!obj || !path) return undefined
  const parts = path.split('.')
  let current = obj
  for (let i = 0; i < parts.length; ) {
    let matched = false
    for (let j = parts.length; j > i; j -= 1) {
      const segment = parts.slice(i, j).join('.')
      if (current != null && Object.prototype.hasOwnProperty.call(current, segment)) {
        current = current[segment]
        i = j
        matched = true
        break
      }
    }
    if (!matched) return undefined
  }
  return current
}

export function translate(lang, key) {
  const value = getByPath(translations[lang], key) ?? getByPath(translations.ru, key)
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return key
}

/** Безопасный доступ к labels.type['4x4'] и т.п. */
export function translateLabel(lang, group, id) {
  const pack = translations[lang]?.labels?.[group] ?? translations.ru?.labels?.[group]
  return pack?.[id] ?? id
}

export function localizeRoute(route, lang) {
  if (lang !== 'en') return route
  return {
    ...route,
    title: route.titleEn?.trim() || route.title,
    description: route.descriptionEn?.trim() || route.description,
    location: route.locationEn?.trim() || route.location,
    season: route.seasonEn?.trim() || route.season,
    groupSize: route.groupSizeEn?.trim() || route.groupSize,
    features: route.featuresEn?.length
      ? route.featuresEn
      : route.features,
  }
}

export function localizeSight(sight, lang) {
  if (lang !== 'en') return sight
  if (sight.titleEn?.trim() || sight.descriptionEn?.trim()) {
    return {
      ...sight,
      title: sight.titleEn?.trim() || sight.title,
      description: sight.descriptionEn?.trim() || sight.description,
      address: sight.addressEn?.trim() || sight.address,
      hours: sight.hoursEn?.trim() || sight.hours,
      price: sight.priceEn?.trim() || sight.price,
    }
  }
  const en = sightTranslationsEn[sight.id]
  if (!en) return sight
  return { ...sight, title: en.title, description: en.description }
}

export function localizeFood(place, lang) {
  if (lang !== 'en') return place
  if (place.titleEn?.trim() || place.descriptionEn?.trim()) {
    return {
      ...place,
      title: place.titleEn?.trim() || place.title,
      description: place.descriptionEn?.trim() || place.description,
      address: place.addressEn?.trim() || place.address,
      hours: place.hoursEn?.trim() || place.hours,
      price: place.priceEn?.trim() || place.price,
    }
  }
  const en = foodTranslationsEn[place.id]
  if (!en) return place
  return { ...place, title: en.title, description: en.description }
}

export function getInfoSections(lang) {
  return translations[lang]?.info?.sections ?? translations.ru.info.sections
}

export function getLocalizedPlannerPois(sights, foodPlaces, lang) {
  return [
    ...sights.map((s) => {
      const loc = localizeSight(s, lang)
      return { ...loc, poiType: 'sight', name: loc.title }
    }),
    ...foodPlaces.map((f) => {
      const loc = localizeFood(f, lang)
      return { ...loc, poiType: 'food', name: loc.title }
    }),
  ]
}

export function getPlannerTips(lang, days, interests) {
  const tips = [translate(lang, 'planner.tipStart')]
  if (interests.includes('nature') && days >= 2) {
    tips.push(translate(lang, 'planner.tipNature'))
  }
  if (interests.includes('food')) {
    tips.push(translate(lang, 'planner.tipFood'))
  }
  tips.push(translate(lang, 'planner.tipSave'))
  return tips
}
