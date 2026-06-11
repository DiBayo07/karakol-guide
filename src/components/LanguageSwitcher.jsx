import { useLanguage } from '../context/LanguageContext'

export default function LanguageSwitcher({ className = '' }) {
  const { lang, setLang } = useLanguage()

  return (
    <div
      className={`inline-flex rounded-full border border-[var(--border)] bg-[var(--bg-card)] p-0.5 text-xs font-semibold ${className}`}
      role="group"
      aria-label="Language"
    >
      {['ru', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={`px-2.5 py-1 rounded-full uppercase tracking-wide transition-colors ${
            lang === code
              ? 'bg-amber-400 text-[#0a1628] shadow-sm'
              : 'text-[var(--text-light)] hover:text-sky-300'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
