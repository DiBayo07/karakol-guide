import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { AppLink } from '../components/AppLink'
import { Clock, MapPin, Calendar, Users, Check } from 'lucide-react'
import PageHero from '../components/PageHero'
import BgImage from '../components/BgImage'
import { useAppData } from '../context/AppDataContext'
import { useLanguage } from '../context/LanguageContext'
import { localizeRoute, translateLabel } from '../i18n'

export default function RouteDetailPage() {
  const { id } = useParams()
  const { routes } = useAppData()
  const { lang, t } = useLanguage()
  const raw = routes.find((r) => String(r.id) === String(id))
  const route = useMemo(() => (raw ? localizeRoute(raw, lang) : null), [raw, lang])

  if (!route) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-serif">{t('routes.notFoundDetail')}</h1>
        <AppLink to="/routes" className="btn-primary inline-block mt-6">{t('routes.backToCatalog')}</AppLink>
      </div>
    )
  }

  return (
    <>
      <PageHero title={route.title} crumbs={[t('routes.crumb'), route.title]} />
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="rounded-2xl h-64 md:h-80 mb-8 overflow-hidden relative">
              <BgImage src={route.image} alt={route.title} className="w-full h-full object-cover" />
            </div>
            <p className="text-lg text-[var(--text-light)] leading-relaxed">{route.description}</p>
            <h2 className="font-serif text-2xl mt-10 mb-4 text-amber-300">{t('routes.included')}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(route.features || []).map((f) => (
                <li key={f} className="flex items-center gap-2 text-[var(--text-light)]">
                  <Check size={18} className="text-sky-400 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <aside className="card p-6 h-fit sticky top-24">
            <p className="text-3xl font-bold text-amber-400">
              ${route.price} <span className="text-sm font-normal text-[var(--muted)]">{t('routes.perPerson')}</span>
            </p>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex gap-3"><Clock size={18} className="text-sky-400" /><div><dt className="text-[var(--muted)]">{t('routes.meta.duration')}</dt><dd className="font-medium">{route.duration}</dd></div></div>
              <div className="flex gap-3"><MapPin size={18} className="text-sky-400" /><div><dt className="text-[var(--muted)]">{t('routes.meta.location')}</dt><dd className="font-medium">{route.location}</dd></div></div>
              <div className="flex gap-3"><Calendar size={18} className="text-sky-400" /><div><dt className="text-[var(--muted)]">{t('routes.meta.season')}</dt><dd className="font-medium">{route.season}</dd></div></div>
              <div className="flex gap-3"><Users size={18} className="text-sky-400" /><div><dt className="text-[var(--muted)]">{t('routes.meta.group')}</dt><dd className="font-medium">{route.groupSize}</dd></div></div>
            </dl>
            <p className="mt-4">
              <span className="font-medium">{translateLabel(lang, 'type', route.type)}</span>
              {' · '}
              {translateLabel(lang, 'difficulty', route.difficulty)}
              {' · '}
              {route.distance}
            </p>
            <AppLink to="/contact" className="btn-primary w-full text-center mt-8 block">{t('routes.book')}</AppLink>
            <AppLink to="/planner" className="btn-outline w-full text-center mt-3 block">{t('routes.addToPlan')}</AppLink>
          </aside>
        </div>
      </section>
    </>
  )
}
