import { useState, useMemo } from 'react'
import { Clock, MapPin, Ticket, X, Star } from 'lucide-react'
import PageHero from '../components/PageHero'
import MapView from '../components/MapView'
import BgImage from '../components/BgImage'
import { useAppData } from '../context/AppDataContext'
import { useLanguage } from '../context/LanguageContext'
import { localizeSight, translateLabel } from '../i18n'
import { IMAGES } from '../data/content'

const FILTER_IDS = ['all', 'historical', 'natural', 'cultural', 'religious']

export default function SightsPage() {
  const { sights } = useAppData()
  const { lang, t } = useLanguage()
  const [filter, setFilter] = useState('all')
  const [selectedPoi, setSelectedPoi] = useState(null)

  const localized = useMemo(() => sights.map((s) => localizeSight(s, lang)), [sights, lang])
  const list = filter === 'all' ? localized : localized.filter((s) => s.category === filter)
  const mapMarkers = list.map((s) => ({ ...s, poiType: 'sight', name: s.title }))

  return (
    <>
      <PageHero
        title={t('sights.title')}
        subtitle={t('sights.subtitle')}
        crumbs={[t('sights.crumb')]}
        image={IMAGES.jetiOguz}
      />
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <MapView markers={mapMarkers} height="420px" fitBounds />
          <p className="text-center text-xs text-[var(--muted)] mt-2">{t('sights.mapHint')}</p>
        </div>
      </section>
      <section className="py-8 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {FILTER_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  filter === id
                    ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                    : 'border-[var(--border)] text-[var(--text-light)] hover:border-sky-400/30'
                }`}
              >
                {t(`sights.filters.${id}`)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((s) => (
              <article
                key={s.id}
                onClick={() => setSelectedPoi(s)}
                className="card overflow-hidden group cursor-pointer hover:border-amber-400/50 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                <div className="h-52 relative overflow-hidden">
                  <BgImage
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
                    {translateLabel(lang, 'category', s.category)}
                  </span>
                  <h3 className="font-bold text-lg mt-2 text-[var(--text)] group-hover:text-amber-300 transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-light)] line-clamp-3 flex-1">{s.description}</p>
                  <ul className="mt-4 space-y-1 text-xs text-[var(--muted)] border-t border-[var(--border)] pt-3">
                    <li className="flex items-center gap-2">
                      <MapPin size={14} className="text-sky-400" /> {s.address}
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock size={14} className="text-sky-400" /> {s.hours}
                    </li>
                    <li className="flex items-center gap-2">
                      <Ticket size={14} className="text-sky-400" /> {s.price}
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
                  {translateLabel(lang, 'category', selectedPoi.category)}
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
                    <Ticket size={18} className="text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold text-[var(--text)]">Стоимость</span>
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
