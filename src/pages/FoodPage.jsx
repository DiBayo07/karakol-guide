import { useState } from 'react'
import { MapPin, Clock, Coins, Star } from 'lucide-react'
import PageHero from '../components/PageHero'
import BgImage from '../components/BgImage'
import { FOOD_PLACES, FOOD_TABS } from '../data/content'

export default function FoodPage() {
  const [tab, setTab] = useState('traditional')
  const list = FOOD_PLACES.filter((f) => f.category === tab)

  return (
    <>
      <PageHero
        title="Гастрономический гид"
        subtitle="Рестораны, кафе и уличная еда: от дунганского лагмана до кофеен"
        crumbs={['Где поесть']}
      />
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center border-b border-[var(--border)] pb-6 mb-10">
            {FOOD_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  tab === t.id ? 'bg-[var(--primary)]/20 text-[var(--primary-dark)]' : 'text-[var(--text-light)] hover:bg-[var(--bg-light)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {list.map((f) => (
              <article key={f.id} className="card overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-40 h-40 sm:h-auto shrink-0 relative overflow-hidden">
                  <BgImage src={f.image} alt={f.title} className="w-full h-full object-cover min-h-[160px]" />
                </div>
                <div className="p-5 flex-1">
                  <h3 className="font-serif text-xl font-semibold text-[var(--secondary)]">{f.title}</h3>
                  <p className="flex items-center gap-1 mt-1 text-amber-600 text-sm">
                    <Star size={14} fill="currentColor" /> {f.rating}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-light)]">{f.description}</p>
                  <ul className="mt-3 space-y-1 text-xs text-[var(--muted)]">
                    <li className="flex items-center gap-2"><MapPin size={14} /> {f.address}</li>
                    <li className="flex items-center gap-2"><Clock size={14} /> {f.hours}</li>
                    <li className="flex items-center gap-2"><Coins size={14} /> {f.price}</li>
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
