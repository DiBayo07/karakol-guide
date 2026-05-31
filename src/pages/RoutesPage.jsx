import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import PageHero from '../components/PageHero'
import RouteCard from '../components/RouteCard'
import { useAppData } from '../context/AppDataContext'
import { TYPE_LABELS } from '../data/content'

export default function RoutesPage() {
  const { routes } = useAppData()
  const [type, setType] = useState('all')
  const [duration, setDuration] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return routes.filter((r) => {
      if (type !== 'all' && r.type !== type) return false
      if (difficulty !== 'all' && r.difficulty !== difficulty) return false
      if (duration !== 'all') {
        const days = parseInt(r.duration, 10) || 1
        if (duration === '1' && days > 1) return false
        if (duration === '2-3' && (days < 2 || days > 3)) return false
        if (duration === '4-7' && (days < 4 || days > 7)) return false
        if (duration === '7+' && days < 7) return false
      }
      const q = search.toLowerCase()
      if (q && !`${r.title} ${r.description} ${r.location}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [routes, type, duration, difficulty, search])

  return (
    <>
      <PageHero
        title="Маршруты по региону"
        subtitle="Готовые программы: от одного дня в городе до недельного треккинга"
        crumbs={['Маршруты']}
      />
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="card p-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="label">Тип</label>
                <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="all">Все</option>
                  {Object.entries(TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Длительность</label>
                <select className="input" value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="all">Любая</option>
                  <option value="1">1 день</option>
                  <option value="2-3">2–3 дня</option>
                  <option value="4-7">4–7 дней</option>
                  <option value="7+">7+ дней</option>
                </select>
              </div>
              <div>
                <label className="label">Сложность</label>
                <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="all">Любая</option>
                  <option value="easy">Легкий</option>
                  <option value="medium">Средний</option>
                  <option value="hard">Сложный</option>
                </select>
              </div>
              <div>
                <label className="label">Поиск</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    className="input pl-10"
                    placeholder="Название, место..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 text-sm text-[var(--primary-dark)] font-medium"
              onClick={() => { setType('all'); setDuration('all'); setDifficulty('all'); setSearch('') }}
            >
              Сбросить фильтры
            </button>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center py-16 text-[var(--muted)]">Маршруты не найдены. Измените фильтры.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((r) => (
                <RouteCard key={r.id} route={r} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
