import BgImage from './BgImage'
import { useLanguage } from '../context/LanguageContext'
import { IMAGES } from '../data/content'

export default function PageHero({ title, subtitle, crumbs = [], image = IMAGES.mountains }) {
  const { t } = useLanguage()

  return (
    <section className="page-hero text-white py-12 md:py-16 relative overflow-hidden min-h-[200px] flex items-end">
      <BgImage src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 via-[#0f2137]/88 to-[#1a3a6b]/75" />
      <div className="max-w-6xl mx-auto px-4 relative z-10 w-full pb-2">
        {crumbs.length > 0 && (
          <p className="text-sm text-amber-300/90 mb-3">
            {t('common.home')} / {crumbs.join(' / ')}
          </p>
        )}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-lg">{title}</h1>
        {subtitle && <p className="mt-3 text-slate-300 max-w-2xl text-lg">{subtitle}</p>}
      </div>
    </section>
  )
}
