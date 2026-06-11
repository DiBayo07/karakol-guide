import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Clock, MapPin, Users } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { localizeRoute, translateLabel } from '../i18n'
import BgImage from './BgImage'

const diffClass = {
  easy: 'bg-emerald-500/15 text-emerald-400',
  medium: 'bg-amber-500/15 text-amber-400',
  hard: 'bg-rose-500/15 text-rose-400',
}

export default function RouteCard({ route }) {
  const { lang, t } = useLanguage()
  const r = useMemo(() => localizeRoute(route, lang), [route, lang])

  return (
    <Link
      to={`/routes/${r.id}`}
      className="card overflow-hidden flex flex-col h-full group hover:no-underline hover:border-amber-400/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="h-48 relative overflow-hidden">
        <BgImage
          src={r.image}
          alt={r.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent" />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-400 text-[#0a1628] text-xs font-bold">
          {translateLabel(lang, 'type', r.type)}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-[var(--text)] group-hover:text-amber-300 transition-colors">
          {r.title}
        </h3>
        <p className="mt-2 text-sm text-[var(--text-light)] line-clamp-3 flex-1">{r.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-sky-400" /> {r.duration}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-sky-400" /> {r.location}
          </span>
          <span className="flex items-center gap-1 col-span-2">
            <Users size={14} className="text-sky-400" /> {r.groupSize}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-[var(--border)]">
          <div>
            <span className="text-xl font-bold text-amber-400">${r.price}</span>
            <span className="text-xs text-[var(--muted)]"> {t('routes.perPerson')}</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${diffClass[r.difficulty]}`}>
            {translateLabel(lang, 'difficulty', r.difficulty)}
          </span>
        </div>
      </div>
    </Link>
  )
}
