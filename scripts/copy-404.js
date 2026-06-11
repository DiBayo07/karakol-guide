import { copyFileSync } from 'node:fs'

// GitHub Pages: для /karakol-guide/routes отдаёт 404.html = тот же SPA
copyFileSync('dist/index.html', 'dist/404.html')
console.log('404.html created for GitHub Pages SPA routing')
