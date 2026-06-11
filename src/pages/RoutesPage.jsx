import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import PageHero from '../components/PageHero'
import RouteCard from '../components/RouteCard'
import { useAppData } from '../context/AppDataContext'
import { useLanguage } from '../context/LanguageContext'
import { translateLabel } from '../i18n'

const TYPE_KEYS = ['hiking', 'horse', '4x4', 'cultural']

export default function RoutesPage() {
  const { routes: routeList } = useAppData()
  const routes = Array.isArray(routeList) ? routeList : []
  const { lang, t } = useLanguage()
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
        title={t('routes.title')}
        subtitle={t('routes.subtitle')}
        crumbs={[t('routes.crumb')]}
      />
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="card p-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="label">{t('routes.type')}</label>
                <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="all">{t('routes.all')}</option>
                  {TYPE_KEYS.map((k) => (
                    <option key={k} value={k}>{translateLabel(lang, 'type', k)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">{t('routes.duration')}</label>
                <select className="input" value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="all">{t('routes.any')}</option>
                  <option value="1">{t('routes.day1')}</option>
                  <option value="2-3">{t('routes.days23')}</option>
                  <option value="4-7">{t('routes.days47')}</option>
                  <option value="7+">{t('routes.days7')}</option>
                </select>
              </div>
              <div>
                <label className="label">{t('routes.difficulty')}</label>
                <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="all">{t('routes.any')}</option>
                  <option value="easy">{translateLabel(lang, 'difficulty', 'easy')}</option>
                  <option value="medium">{translateLabel(lang, 'difficulty', 'medium')}</option>
                  <option value="hard">{translateLabel(lang, 'difficulty', 'hard')}</option>
                </select>
              </div>
              <div>
                <label className="label">{t('routes.search')}</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    className="input pl-10"
                    placeholder={t('routes.searchPlaceholder')}
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
              {t('routes.reset')}
            </button>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center py-16 text-[var(--muted)]">{t('routes.notFound')}</p>
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
