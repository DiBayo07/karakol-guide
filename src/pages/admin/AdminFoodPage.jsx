import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { FOOD_PLACES, IMAGES } from '../../data/content'

const CATEGORY_LABELS = {
  traditional: 'Традиционная',
  dungan: 'Дунганская',
  cafes: 'Кафе',
  restaurants: 'Рестораны',
  street: 'Уличная еда',
}

const ZONE_LABELS = {
  city: 'Город',
  near: 'Окрестности',
  mountain: 'Горы',
}

const emptyForm = {
  title: '',
  description: '',
  titleEn: '',
  descriptionEn: '',
  category: 'traditional',
  address: 'Каракол',
  addressEn: '',
  hours: '11:00 - 23:00',
  hoursEn: '',
  price: '300-500 сом',
  priceEn: '',
  image: IMAGES.restaurant || '/images/restaurant.jpg',
  rating: 4.5,
  lat: 42.49,
  lng: 78.39,
  zone: 'city',
  durationMin: 60,
  interests: 'food',
}

export default function AdminFoodPage() {
  const { foodPlaces, updateFoodPlaces } = useAppData()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const persist = (next) => {
    updateFoodPlaces(next)
  }

  const openAdd = () => {
    setForm(emptyForm)
    setModal('add')
  }

  const openEdit = (place) => {
    setForm({
      ...emptyForm,
      ...place,
      lat: place.lat ?? 42.49,
      lng: place.lng ?? 78.39,
      rating: place.rating ?? 4.5,
      durationMin: place.durationMin ?? 60,
      zone: place.zone ?? 'city',
      interests: Array.isArray(place.interests) ? place.interests.join(', ') : place.interests || 'food',
    })
    setModal(place.id)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const data = {
      ...form,
      lat: Number(form.lat),
      lng: Number(form.lng),
      rating: Number(form.rating),
      durationMin: Number(form.durationMin),
      interests: String(form.interests).split(',').map((s) => s.trim()).filter(Boolean),
    }
    if (modal === 'add') {
      const id = `food-${Date.now()}`
      persist([...foodPlaces, { ...data, id }])
    } else {
      persist(foodPlaces.map((f) => (f.id === modal ? { ...f, ...data, id: f.id } : f)))
    }
    setModal(null)
  }

  const handleDelete = (id) => {
    if (confirm('Удалить заведение?')) {
      persist(foodPlaces.filter((f) => f.id !== id))
    }
  }

  const resetDefaults = () => {
    if (confirm('Сбросить к стандартному списку заведений?')) {
      localStorage.removeItem('karakol_food_places')
      updateFoodPlaces(FOOD_PLACES)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-[var(--text)]">Рестораны и кафе</h1>
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
              <th className="text-left p-3">EN</th>
              <th className="text-left p-3">Категория</th>
              <th className="text-left p-3">Рейтинг</th>
              <th className="text-left p-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {foodPlaces.map((f, i) => (
              <tr key={f.id} className="border-t border-[var(--border)]">
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium">{f.title}</td>
                <td className="p-3 text-[var(--muted)]">{f.titleEn ? '✓' : '—'}</td>
                <td className="p-3">{CATEGORY_LABELS[f.category] || f.category}</td>
                <td className="p-3">★ {f.rating}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEdit(f)} className="p-2 rounded hover:bg-[var(--bg-light)]" aria-label="Изменить">
                      <Pencil size={16} />
                    </button>
                    <button type="button" onClick={() => handleDelete(f.id)} className="p-2 rounded hover:bg-red-500/10 text-red-400" aria-label="Удалить">
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
            <h2 className="font-serif text-xl font-bold mb-4">
              {modal === 'add' ? 'Новое заведение' : 'Редактирование'}
            </h2>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Русский</p>
              <input className="input" placeholder="Название" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <textarea className="input" placeholder="Описание" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input className="input" placeholder="Адрес" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <input className="input" placeholder="Часы работы" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
              <input className="input" placeholder="Цена / средний чек" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />

              <p className="text-xs font-semibold text-sky-400 uppercase tracking-wide pt-2">English (для EN на сайте)</p>
              <input className="input" placeholder="Title in English" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
              <textarea className="input" placeholder="Description in English" value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
              <input className="input" placeholder="Address in English" value={form.addressEn} onChange={(e) => setForm({ ...form, addressEn: e.target.value })} />
              <input className="input" placeholder="Hours in English" value={form.hoursEn} onChange={(e) => setForm({ ...form, hoursEn: e.target.value })} />
              <input className="input" placeholder="Price in English" value={form.priceEn} onChange={(e) => setForm({ ...form, priceEn: e.target.value })} />

              <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide pt-2">Общее</p>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <input className="input" placeholder="URL фото" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              <select className="input" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })}>
                {Object.entries(ZONE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-[var(--muted)]">Рейтинг</label>
                  <input className="input" type="number" step="0.1" min="1" max="5" placeholder="Рейтинг" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--muted)]">Широта</label>
                  <input className="input" type="number" step="any" placeholder="Широта" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--muted)]">Долгота</label>
                  <input className="input" type="number" step="any" placeholder="Долгота" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
                </div>
              </div>
              <input className="input" type="number" placeholder="Длительность посещения (мин)" value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: e.target.value })} />
              <input className="input" placeholder="Интересы через запятую (обычно food)" value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} />
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
