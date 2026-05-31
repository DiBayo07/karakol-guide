import BgImage from './BgImage'
import { IMAGES } from '../data/content'

export default function PageHero({ title, subtitle, crumbs = [], image = IMAGES.mountains }) {
  return (
    <section className="page-hero text-white py-12 md:py-16 relative overflow-hidden min-h-[200px] flex items-end">
      <BgImage src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#070d1a]/95 via-[#0a1628]/85 to-[#0f2847]/70" />
      <div className="max-w-6xl mx-auto px-4 relative z-10 w-full pb-2">
        {crumbs.length > 0 && (
          <p className="text-sm text-sky-300/80 mb-3">
            Главная / {crumbs.join(' / ')}
          </p>
        )}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-lg">{title}</h1>
        {subtitle && <p className="mt-3 text-slate-300 max-w-2xl text-lg">{subtitle}</p>}
      </div>
    </section>
  )
}
