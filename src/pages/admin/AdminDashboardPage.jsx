import { Link } from 'react-router-dom'
import { Route, Mail, Compass } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'

export default function AdminDashboardPage() {
  const { routes, messages } = useAppData()
  const newMessages = messages.filter((m) => m.status === 'new').length

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text)] mb-8">Панель управления</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="card p-6">
          <Route className="text-[var(--primary)] mb-2" size={28} />
          <p className="text-3xl font-bold">{routes.length}</p>
          <p className="text-sm text-[var(--muted)]">Маршрутов на сайте</p>
        </div>
        <div className="card p-6">
          <Mail className="text-[var(--primary)] mb-2" size={28} />
          <p className="text-3xl font-bold">{messages.length}</p>
          <p className="text-sm text-[var(--muted)]">Сообщений ({newMessages} новых)</p>
        </div>
        <div className="card p-6">
          <Compass className="text-[var(--primary)] mb-2" size={28} />
          <p className="text-3xl font-bold">✓</p>
          <p className="text-sm text-[var(--muted)]">Маршрутизатор активен</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/routes" className="card p-6 hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-lg">Управление маршрутами</h2>
          <p className="text-sm text-[var(--text-light)] mt-2">Добавление, редактирование и удаление туров</p>
        </Link>
        <Link to="/admin/messages" className="card p-6 hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-lg">Сообщения с сайта</h2>
          <p className="text-sm text-[var(--text-light)] mt-2">Обращения из формы контактов</p>
        </Link>
      </div>
      <p className="mt-8 text-sm text-[var(--muted)]">
        Изменения маршрутов сохраняются в браузере и отображаются туристам на сайте (localStorage).
      </p>
    </div>
  )
}
