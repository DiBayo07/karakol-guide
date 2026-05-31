import { useState } from 'react'
import { Clock, MapPin, Ticket } from 'lucide-react'
import PageHero from '../components/PageHero'
import MapView from '../components/MapView'
import BgImage from '../components/BgImage'
import { SIGHTS, CATEGORY_LABELS, IMAGES } from '../data/content'

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'historical', label: 'Исторические' },
  { id: 'natural', label: 'Природные' },
  { id: 'cultural', label: 'Культурные' },
  { id: 'religious', label: 'Религиозные' },
]

export default function SightsPage() {
  const [filter, setFilter] = useState('all')
  const list = filter === 'all' ? SIGHTS : SIGHTS.filter((s) => s.category === filter)
  const mapMarkers = list.map((s) => ({ ...s, poiType: 'sight', name: s.title }))

  return (
    <>
      <PageHero
        title="Достопримечательности Каракола"
        subtitle="Реальные места региона: собор, дунганская мечеть, музей Пржевальского, Жети-Огуз и Ала-Куль"
        crumbs={['Достопримечательности']}
        image={IMAGES.jetiOguz}
      />
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <MapView markers={mapMarkers} height="420px" fitBounds />
          <p className="text-center text-xs text-[var(--muted)] mt-2">
            Фиолетовые маркеры — достопримечательности. Нажмите на точку для подробностей.
          </p>
        </div>
      </section>
      <section className="py-8 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  filter === f.id
                    ? 'bg-sky-500/20 border-sky-400/50 text-sky-300'
                    : 'border-[var(--border)] text-[var(--text-light)] hover:border-sky-400/30'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((s) => (
              <article key={s.id} className="card overflow-hidden group">
                <div className="h-52 relative overflow-hidden">
                  <BgImage src={s.image} alt={s.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
                    {CATEGORY_LABELS[s.category]}
                  </span>
                  <h3 className="font-bold text-lg mt-2 text-[var(--text)] group-hover:text-sky-400 transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-light)] line-clamp-3">{s.description}</p>
                  <ul className="mt-4 space-y-1 text-xs text-[var(--muted)]">
                    <li className="flex items-center gap-2"><MapPin size={14} className="text-sky-400" /> {s.address}</li>
                    <li className="flex items-center gap-2"><Clock size={14} className="text-sky-400" /> {s.hours}</li>
                    <li className="flex items-center gap-2"><Ticket size={14} className="text-sky-400" /> {s.price}</li>
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
