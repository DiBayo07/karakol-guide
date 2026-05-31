import { Link } from 'react-router-dom'
import { Clock, MapPin, Users } from 'lucide-react'
import { TYPE_LABELS, DIFFICULTY_LABELS } from '../data/content'
import BgImage from './BgImage'

const diffClass = {
  easy: 'bg-emerald-500/15 text-emerald-400',
  medium: 'bg-amber-500/15 text-amber-400',
  hard: 'bg-rose-500/15 text-rose-400',
}

export default function RouteCard({ route }) {
  return (
    <article className="card overflow-hidden flex flex-col h-full group">
      <div className="h-48 relative overflow-hidden">
        <BgImage src={route.image} alt={route.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent" />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-sky-500/90 text-[#070d1a] text-xs font-bold">
          {TYPE_LABELS[route.type] || route.type}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1 -mt-6 relative z-10">
        <h3 className="text-lg font-bold text-[var(--text)] group-hover:text-sky-400 transition-colors">
          {route.title}
        </h3>
        <p className="mt-2 text-sm text-[var(--text-light)] line-clamp-3 flex-1">{route.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1"><Clock size={14} className="text-sky-400" /> {route.duration}</span>
          <span className="flex items-center gap-1"><MapPin size={14} className="text-sky-400" /> {route.location}</span>
          <span className="flex items-center gap-1 col-span-2"><Users size={14} className="text-sky-400" /> {route.groupSize}</span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-[var(--border)]">
          <div>
            <span className="text-xl font-bold text-sky-400">${route.price}</span>
            <span className="text-xs text-[var(--muted)]"> / чел.</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${diffClass[route.difficulty]}`}>
            {DIFFICULTY_LABELS[route.difficulty]}
          </span>
        </div>
        <Link to={`/routes/${route.id}`} className="btn-outline mt-4 text-center text-sm py-2">
          Подробнее
        </Link>
      </div>
    </article>
  )
}
