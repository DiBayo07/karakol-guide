import { useAppData } from '../../context/AppDataContext'

export default function AdminMessagesPage() {
  const { messages } = useAppData()

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text)] mb-8">Сообщения с сайта</h1>
      {messages.length === 0 ? (
        <div className="card p-12 text-center text-[var(--muted)]">
          Пока нет сообщений. Они появятся после отправки формы на странице «Контакты».
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="card p-5">
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <span className="font-semibold">{m.name}</span>
                <span className="text-xs text-[var(--muted)]">
                  {new Date(m.date).toLocaleString('ru-RU')}
                </span>
              </div>
              <p className="text-sm text-[var(--primary-dark)]">{m.email}{m.phone ? ` · ${m.phone}` : ''}</p>
              {m.subject && <p className="text-sm font-medium mt-2">Тема: {m.subject}</p>}
              <p className="mt-2 text-[var(--text-light)]">{m.message}</p>
              <span className="inline-block mt-3 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                {m.status === 'new' ? 'Новое' : m.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
