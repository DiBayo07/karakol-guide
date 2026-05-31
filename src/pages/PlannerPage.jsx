import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Compass, Calendar, Check, MapPin, Clock, Utensils, Landmark,
  Download, Route as RouteIcon, ChevronRight,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import MapView from '../components/MapView'
import RouteCard from '../components/RouteCard'
import { getPlannerPois, INTEREST_OPTIONS } from '../data/content'
import { buildItinerary, suggestReadyRoutes } from '../lib/planner'
import { saveItinerary } from '../lib/storage'
import { useAppData } from '../context/AppDataContext'

const ALL_POIS = getPlannerPois()

export default function PlannerPage() {
  const { routes } = useAppData()
  const [days, setDays] = useState(2)
  const [interests, setInterests] = useState(['culture', 'food'])
  const [selectedIds, setSelectedIds] = useState([])
  const [plan, setPlan] = useState(null)

  const toggleInterest = (id) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const togglePoi = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const suggestedRoutes = useMemo(
    () => suggestReadyRoutes(routes, interests, days),
    [routes, interests, days],
  )

  const planMarkers = useMemo(() => {
    if (!plan) return []
    return plan.days.flatMap((d) => d.stops)
  }, [plan])

  const planLine = useMemo(() => planMarkers, [planMarkers])

  const handleBuild = () => {
    if (interests.length === 0) {
      alert('Выберите хотя бы один интерес')
      return
    }
    const result = buildItinerary({
      days,
      interests,
      selectedIds,
      allPois: ALL_POIS,
    })
    setPlan(result)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  const handleSave = () => {
    if (plan) {
      saveItinerary({ days, interests, plan })
      alert('Маршрут сохранён в браузере (до 10 последних)')
    }
  }

  return (
    <>
      <PageHero
        title="Маршрутизатор для туристов"
        subtitle="Соберите поездку по Караколу: выберите дни, интересы и точки — система расставит порядок и время"
        crumbs={['Маршрутизатор']}
      />

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Настройки */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card p-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-[var(--text)]">
                  <Calendar size={20} /> Сколько дней?
                </h2>
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDays(d)}
                      className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-colors ${
                        days === d
                      ? 'border-sky-400 bg-sky-500/20 text-sky-300'
                      : 'border-[var(--border)] text-[var(--text-light)]'
                      }`}
                    >
                      {d} {d === 1 ? 'день' : 'дня'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Интересы</h2>
                <div className="space-y-2">
                  {INTEREST_OPTIONS.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[var(--bg-light)]">
                      <input
                        type="checkbox"
                        checked={interests.includes(opt.id)}
                        onChange={() => toggleInterest(opt.id)}
                        className="w-4 h-4 accent-[var(--secondary)]"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="button" onClick={handleBuild} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg">
                <Compass size={22} /> Построить маршрут
              </button>
            </div>

            {/* Выбор точек */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-[var(--text)] mb-2">
                  Точки на карте маршрута (необязательно)
                </h2>
                <p className="text-sm text-[var(--text-light)] mb-4">
                  Отметьте места, которые хотите обязательно посетить. Остальные подберёт маршрутизатор.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-1">
                  {ALL_POIS.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-start gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                        selectedIds.includes(p.id)
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                          : 'border-[var(--border)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => togglePoi(p.id)}
                        className="mt-1 shrink-0"
                      />
                      <span className="text-sm">
                        {p.poiType === 'food' ? (
                          <Utensils size={14} className="inline mr-1 text-[var(--primary)]" />
                        ) : (
                          <Landmark size={14} className="inline mr-1 text-[var(--secondary)]" />
                        )}
                        {p.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Результат */}
          {plan && (
            <div className="mt-14">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="section-title">Ваш маршрут</h2>
                  <p className="text-[var(--text-light)]">
                    {plan.totalStops} точек за {plan.days.length} {plan.days.length === 1 ? 'день' : 'дня'}
                  </p>
                </div>
                <button type="button" onClick={handleSave} className="btn-outline flex items-center gap-2">
                  <Download size={18} /> Сохранить в браузере
                </button>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold mb-3 text-[var(--text)]">Карта вашего маршрута</h3>
                <MapView
                  markers={planMarkers}
                  routeLine={planLine}
                  height="450px"
                  fitBounds
                />
                <p className="text-xs text-[var(--muted)] mt-2">
                  Голубая линия — рекомендуемый порядок посещения точек
                </p>
              </div>

              <div className="card p-6 mb-8 overflow-x-auto">
                <p className="text-xs text-[var(--muted)] mb-4 uppercase tracking-wide">Схема перемещений</p>
                <div className="flex items-center gap-2 min-w-max pb-2">
                  {plan.days.flatMap((d, di) =>
                    d.stops.map((s, si) => (
                      <span key={`${di}-${si}`} className="flex items-center gap-2">
                        <span className="px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-xs font-medium whitespace-nowrap text-[var(--text)]">
                          Д{d.day} {s.startTime} — {s.name.slice(0, 18)}
                          {s.name.length > 18 ? '…' : ''}
                        </span>
                        {!(di === plan.days.length - 1 && si === d.stops.length - 1) && (
                          <ChevronRight size={16} className="text-[var(--primary)] shrink-0" />
                        )}
                      </span>
                    )),
                  )}
                </div>
              </div>

              <div className="space-y-10">
                {plan.days.map((day) => (
                  <div key={day.day}>
                    <h3 className="text-2xl font-bold text-sky-400 mb-2">
                      День {day.day}
                    </h3>
                    <p className="text-sm text-[var(--muted)] mb-6">
                      ~{Math.round(day.totalMin / 60)} ч активностей · ~{day.distanceKm} км между точками
                    </p>
                    <div className="relative pl-8 border-l-2 border-[var(--primary)]/40 space-y-6">
                      {day.stops.map((stop) => (
                        <div key={stop.id + stop.order} className="relative">
                          <span className="absolute -left-[33px] w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-[#070d1a] text-xs flex items-center justify-center font-bold">
                            {stop.order}
                          </span>
                          <div className="card p-5">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="text-xs text-[var(--primary-dark)] font-semibold">
                                  {stop.startTime} – {stop.endTime}
                                </p>
                                <h4 className="text-lg font-semibold mt-1 text-[var(--text)]">{stop.name}</h4>
                              </div>
                              <span className="text-xs px-2 py-1 rounded-full bg-sky-500/15 text-sky-300">
                                {stop.poiType === 'food' ? 'Еда' : 'Место'}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-[var(--text-light)] flex items-center gap-2">
                              <MapPin size={14} /> {stop.address}
                            </p>
                            <p className="text-xs text-[var(--muted)] mt-1 flex items-center gap-2">
                              <Clock size={14} /> ~{stop.durationMin} мин
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 card p-6">
                <h3 className="font-semibold text-[var(--text)] mb-3">Советы</h3>
                <ul className="space-y-2">
                  {plan.tips.map((t) => (
                    <li key={t} className="flex gap-2 text-sm text-[var(--text-light)]">
                      <Check size={16} className="text-emerald-400 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {suggestedRoutes.length > 0 && (
                <div className="mt-14">
                  <h3 className="text-xl font-bold text-[var(--text)] mb-6 flex items-center gap-2">
                    <RouteIcon size={22} /> Подходящие готовые маршруты
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {suggestedRoutes.map((r) => (
                      <RouteCard key={r.id} route={r} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
