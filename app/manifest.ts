import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Alleycats Alcove Zine',
    short_name: 'Alleycats',
    description: 'A collaborative zine with substance from Front Royal, VA. Interactive digital reader for Issue #1.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#0a0810',
    theme_color: '#0a0810',
    categories: ['magazines', 'books', 'entertainment'],
    lang: 'en-US',
    dir: 'ltr',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-192x192.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/icon-512x512.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
      {
        src: '/icon-512x512.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.jpg',
        sizes: '180x180',
        type: 'image/jpeg',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Read Issue #1',
        short_name: 'Read',
        url: '/?read=true',
        description: 'Jump straight to reading Issue #1',
      },
      {
        name: 'Table of Contents',
        short_name: 'TOC',
        url: '/?toc=true',
        description: 'View the table of contents',
      },
    ],
    screenshots: [
      {
        src: '/og-image.jpg',
        sizes: '1200x630',
        type: 'image/jpeg',
        label: 'Alleycats Alcove Zine Reader',
      },
    ],
  }
}
