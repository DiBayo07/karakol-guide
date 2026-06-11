import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MapPin, Menu, X, Compass, Shield } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import { AppLink, AppNavLink } from './AppLink'
import { withBase } from '../lib/basePath'

const NAV_KEYS = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/routes', key: 'nav.routes' },
  { to: '/planner', key: 'nav.planner' },
  { to: '/sights', key: 'nav.sights' },
  { to: '/food', key: 'nav.food' },
  { to: '/info', key: 'nav.info' },
  { to: '/contact', key: 'nav.contact' },
]

const navClass = ({ isActive }) =>
  `px-2.5 xl:px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
    isActive
      ? 'text-amber-300 bg-amber-400/15'
      : 'text-[var(--text-light)] hover:text-sky-300 hover:bg-sky-500/10'
  }`

export default function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { t } = useLanguage()
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) return <Outlet />

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-50 glass-header">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <AppLink to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-sky-500 flex items-center justify-center text-[#0a1628] shadow-lg shadow-amber-500/20">
              <MapPin size={20} />
            </span>
            <span>
              <span className="block font-bold text-[var(--text)] leading-tight tracking-tight">
                Karakol<span className="text-amber-400">Guide</span>
              </span>
              <span className="block text-[10px] text-[var(--muted)] tracking-widest uppercase">
                Issyk-Kul
              </span>
            </span>
          </AppLink>

          <nav className="hidden lg:flex items-center gap-0.5 min-w-0">
            {NAV_KEYS.map((item) => (
              <AppNavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                {t(item.key)}
              </AppNavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <a href={withBase('admin/login')} className="btn-ghost hidden md:inline-flex" title={t('nav.adminLogin')}>
              <Shield size={16} /> {t('nav.admin')}
            </a>
            <AppLink
              to="/planner"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-400 to-sky-500 text-[#0a1628] hover:opacity-90 transition-opacity shadow-md shadow-amber-500/20"
            >
              <Compass size={16} /> {t('nav.planTrip')}
            </AppLink>
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg border border-[var(--border)] text-[var(--text-light)]"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-[var(--border)] px-4 py-3 flex flex-col gap-1 bg-[var(--bg-elevated)]">
            <div className="pb-2 sm:hidden">
              <LanguageSwitcher />
            </div>
            {NAV_KEYS.map((item) => (
              <AppNavLink key={item.to} to={item.to} end={item.end} onClick={() => setOpen(false)} className={navClass}>
                {t(item.key)}
              </AppNavLink>
            ))}
            <a href={withBase('admin/login')} onClick={() => setOpen(false)} className="btn-ghost mt-2 justify-center">
              <Shield size={16} /> {t('nav.adminLogin')}
            </a>
            <AppLink
              to="/planner"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-amber-400 to-sky-500 text-[#0a1628] font-semibold"
            >
              <Compass size={18} /> {t('nav.planner')}
            </AppLink>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)] mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">
              Karakol<span className="text-amber-400">Guide</span>
            </h3>
            <p className="text-[var(--text-light)] text-sm leading-relaxed">{t('footer.tagline')}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[var(--text)]">{t('footer.sections')}</h4>
            <ul className="space-y-2 text-sm text-[var(--text-light)]">
              <li><AppLink to="/routes" className="hover:text-sky-400">{t('nav.routes')}</AppLink></li>
              <li><AppLink to="/planner" className="hover:text-sky-400">{t('nav.planner')}</AppLink></li>
              <li><AppLink to="/sights" className="hover:text-sky-400">{t('nav.sights')}</AppLink></li>
              <li><AppLink to="/food" className="hover:text-sky-400">{t('nav.food')}</AppLink></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[var(--text)]">{t('footer.contacts')}</h4>
            <p className="text-sm text-[var(--text-light)]">Karakol, Lenina 125</p>
            <p className="text-sm text-[var(--text-light)]">+996 3922 5-55-55</p>
            <p className="text-sm text-[var(--text-light)]">info@karakol-guide.kg</p>
            <div className="mt-3 flex gap-3 text-xs">
              <a href="https://instagram.com/karakol_guide" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">Instagram</a>
              <span className="text-[var(--border)]">|</span>
              <a href="https://t.me/karakol_guide_bot" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Telegram Bot</a>
            </div>
          </div>
        </div>
        <div className="border-t border-[var(--border)] text-center text-xs text-[var(--muted)] py-4">
          © {new Date().getFullYear()} {t('footer.copyright')}
        </div>
      </footer>
    </div>
  )
}
