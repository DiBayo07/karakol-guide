import { useState, useEffect } from 'react'

export default function AdminContent() {
  const [places, setPlaces] = useState([])
  const [type, setType] = useState('sights') // sights, food, routes
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    price: '', 
    imageUrl: '',
    location: '',
    category: ''
  })

  // Загрузка данных в зависимости от типа
  useEffect(() => {
    fetchPlaces()
  }, [type])

  const fetchPlaces = async () => {
    const res = await fetch(`http://localhost:5000/${type}`)
    const data = await res.json()
    setPlaces(data)
  }

  const addPlace = async (e) => {
    e.preventDefault()
    const res = await fetch(`http://localhost:5000/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...form, 
        price: form.price ? Number(form.price) : null,
        id: Date.now()
      })
    })
    const newPlace = await res.json()
    setPlaces([...places, newPlace])
    setForm({ title: '', description: '', price: '', imageUrl: '', location: '', category: '' })
  }

  const deletePlace = async (id) => {
    await fetch(`http://localhost:5000/${type}/${id}`, { method: 'DELETE' })
    setPlaces(places.filter(p => p.id !== id))
  }

  const getTypeLabel = () => {
    switch(type) {
      case 'sights': return 'Достопримечательности'
      case 'food': return 'Кафе и рестораны'
      case 'routes': return 'Маршруты'
      default: return 'Объекты'
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Управление контентом</h2>
      
      {/* Выбор типа контента */}
      <div className="mb-6 flex gap-4">
        <button 
          onClick={() => setType('sights')} 
          className={`px-4 py-2 rounded ${type === 'sights' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Достопримечательности
        </button>
        <button 
          onClick={() => setType('food')} 
          className={`px-4 py-2 rounded ${type === 'food' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Кафе и еда
        </button>
        <button 
          onClick={() => setType('routes')} 
          className={`px-4 py-2 rounded ${type === 'routes' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Маршруты
        </button>
      </div>

      {/* Форма добавления */}
      <form onSubmit={addPlace} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold">Добавить {getTypeLabel().slice(0, -1)}</h3>
        
        <input 
          placeholder="Название" 
          value={form.title} 
          onChange={e => setForm({...form, title: e.target.value})} 
          className="border p-2 w-full rounded" 
          required 
        />
        
        <textarea 
          placeholder="Описание" 
          value={form.description} 
          onChange={e => setForm({...form, description: e.target.value})} 
          className="border p-2 w-full rounded" 
          rows="3"
        />
        
        {type !== 'sights' && (
          <input 
            placeholder="Цена (в сомах)" 
            type="number" 
            value={form.price} 
            onChange={e => setForm({...form, price: e.target.value})} 
            className="border p-2 w-full rounded" 
          />
        )}
        
        <input 
          placeholder="URL картинки (например: /images/issyk-kul.jpg)" 
          value={form.imageUrl} 
          onChange={e => setForm({...form, imageUrl: e.target.value})} 
          className="border p-2 w-full rounded" 
        />
        
        <input 
          placeholder="Местоположение" 
          value={form.location} 
          onChange={e => setForm({...form, location: e.target.value})} 
          className="border p-2 w-full rounded" 
        />
        
        <input 
          placeholder="Категория (природа, история, культура и т.д.)" 
          value={form.category} 
          onChange={e => setForm({...form, category: e.target.value})} 
          className="border p-2 w-full rounded" 
        />
        
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Добавить
        </button>
      </form>

      {/* Список объектов */}
      <div className="grid gap-4">
        <h3 className="text-xl font-semibold">Список {getTypeLabel().toLowerCase()}</h3>
        {places.map(p => (
          <div key={p.id} className="border p-4 rounded flex justify-between items-center bg-white shadow">
            <div className="flex-1">
              <h4 className="font-bold text-lg">{p.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{p.description}</p>
              {p.price && <p className="text-green-600 font-semibold mt-1">{p.price} сом</p>}
              {p.location && <p className="text-xs text-gray-400 mt-1">📍 {p.location}</p>}
            </div>
            <button 
              onClick={() => deletePlace(p.id)} 
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-4"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
