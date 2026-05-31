import { Link } from 'react-router-dom'
import { Compass, Mountain, Utensils, MapPin, ArrowRight, Map } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import RouteCard from '../components/RouteCard'
import MapView from '../components/MapView'
import BgImage from '../components/BgImage'
import { SIGHTS, IMAGES } from '../data/content'

export default function HomePage() {
  const { routes } = useAppData()
  const popular = routes.slice(0, 3)

  return (
    <>
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <BgImage
          src={IMAGES.hero}
          alt="Горы и Иссык-Куль, Кыргызстан"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[hero-zoom_20s_ease-out_forwards]"
        />
        <BgImage
          src={IMAGES.heroSecondary}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-soft-light"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070d1a] via-[#070d1a]/55 to-[#0a1628]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070d1a]/92 via-[#070d1a]/45 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 md:py-28 w-full">
          <p className="text-sky-400 text-sm font-semibold tracking-widest uppercase mb-4 drop-shadow-lg">
            Иссык-Куль · Тянь-Шань · Кыргызстан
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold max-w-3xl leading-[1.08] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            Гид по{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300">
              Караколу
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed drop-shadow-md">
            Маршруты, достопримечательности, карта и маршрутизатор — всё для самостоятельного
            путешествия по восточному Кыргызстану.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link to="/planner" className="btn-primary inline-flex items-center justify-center gap-2 shadow-xl">
              <Compass size={20} /> Собрать маршрут
            </Link>
            <Link
              to="/sights"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
            >
              Что посмотреть <ArrowRight size={18} />
            </Link>
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
            <Map className="text-sky-400" size={24} />
            <h2 className="section-title">Карта достопримечательностей</h2>
          </div>
          <MapView markers={SIGHTS} height="360px" fitBounds zoom={10} />
          <p className="mt-3 text-sm text-[var(--muted)] text-center">
            Интерактивная карта — все основные точки Каракола и окрестностей
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-title text-center mb-12">Разделы гида</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Compass, title: 'Маршрутизатор', desc: 'План по дням с временем и картой', to: '/planner' },
              { icon: Mountain, title: 'Маршруты', desc: 'Треккинг, конные, культурные туры', to: '/routes' },
              { icon: MapPin, title: 'Достопримечательности', desc: 'Собор, мечеть, Жети-Огуз, Ала-Куль', to: '/sights' },
              { icon: Utensils, title: 'Где поесть', desc: 'Ашлянфу, лагман, рынок', to: '/food' },
            ].map(({ icon: Icon, title, desc, to }) => (
              <Link key={to} to={to} className="card p-6 hover:bg-[var(--bg-card-hover)] group">
                <div className="w-12 h-12 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400 mb-4 group-hover:bg-sky-500/25 transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-[var(--text)]">{title}</h3>
                <p className="mt-2 text-sm text-[var(--text-light)]">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--bg-elevated)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="section-title">Популярные маршруты</h2>
              <p className="text-[var(--text-light)] mt-2">Готовые программы по региону</p>
            </div>
            <Link to="/routes" className="text-sky-400 font-semibold hover:underline">
              Все маршруты →
            </Link>
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
