import { Link, useParams } from 'react-router-dom'
import { Clock, MapPin, Calendar, Users, Check } from 'lucide-react'
import PageHero from '../components/PageHero'
import BgImage from '../components/BgImage'
import { useAppData } from '../context/AppDataContext'
import { TYPE_LABELS, DIFFICULTY_LABELS } from '../data/content'

export default function RouteDetailPage() {
  const { id } = useParams()
  const { routes } = useAppData()
  const route = routes.find((r) => String(r.id) === String(id))

  if (!route) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-serif">Маршрут не найден</h1>
        <Link to="/routes" className="btn-primary inline-block mt-6">К каталогу</Link>
      </div>
    )
  }

  return (
    <>
      <PageHero title={route.title} crumbs={['Маршруты', route.title]} />
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="rounded-2xl h-64 md:h-80 mb-8 overflow-hidden relative">
              <BgImage src={route.image} alt={route.title} className="w-full h-full object-cover" />
            </div>
            <p className="text-lg text-[var(--text-light)] leading-relaxed">{route.description}</p>
            <h2 className="font-serif text-2xl mt-10 mb-4 text-[var(--secondary)]">Что включено</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(route.features || []).map((f) => (
                <li key={f} className="flex items-center gap-2 text-[var(--text-light)]">
                  <Check size={18} className="text-sky-400 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <aside className="card p-6 h-fit sticky top-24">
            <p className="text-3xl font-bold text-sky-400">
              ${route.price} <span className="text-sm font-normal text-[var(--muted)]">/ чел.</span>
            </p>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex gap-3"><Clock size={18} className="text-sky-400" /><div><dt className="text-[var(--muted)]">Длительность</dt><dd className="font-medium">{route.duration}</dd></div></div>
              <div className="flex gap-3"><MapPin size={18} className="text-[var(--primary)]" /><div><dt className="text-[var(--muted)]">Локация</dt><dd className="font-medium">{route.location}</dd></div></div>
              <div className="flex gap-3"><Calendar size={18} className="text-[var(--primary)]" /><div><dt className="text-[var(--muted)]">Сезон</dt><dd className="font-medium">{route.season}</dd></div></div>
              <div className="flex gap-3"><Users size={18} className="text-[var(--primary)]" /><div><dt className="text-[var(--muted)]">Группа</dt><dd className="font-medium">{route.groupSize}</dd></div></div>
            </dl>
            <p className="mt-4"><span className="font-medium">{TYPE_LABELS[route.type]}</span> · {DIFFICULTY_LABELS[route.difficulty]} · {route.distance}</p>
            <Link to="/contact" className="btn-primary w-full text-center mt-8 block">Забронировать / спросить</Link>
            <Link to="/planner" className="btn-outline w-full text-center mt-3 block">Добавить в свой план</Link>
          </aside>
        </div>
      </section>
    </>
  )
}
