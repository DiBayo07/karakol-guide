import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { DEFAULT_ROUTES, TYPE_LABELS, DIFFICULTY_LABELS } from '../../data/content'

const emptyForm = {
  title: '',
  description: '',
  type: 'cultural',
  duration: '1 день',
  distance: '5 км',
  difficulty: 'easy',
  price: 0,
  location: 'Каракол',
  season: 'Круглый год',
  groupSize: '2-10 человек',
  image: '/images/jeti-oguz.jpg',
  features: 'Гид, Трансфер',
}

export default function AdminRoutesPage() {
  const { routes, updateRoutes } = useAppData()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const persist = (next) => {
    updateRoutes(next)
  }

  const openAdd = () => {
    setForm(emptyForm)
    setModal('add')
  }

  const openEdit = (route) => {
    setForm({
      ...route,
      features: Array.isArray(route.features) ? route.features.join(', ') : route.features || '',
    })
    setModal(route.id)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const data = {
      ...form,
      price: Number(form.price),
      features: String(form.features).split(',').map((s) => s.trim()).filter(Boolean),
    }
    if (modal === 'add') {
      const id = Math.max(0, ...routes.map((r) => r.id)) + 1
      persist([...routes, { ...data, id }])
    } else {
      persist(routes.map((r) => (r.id === modal ? { ...r, ...data, id: r.id } : r)))
    }
    setModal(null)
  }

  const handleDelete = (id) => {
    if (confirm('Удалить маршрут?')) persist(routes.filter((r) => r.id !== id))
  }

  const resetDefaults = () => {
    if (confirm('Сбросить к стандартным маршрутам?')) {
      localStorage.removeItem('karakol_routes')
      updateRoutes(DEFAULT_ROUTES)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-[var(--text)]">Маршруты</h1>
        <div className="flex gap-2">
          <button type="button" onClick={resetDefaults} className="btn-outline text-sm">Сброс</button>
          <button type="button" onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={18} /> Добавить
          </button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-light)]">
            <tr>
              <th className="text-left p-3">#</th>
              <th className="text-left p-3">Название</th>
              <th className="text-left p-3">Тип</th>
              <th className="text-left p-3">Дни</th>
              <th className="text-left p-3">Цена</th>
              <th className="text-left p-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r, i) => (
              <tr key={r.id} className="border-t border-[var(--border)]">
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium">{r.title}</td>
                <td className="p-3">{TYPE_LABELS[r.type]}</td>
                <td className="p-3">{r.duration}</td>
                <td className="p-3">${r.price}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEdit(r)} className="p-2 rounded hover:bg-[var(--bg-light)]" aria-label="Изменить">
                      <Pencil size={16} />
                    </button>
                    <button type="button" onClick={() => handleDelete(r.id)} className="p-2 rounded hover:bg-red-50 text-red-600" aria-label="Удалить">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onSubmit={handleSave}>
            <h2 className="font-serif text-xl font-bold mb-4">{modal === 'add' ? 'Новый маршрут' : 'Редактирование'}</h2>
            <div className="space-y-3">
              <input className="input" placeholder="Название" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <textarea className="input" placeholder="Описание" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select className="input" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <input className="input" placeholder="Длительность" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              <input className="input" type="number" placeholder="Цена USD" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <input className="input" placeholder="Локация" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <input className="input" placeholder="URL фото" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              <input className="input" placeholder="Особенности через запятую" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
            </div>
            <div className="flex gap-3 mt-6">
              <button type="submit" className="btn-primary flex-1">Сохранить</button>
              <button type="button" className="btn-outline flex-1" onClick={() => setModal(null)}>Отмена</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
