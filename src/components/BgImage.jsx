import { useState, useEffect } from 'react'
import { withBase } from '../lib/basePath'

const FALLBACK = '/images/mountains.jpg'

/**
 * Фоновое изображение (hero, карточки). Локальные файлы из /public/images.
 */
export default function BgImage({ src, alt = '', className = '', fallback = FALLBACK }) {
  const getProcessedUrl = (path) => {
    if (!path) return withBase(fallback)
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path
    }
    return withBase(path)
  }

  const [url, setUrl] = useState(() => getProcessedUrl(src))

  useEffect(() => {
    setUrl(getProcessedUrl(src))
  }, [src])

  const handleOnError = () => {
    const fbUrl = getProcessedUrl(fallback)
    if (url !== fbUrl) {
      setUrl(fbUrl)
    }
  }

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
      onError={handleOnError}
    />
  )
}
