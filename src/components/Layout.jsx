import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { MapPin, Menu, X, Compass, Shield } from 'lucide-react'

const NAV = [
  { to: '/', label: 'Главная' },
  { to: '/routes', label: 'Маршруты' },
  { to: '/planner', label: 'Маршрутизатор' },
  { to: '/sights', label: 'Достопримечательности' },
  { to: '/food', label: 'Где поесть' },
  { to: '/info', label: 'Туристам' },
  { to: '/contact', label: 'Контакты' },
]

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'text-[var(--primary)] bg-[var(--primary)]/10'
      : 'text-[var(--text-light)] hover:text-[var(--text)] hover:bg-white/5'
  }`

export default function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) return <Outlet />

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-50 glass-header">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-[#070d1a] shadow-lg shadow-sky-500/20">
              <MapPin size={20} />
            </span>
            <span>
              <span className="block font-bold text-[var(--text)] leading-tight tracking-tight">
                Karakol<span className="text-sky-400">Guide</span>
              </span>
              <span className="block text-[10px] text-[var(--muted)] tracking-widest uppercase">
                Иссык-Куль
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link to="/admin/login" className="btn-ghost hidden sm:inline-flex" title="Вход для администратора">
              <Shield size={16} /> Админ
            </Link>
            <Link
              to="/planner"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-sky-400 to-indigo-500 text-[#070d1a] hover:opacity-90 transition-opacity"
            >
              <Compass size={16} /> Маршрут
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg border border-[var(--border)] text-[var(--text-light)]"
              onClick={() => setOpen(!open)}
              aria-label="Меню"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-[var(--border)] px-4 py-3 flex flex-col gap-1 bg-[var(--bg-elevated)]">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className={navClass}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/admin/login" onClick={() => setOpen(false)} className="btn-ghost mt-2 justify-center">
              <Shield size={16} /> Вход администратора
            </Link>
            <Link
              to="/planner"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 text-[#070d1a] font-semibold"
            >
              <Compass size={18} /> Маршрутизатор
            </Link>
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
              Karakol<span className="text-sky-400">Guide</span>
            </h3>
            <p className="text-[var(--text-light)] text-sm leading-relaxed">
              Туристический гид по Караколу и Иссык-Кулю: маршруты, карта, достопримечательности и
              планировщик поездки.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[var(--text)]">Разделы</h4>
            <ul className="space-y-2 text-sm text-[var(--text-light)]">
              <li><Link to="/routes" className="hover:text-sky-400">Маршруты</Link></li>
              <li><Link to="/planner" className="hover:text-sky-400">Маршрутизатор</Link></li>
              <li><Link to="/sights" className="hover:text-sky-400">Достопримечательности</Link></li>
              <li><Link to="/food" className="hover:text-sky-400">Где поесть</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-[var(--text)]">Контакты</h4>
            <p className="text-sm text-[var(--text-light)]">г. Каракол, ул. Ленина 125</p>
            <p className="text-sm text-[var(--text-light)]">+996 3922 5-55-55</p>
            <p className="text-sm text-[var(--text-light)]">info@karakol-guide.kg</p>
          </div>
        </div>
        <div className="border-t border-[var(--border)] text-center text-xs text-[var(--muted)] py-4">
          © {new Date().getFullYear()} Karakol Travel Guide — дипломный проект
        </div>
      </footer>
    </div>
  )
}
