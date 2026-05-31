import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, MapPin } from 'lucide-react'
import { ADMIN_CREDENTIALS } from '../../data/content'
import { useAppData } from '../../context/AppDataContext'

export default function AdminLoginPage() {
  const { loginAdmin } = useAppData()
  const navigate = useNavigate()
  const [user, setUser] = useState('admin')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (user === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password) {
      loginAdmin(true)
      navigate('/admin')
    } else {
      setError('Неверный логин или пароль')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md card p-8 border-sky-500/20">
        <div className="text-center mb-8">
          <span className="inline-flex w-14 h-14 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 items-center justify-center text-[#070d1a] mb-4">
            <Lock size={28} />
          </span>
          <h1 className="text-2xl font-bold text-[var(--text)]">Вход администратора</h1>
          <p className="text-sm text-[var(--muted)] mt-2">Панель KarakolGuide</p>
        </div>
        {error && <p className="mb-4 p-3 rounded-lg bg-rose-500/15 text-rose-400 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Логин</label>
            <input className="input" value={user} onChange={(e) => setUser(e.target.value)} />
          </div>
          <div>
            <label className="label">Пароль</label>
            <input className="input" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full py-3">Войти</button>
        </form>
        <p className="mt-6 text-xs text-center text-[var(--muted)]">Демо: admin / admin123</p>
        <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-sky-400 hover:underline">
          <MapPin size={16} /> На сайт для туристов
        </Link>
      </div>
    </div>
  )
}
