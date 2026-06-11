import { AppLink } from '../components/AppLink'
import { Compass, Mountain, Utensils, MapPin, ArrowRight, Map } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { useLanguage } from '../context/LanguageContext'
import RouteCard from '../components/RouteCard'
import MapView from '../components/MapView'
import BgImage from '../components/BgImage'
import { IMAGES } from '../data/content'

export default function HomePage() {
  const { routes, sights } = useAppData()
  const { t } = useLanguage()
  const popular = routes.slice(0, 3)

  const sectionCards = [
    { icon: Compass, title: t('home.cards.planner.title'), desc: t('home.cards.planner.desc'), to: '/planner' },
    { icon: Mountain, title: t('home.cards.routes.title'), desc: t('home.cards.routes.desc'), to: '/routes' },
    { icon: MapPin, title: t('home.cards.sights.title'), desc: t('home.cards.sights.desc'), to: '/sights' },
    { icon: Utensils, title: t('home.cards.food.title'), desc: t('home.cards.food.desc'), to: '/food' },
  ]

  return (
    <>
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <BgImage
          src={IMAGES.hero}
          alt="Issyk-Kul mountains"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[hero-zoom_20s_ease-out_forwards]"
        />
        <BgImage
          src={IMAGES.heroSecondary}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-[#0f2137]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/92 via-[#0f2137]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 md:py-28 w-full">
          <p className="text-amber-300 text-sm font-semibold tracking-widest uppercase mb-4 drop-shadow-lg">
            {t('home.heroTag')}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold max-w-3xl leading-[1.08] text-white drop-shadow-lg">
            {t('home.heroTitle')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-sky-300 to-cyan-300">
              {t('home.heroTitleAccent')}
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed drop-shadow-md">
            {t('home.heroSubtitle')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <AppLink to="/planner" className="btn-primary inline-flex items-center justify-center gap-2 shadow-lg">
              <Compass size={20} /> {t('home.ctaPlanner')}
            </AppLink>
            <AppLink
              to="/sights"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold border border-sky-400/40 text-white bg-sky-500/20 backdrop-blur-md hover:bg-sky-500/30 transition-colors"
            >
              {t('home.ctaSights')} <ArrowRight size={18} />
            </AppLink>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes hero-zoom {
          from { transform: scale(1.08); }
          to { transform: scale(1); }
        }
      `}</style>

      <section className="py-16 border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Map className="text-amber-400" size={24} />
            <h2 className="section-title">{t('home.mapTitle')}</h2>
          </div>
          <MapView markers={sights} height="360px" fitBounds zoom={10} />
          <p className="mt-3 text-sm text-[var(--muted)] text-center">{t('home.mapHint')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-title text-center mb-12">{t('home.sectionsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sectionCards.map(({ icon: Icon, title, desc, to }) => (
              <AppLink key={to} to={to} className="card p-6 hover:bg-[var(--bg-card-hover)] group">
                <div className="w-12 h-12 rounded-xl bg-amber-400/15 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-400/25 transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-[var(--text)]">{title}</h3>
                <p className="mt-2 text-sm text-[var(--text-light)]">{desc}</p>
              </AppLink>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--bg-elevated)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="section-title">{t('home.popularRoutes')}</h2>
              <p className="text-[var(--text-light)] mt-2">{t('home.popularRoutesSub')}</p>
            </div>
            <AppLink to="/routes" className="text-amber-400 font-semibold hover:underline">
              {t('home.allRoutes')}
            </AppLink>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popular.map((r) => (
              <RouteCard key={r.id} route={r} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
