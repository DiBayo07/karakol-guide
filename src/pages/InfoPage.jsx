import PageHero from '../components/PageHero'
import { useLanguage } from '../context/LanguageContext'
import { getInfoSections } from '../i18n'

export default function InfoPage() {
  const { lang, t } = useLanguage()
  const sections = getInfoSections(lang)

  return (
    <>
      <PageHero
        title={t('info.title')}
        subtitle={t('info.subtitle')}
        crumbs={[t('info.crumb')]}
      />
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          {sections.map((sec) => (
            <div key={sec.title} className="card p-6">
              <h2 className="font-serif text-xl font-semibold text-[var(--secondary)] mb-4">{sec.title}</h2>
              <ul className="space-y-2">
                {sec.items.map((item) => (
                  <li key={item} className="flex gap-2 text-[var(--text-light)]">
                    <span className="text-sky-600">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="card p-6 bg-[var(--bg-light)]">
            <h2 className="font-serif text-xl font-semibold text-[var(--secondary)] mb-2">{t('info.phrasesTitle')}</h2>
            <p className="text-[var(--text-light)] text-sm">{t('info.phrases')}</p>
          </div>
        </div>
      </section>
    </>
  )
}
