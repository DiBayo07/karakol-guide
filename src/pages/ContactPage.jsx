import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Instagram } from 'lucide-react'
import PageHero from '../components/PageHero'
import { useAppData } from '../context/AppDataContext'
import { useLanguage } from '../context/LanguageContext'

export default function ContactPage() {
  const { submitMessage } = useAppData()
  const { t } = useLanguage()
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
      <PageHero title={t('contact.title')} subtitle={t('contact.subtitle')} crumbs={[t('contact.crumb')]} />
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="card p-5 flex gap-4">
              <MapPin className="text-sky-600 shrink-0" />
              <div><p className="font-semibold">{t('contact.address')}</p><p className="text-sm text-[var(--text-light)]">Karakol, Lenina 125</p></div>
            </div>
            <div className="card p-5 flex gap-4">
              <Phone className="text-sky-600 shrink-0" />
              <div><p className="font-semibold">{t('contact.phone')}</p><p className="text-sm text-[var(--text-light)]">+996 3922 5-55-55</p></div>
            </div>
            <div className="card p-5 flex gap-4">
              <Mail className="text-sky-600 shrink-0" />
              <div><p className="font-semibold">{t('contact.email')}</p><p className="text-sm text-[var(--text-light)]">info@karakol-guide.kg</p></div>
            </div>
            <a
              href="https://instagram.com/karakol_guide"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 flex gap-4 hover:border-amber-400/50 hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer"
            >
              <Instagram className="text-pink-500 shrink-0" />
              <div><p className="font-semibold">Instagram</p><p className="text-sm text-sky-400 hover:underline">@karakol_guide</p></div>
            </a>
            <a
              href="https://t.me/karakol_guide_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 flex gap-4 hover:border-amber-400/50 hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer"
            >
              <Send className="text-sky-400 shrink-0" />
              <div><p className="font-semibold">Telegram Bot</p><p className="text-sm text-sky-400 hover:underline">@karakol_guide_bot</p></div>
            </a>
          </div>
          <form className="card p-6" onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold text-[var(--text)] mb-6">{t('contact.formTitle')}</h2>
            {sent && (
              <p className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-sm border border-emerald-200">
                {t('contact.sent')}
              </p>
            )}
            <div className="space-y-4">
              <input className="input" required placeholder={t('contact.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="input" type="email" required placeholder={t('contact.emailPh')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="input" placeholder={t('contact.phonePh')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="input" placeholder={t('contact.subject')} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <textarea className="input min-h-[120px]" required placeholder={t('contact.message')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
              <Send size={18} /> {t('contact.send')}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
