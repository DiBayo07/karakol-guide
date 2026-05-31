import PageHero from '../components/PageHero'
import { INFO_SECTIONS } from '../data/content'

export default function InfoPage() {
  return (
    <>
      <PageHero
        title="Информация для туристов"
        subtitle="Транспорт, виза, сезоны, безопасность и полезные советы"
        crumbs={['Туристам']}
      />
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          {INFO_SECTIONS.map((sec) => (
            <div key={sec.title} className="card p-6">
              <h2 className="font-serif text-xl font-semibold text-[var(--secondary)] mb-4">{sec.title}</h2>
              <ul className="space-y-2">
                {sec.items.map((item) => (
                  <li key={item} className="flex gap-2 text-[var(--text-light)]">
                    <span className="text-[var(--primary)]">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="card p-6 bg-[var(--bg-light)]">
            <h2 className="font-serif text-xl font-semibold text-[var(--secondary)] mb-2">Полезные фразы</h2>
            <p className="text-[var(--text-light)] text-sm">
              Саламатсызбы — Здравствуйте · Рахмат — Спасибо · Канча турат? — Сколько стоит?
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
