import { Link } from 'react-router-dom'
import { Route, Mail, Compass, Landmark, Utensils } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'

export default function AdminDashboardPage() {
  const { routes, sights, foodPlaces, messages } = useAppData()
  const newMessages = messages.filter((m) => m.status === 'new').length

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text)] mb-8">Панель управления</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <div className="card p-6">
          <Landmark className="text-[var(--primary)] mb-2" size={28} />
          <p className="text-3xl font-bold">{sights.length}</p>
          <p className="text-sm text-[var(--muted)]">Достопримечательностей</p>
        </div>
        <div className="card p-6">
          <Route className="text-[var(--primary)] mb-2" size={28} />
          <p className="text-3xl font-bold">{routes.length}</p>
          <p className="text-sm text-[var(--muted)]">Маршрутов на сайте</p>
        </div>
        <div className="card p-6">
          <Utensils className="text-[var(--primary)] mb-2" size={28} />
          <p className="text-3xl font-bold">{foodPlaces.length}</p>
          <p className="text-sm text-[var(--muted)]">Ресторанов и кафе</p>
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
        <Link to="/admin/sights" className="card p-6 hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-lg">Достопримечательности</h2>
          <p className="text-sm text-[var(--text-light)] mt-2">Добавление, редактирование и удаление мест</p>
        </Link>
        <Link to="/admin/routes" className="card p-6 hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-lg">Управление маршрутами</h2>
          <p className="text-sm text-[var(--text-light)] mt-2">Добавление, редактирование и удаление туров</p>
        </Link>
        <Link to="/admin/food" className="card p-6 hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-lg">Рестораны и кафе</h2>
          <p className="text-sm text-[var(--text-light)] mt-2">Добавление, редактирование и удаление заведений</p>
        </Link>
        <Link to="/admin/messages" className="card p-6 hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-lg">Сообщения с сайта</h2>
          <p className="text-sm text-[var(--text-light)] mt-2">Обращения из формы контактов</p>
        </Link>
      </div>
      <p className="mt-8 text-sm text-[var(--muted)]">
        Изменения маршрутов и достопримечательностей сохраняются в браузере и отображаются на сайте (localStorage).
      </p>
    </div>
  )
}
