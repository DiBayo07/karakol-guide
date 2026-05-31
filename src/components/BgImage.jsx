import { useState } from 'react'

const FALLBACK = '/images/mountains.jpg'

/**
 * Фоновое изображение (hero, карточки). Локальные файлы из /public/images.
 */
export default function BgImage({ src, alt = '', className = '', fallback = FALLBACK }) {
  const [url, setUrl] = useState(src || fallback)

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
      onError={() => {
        if (url !== fallback) setUrl(fallback)
      }}
    />
  )
}
