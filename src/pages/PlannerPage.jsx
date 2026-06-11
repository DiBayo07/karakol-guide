import { useState, useMemo } from 'react'
import {
  Compass, Check, MapPin, Clock, Utensils, Landmark,
  Download, ChevronRight,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import MapView from '../components/MapView'
import { buildItinerary } from '../lib/planner'
import { saveItinerary } from '../lib/storage'
import { useAppData } from '../context/AppDataContext'
import { useLanguage } from '../context/LanguageContext'
import { getLocalizedPlannerPois } from '../i18n'

export default function PlannerPage() {
  const { sights, foodPlaces } = useAppData()
  const { lang, t } = useLanguage()
  const allPois = useMemo(() => getLocalizedPlannerPois(sights, foodPlaces, lang), [sights, foodPlaces, lang])
  const [selectedIds, setSelectedIds] = useState([])
  const [plan, setPlan] = useState(null)

  const sightsPois = useMemo(() => allPois.filter((p) => p.poiType === 'sight'), [allPois])
  const foodPois = useMemo(() => allPois.filter((p) => p.poiType === 'food'), [allPois])

  const togglePoi = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const planMarkers = useMemo(() => {
    if (!plan) return []
    return plan.days.flatMap((d) => d.stops)
  }, [plan])

  const planLine = useMemo(() => planMarkers, [planMarkers])

  const handleBuild = () => {
    if (selectedIds.length === 0) {
      alert(
        lang === 'en'
          ? 'Please select at least one place to build your itinerary!'
          : 'Пожалуйста, выберите хотя бы одно место для построения маршрута!'
      )
      return
    }
    const result = buildItinerary({
      selectedIds,
      allPois,
      lang,
    })
    setPlan(result)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  const handleSave = () => {
    if (plan) {
      saveItinerary({ plan })
      alert(t('planner.savedAlert'))
    }
  }

  return (
    <>
      <PageHero
        title={t('planner.title')}
        subtitle={t('planner.subtitle')}
        crumbs={[t('planner.crumb')]}
      />

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
                  {lang === 'en' ? 'Select Sights to Visit' : 'Выберите достопримечательности'}
                </h2>
                <p className="text-sm text-[var(--text-light)] mb-6">
                  {lang === 'en'
                    ? 'Mark the sights you would like to include in your tour.'
                    : 'Отметьте достопримечательности, которые хотите включить в маршрут.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {sightsPois.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedIds.includes(p.id)
                          ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                          : 'border-[var(--border)] hover:border-sky-400/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => togglePoi(p.id)}
                        className="mt-1 shrink-0 accent-amber-400"
                      />
                      <span className="text-sm font-medium">
                        <Landmark size={14} className="inline mr-1 text-amber-400" />
                        {p.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
                  {lang === 'en' ? 'Select Places to Eat' : 'Где хотите поесть?'}
                </h2>
                <p className="text-sm text-[var(--text-light)] mb-6">
                  {lang === 'en'
                    ? 'Mark cafes and restaurants you would like to visit.'
                    : 'Отметьте кафе и рестораны, которые хотите посетить.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {foodPois.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedIds.includes(p.id)
                          ? 'border-sky-400 bg-sky-500/10 text-sky-300'
                          : 'border-[var(--border)] hover:border-sky-400/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => togglePoi(p.id)}
                        className="mt-1 shrink-0 accent-sky-400"
                      />
                      <span className="text-sm font-medium">
                        <Utensils size={14} className="inline mr-1 text-sky-400" />
                        {p.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text)]">
                    {lang === 'en' ? 'Your Selection' : 'Ваш выбор'}
                  </h2>
                  <div className="mt-4 space-y-2 text-sm text-[var(--text-light)]">
                    <p className="flex justify-between">
                      <span>{lang === 'en' ? 'Selected sights:' : 'Достопримечательности:'}</span>
                      <span className="font-bold text-amber-300">
                        {selectedIds.filter((id) => sightsPois.some((p) => p.id === id)).length}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>{lang === 'en' ? 'Selected food places:' : 'Кафе и рестораны:'}</span>
                      <span className="font-bold text-sky-300">
                        {selectedIds.filter((id) => foodPois.some((p) => p.id === id)).length}
                      </span>
                    </p>
                    <div className="border-t border-[var(--border)] pt-2 flex justify-between font-medium text-[var(--text)]">
                      <span>{lang === 'en' ? 'Total items:' : 'Всего точек:'}</span>
                      <span className="font-bold text-amber-400">{selectedIds.length}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBuild}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg shadow-lg font-semibold"
                >
                  <Compass size={22} /> {t('planner.build')}
                </button>

                {selectedIds.length > 0 && (
                  <button
                    type="button"
                    className="w-full text-center text-sm text-[var(--text-light)] hover:text-amber-300 transition-colors"
                    onClick={() => setSelectedIds([])}
                  >
                    {lang === 'en' ? 'Clear all selections' : 'Очистить выбор'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {plan && (
            <div className="mt-14 animate-[fade-in_0.3s_ease-out]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="section-title">{t('planner.yourPlan')}</h2>
                  <p className="text-[var(--text-light)]">
                    {lang === 'en'
                      ? `${plan.totalStops} locations in your custom route`
                      : `${plan.totalStops} точек в вашем индивидуальном маршруте`}
                  </p>
                </div>
                <button type="button" onClick={handleSave} className="btn-outline flex items-center gap-2">
                  <Download size={18} /> {t('planner.saveBrowser')}
                </button>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold mb-3 text-[var(--text)]">{t('planner.mapTitle')}</h3>
                <MapView markers={planMarkers} routeLine={planLine} height="450px" fitBounds />
                <p className="text-xs text-[var(--muted)] mt-2">{t('planner.mapHint')}</p>
              </div>

              <div className="card p-6 mb-8 overflow-x-auto">
                <p className="text-xs text-[var(--muted)] mb-4 uppercase tracking-wide">{t('planner.scheme')}</p>
                <div className="flex items-center gap-2 min-w-max pb-2">
                  {plan.days.flatMap((d, di) =>
                    d.stops.map((s, si) => (
                      <span key={`${di}-${si}`} className="flex items-center gap-2">
                        <span className="px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-xs font-medium whitespace-nowrap text-[var(--text)]">
                          {s.startTime} — {s.name.slice(0, 18)}
                          {s.name.length > 18 ? '…' : ''}
                        </span>
                        {!(di === plan.days.length - 1 && si === d.stops.length - 1) && (
                          <ChevronRight size={16} className="text-amber-400 shrink-0" />
                        )}
                      </span>
                    )),
                  )}
                </div>
              </div>

              <div className="space-y-10">
                {plan.days.map((day) => (
                  <div key={day.day}>
                    <h3 className="text-2xl font-bold text-amber-400 mb-2">
                      {lang === 'en' ? 'Recommended Itinerary' : 'Рекомендуемый порядок посещения'}
                    </h3>
                    <p className="text-sm text-[var(--muted)] mb-6">
                      ~{Math.round(day.totalMin / 60)} {t('planner.activities')} · ~{day.distanceKm} {t('planner.between')}
                    </p>
                    <div className="relative pl-8 border-l-2 border-sky-200 space-y-6">
                      {day.stops.map((stop) => (
                        <div key={stop.id + stop.order} className="relative">
                          <span className="absolute -left-[33px] w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-sky-500 text-[#0a1628] text-xs flex items-center justify-center font-bold">
                            {stop.order}
                          </span>
                          <div className="card p-5">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="text-xs text-sky-700 font-semibold">
                                  {stop.startTime} – {stop.endTime}
                                </p>
                                <h4 className="text-lg font-semibold mt-1 text-[var(--text)]">{stop.name}</h4>
                              </div>
                              <span className="text-xs px-2 py-1 rounded-full bg-sky-500/15 text-sky-300">
                                {stop.poiType === 'food' ? t('planner.poiFood') : t('planner.poiSight')}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-[var(--text-light)] flex items-center gap-2">
                              <MapPin size={14} /> {stop.address}
                            </p>
                            <p className="text-xs text-[var(--muted)] mt-1 flex items-center gap-2">
                              <Clock size={14} /> ~{stop.durationMin} min
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 card p-6">
                <h3 className="font-semibold text-[var(--text)] mb-3">{t('planner.tips')}</h3>
                <ul className="space-y-2">
                  {plan.tips.map((tip) => (
                    <li key={tip} className="flex gap-2 text-sm text-[var(--text-light)]">
                      <Check size={16} className="text-emerald-400 shrink-0" /> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
