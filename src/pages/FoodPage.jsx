import { useState, useMemo } from 'react'
import { MapPin, Clock, Coins, Star, X } from 'lucide-react'
import PageHero from '../components/PageHero'
import BgImage from '../components/BgImage'
import { useLanguage } from '../context/LanguageContext'
import { useAppData } from '../context/AppDataContext'
import { localizeFood, translateLabel } from '../i18n'
import { FOOD_TABS } from '../data/content'

export default function FoodPage() {
  const { foodPlaces } = useAppData()
  const { lang, t } = useLanguage()
  const [tab, setTab] = useState('traditional')
  const [selectedPoi, setSelectedPoi] = useState(null)

  const list = useMemo(
    () => foodPlaces.filter((f) => f.category === tab).map((f) => localizeFood(f, lang)),
    [foodPlaces, tab, lang],
  )

  return (
    <>
      <PageHero
        title={t('food.title')}
        subtitle={t('food.subtitle')}
        crumbs={[t('food.crumb')]}
      />
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center border-b border-[var(--border)] pb-6 mb-10">
            {FOOD_TABS.map((tabItem) => (
              <button
                key={tabItem.id}
                type="button"
                onClick={() => setTab(tabItem.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  tab === tabItem.id
                    ? 'bg-amber-400/20 text-amber-300'
                    : 'text-[var(--text-light)] hover:bg-[var(--bg-light)]'
                }`}
              >
                {t(`food.tabs.${tabItem.id}`)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {list.map((f) => (
              <article
                key={f.id}
                onClick={() => setSelectedPoi(f)}
                className="card overflow-hidden flex flex-col sm:flex-row group cursor-pointer hover:border-amber-400/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="sm:w-40 h-40 sm:h-auto shrink-0 relative overflow-hidden">
                  <BgImage
                    src={f.image}
                    alt={f.title}
                    className="w-full h-full object-cover min-h-[160px] transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex-1">
                  <h3 className="font-serif text-xl font-semibold text-[var(--secondary)] group-hover:text-amber-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="flex items-center gap-1 mt-1 text-amber-500 text-sm">
                    <Star size={14} fill="currentColor" /> {f.rating}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-light)] line-clamp-3">{f.description}</p>
                  <ul className="mt-3 space-y-1 text-xs text-[var(--muted)] border-t border-[var(--border)] pt-3">
                    <li className="flex items-center gap-2">
                      <MapPin size={14} /> {f.address}
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock size={14} /> {f.hours}
                    </li>
                    <li className="flex items-center gap-2">
                      <Coins size={14} /> {f.price}
                    </li>
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {selectedPoi && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"
          onClick={() => setSelectedPoi(null)}
        >
          <div
            className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-[slide-up_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-80">
              <BgImage src={selectedPoi.image} alt={selectedPoi.title} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setSelectedPoi(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900/80 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
                  {translateLabel(lang, 'foodCategory', selectedPoi.category) || 'Заведение'}
                </span>
                <span className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-0.5 rounded-full">
                  <Star size={12} fill="currentColor" /> {selectedPoi.rating}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text)]">{selectedPoi.title}</h3>
              <p className="mt-4 text-[var(--text-light)] leading-relaxed text-sm sm:text-base">
                {selectedPoi.description}
              </p>

              <div className="mt-6 pt-6 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[var(--text-light)]">
                {selectedPoi.address && (
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold text-[var(--text)]">{t('contact.address')}</span>
                      <span>{selectedPoi.address}</span>
                    </div>
                  </div>
                )}
                {selectedPoi.hours && (
                  <div className="flex items-start gap-2">
                    <Clock size={18} className="text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold text-[var(--text)]">Часы работы</span>
                      <span>{selectedPoi.hours}</span>
                    </div>
                  </div>
                )}
                {selectedPoi.price && (
                  <div className="flex items-start gap-2 col-span-1 sm:col-span-2">
                    <Coins size={18} className="text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold text-[var(--text)]">Средний чек / Стоимость</span>
                      <span>{selectedPoi.price}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedPoi(null)}
                  className="btn-primary px-6"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
