import React, { useState } from 'react'
import { useAppData } from '../../context/AppDataContext'

export default function AdminSightsPage() {
  const { sights, addSight, updateSight, deleteSight } = useAppData()
  const [editingSight, setEditingSight] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    location: '',
    category: 'nature'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingSight) {
      updateSight(editingSight.id, formData)
    } else {
      addSight(formData)
    }
    resetForm()
  }

  const resetForm = () => {
    setEditingSight(null)
    setFormData({
      title: '',
      description: '',
      image: '',
      location: '',
      category: 'nature'
    })
  }

  const handleEdit = (sight) => {
    setEditingSight(sight)
    setFormData(sight)
  }

  const handleDelete = (id) => {
    if (confirm('Удалить достопримечательность?')) {
      deleteSight(id)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Достопримечательности</h1>
        <p className="text-gray-600 mt-2">Управление списком достопримечательностей Каракола</p>
      </div>

      {/* Карточка с формой */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editingSight ? 'Редактировать' : 'Добавить'} достопримечательность
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Локация</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL изображения</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="nature">🏔️ Природа</option>
                <option value="history">📜 История</option>
                <option value="culture">🎭 Культура</option>
                <option value="religion">🕌 Религия</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              {editingSight ? 'Сохранить' : 'Добавить'}
            </button>
            {editingSight && (
              <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition">
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Список достопримечательностей */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Список достопримечательностей</h2>
        </div>
        {sights.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Нет добавленных достопримечательностей
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sights.map((sight) => (
              <div key={sight.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{sight.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      {sight.location && (
                        <span className="text-sm text-gray-500">📍 {sight.location}</span>
                      )}
                      <span className="text-sm px-2 py-0.5 bg-gray-100 rounded-full">
                        {sight.category === 'nature' && '🏔️ Природа'}
                        {sight.category === 'history' && '📜 История'}
                        {sight.category === 'culture' && '🎭 Культура'}
                        {sight.category === 'religion' && '🕌 Религия'}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{sight.description.substring(0, 150)}...</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(sight)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(sight.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}