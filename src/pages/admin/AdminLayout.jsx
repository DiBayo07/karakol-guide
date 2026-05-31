import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Route, Mail, LogOut, Home } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'

const LINKS = [
  { to: '/admin', label: 'Обзор', icon: LayoutDashboard, end: true },
  { to: '/admin/routes', label: 'Маршруты', icon: Route },
  { to: '/admin/messages', label: 'Сообщения', icon: Mail },
]

export default function AdminLayout() {
  const { admin, logoutAdmin } = useAppData()
  const location = useLocation()

  if (!admin) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)]">
      <aside className="w-56 bg-[var(--bg-elevated)] border-r border-[var(--border)] shrink-0 hidden md:flex flex-col">
        <div className="p-5 font-bold border-b border-[var(--border)]">
          Admin <span className="text-sky-400">Panel</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <Link
              key={to}
              to={to}
              end={end}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                end ? location.pathname === to : location.pathname.startsWith(to)
                  ? 'bg-sky-500/15 text-sky-400'
                  : 'text-[var(--text-light)] hover:bg-white/5'
              }`}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-[var(--border)] space-y-1">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-light)] hover:text-sky-400">
            <Home size={18} /> Сайт
          </Link>
          <button
            type="button"
            onClick={() => { logoutAdmin(); window.location.href = '/admin/login' }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-light)] hover:text-rose-400"
          >
            <LogOut size={18} /> Выход
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden border-b border-[var(--border)] p-4 flex justify-between items-center bg-[var(--bg-elevated)]">
          <span className="font-bold">Admin</span>
          <button type="button" onClick={logoutAdmin} className="text-sm text-sky-400">Выход</button>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
