import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import PageHero from '../components/PageHero'
import { useAppData } from '../context/AppDataContext'

export default function ContactPage() {
  const { submitMessage } = useAppData()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    submitMessage(form)
    setSent(true)
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <>
      <PageHero title="Контакты" subtitle="Вопросы по маршрутам, бронирование и партнёрство" crumbs={['Контакты']} />
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="card p-5 flex gap-4">
              <MapPin className="text-sky-400 shrink-0" />
              <div><p className="font-semibold">Адрес</p><p className="text-sm text-[var(--text-light)]">г. Каракол, ул. Ленина 125</p></div>
            </div>
            <div className="card p-5 flex gap-4">
              <Phone className="text-sky-400 shrink-0" />
              <div><p className="font-semibold">Телефон</p><p className="text-sm text-[var(--text-light)]">+996 3922 5-55-55</p></div>
            </div>
            <div className="card p-5 flex gap-4">
              <Mail className="text-sky-400 shrink-0" />
              <div><p className="font-semibold">Email</p><p className="text-sm text-[var(--text-light)]">info@karakol-guide.kg</p></div>
            </div>
          </div>
          <form className="card p-6" onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold text-[var(--text)] mb-6">Напишите нам</h2>
            {sent && (
              <p className="mb-4 p-3 rounded-lg bg-green-50 text-green-800 text-sm">
                Сообщение отправлено! Администратор увидит его в панели управления.
              </p>
            )}
            <div className="space-y-4">
              <input className="input" required placeholder="Имя *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="input" type="email" required placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="input" placeholder="Телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="input" placeholder="Тема" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <textarea className="input min-h-[120px]" required placeholder="Сообщение *" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
              <Send size={18} /> Отправить
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
