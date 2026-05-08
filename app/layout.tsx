import type { Metadata, Viewport } from 'next'
import { Oswald, Source_Serif_4 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const oswald = Oswald({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({ 
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const baseUrl = 'https://alleycats.platphormnews.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Alleycats Alcove Zine | Interactive Digital Zine Reader',
    template: '%s | Alleycats Alcove Zine'
  },
  description: 'A collaborative zine with substance from Front Royal, VA. Issue #1 features 8 pieces by local Shenandoah Valley artists. Theme: "A Letter to A Substance". Interactive digital reader.',
  generator: 'v0.app',
  applicationName: 'Alleycats Alcove Zine',
  keywords: [
    'zine', 'digital zine', 'interactive reader', 'local artists', 'underground literature',
    'creative writing', 'poetry', 'alleycats', 'alcove', 'collaborative art',
    'writers alcove', 'literary magazine', 'indie publishing', 'DIY zine',
    // Local - Front Royal, VA (540)
    'front royal virginia', 'shenandoah valley arts', '540 area code', 'virginia zine',
    'small town publishing', 'appalachian literature', 'blue ridge arts',
    // Search keywords / domain aliases
    'main street front royal', 'frontroyal zine', 'zine 540', 'alleycats alcove',
    'alleycatsalcove', 'front royal arts', 'writers alcove front royal',
    // Spanish
    'revista digital', 'arte local', 'literatura underground', 'escritura creativa',
    // French  
    'magazine numérique', 'artistes locaux', 'littérature underground', 'écriture créative'
  ],
  authors: [
    { name: 'Alleycats Alcove' },
    { name: 'H.B. Manion' },
    { name: 'Simone Endress' },
    { name: 'chris.unkempt' },
    { name: 'Mark Reeves' },
    { name: 'Julieta Hernandez' },
    { name: 'Phil Taylor' },
    { name: 'Sam Rusnak' },
  ],
  creator: 'Alleycats Alcove',
  publisher: 'Alleycats Alcove',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'en-US': baseUrl,
      'es-US': `${baseUrl}?lang=es`,
      'fr-CA': `${baseUrl}?lang=fr`,
      'x-default': baseUrl,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_US', 'fr_CA'],
    url: baseUrl,
    siteName: 'Alleycats Alcove Zine',
    title: 'Alleycats Alcove Zine | Issue #1',
    description: 'A collaborative zine with substance. Interactive digital reader featuring 8 pieces by local artists.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Alleycats Alcove Zine Issue #1 - A Letter to A Substance',
        type: 'image/png',
      },
      {
        url: '/api/og?variant=countdown',
        width: 1200,
        height: 630,
        alt: 'Days until Alleycats Alcove Issue #2',
        type: 'image/png',
      },
      {
        url: '/api/og?variant=ascii',
        width: 1200,
        height: 630,
        alt: 'Alleycats Alcove ASCII Art',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alleycats Alcove Zine | Issue #1',
    description: 'A collaborative zine with substance. 8 pieces by local artists.',
    images: ['/og-image.jpg'],
    creator: '@alleycatsalcove',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'literature',
  classification: 'Digital Magazine / Zine',
  other: {
    // Front Royal, VA - 540 area code
    'geo.region': 'US-VA',
    'geo.placename': 'Front Royal, Virginia',
    'geo.position': '38.918;-78.194',
    'ICBM': '38.918, -78.194',
    'content-language': 'en-US, es-US, fr-CA',
    // Local community zine metadata
    'dc.coverage': 'Shenandoah Valley, Virginia, USA',
    'dc.type': 'Interactive Magazine',
    'dc.date.issued': '2026-05-01',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0810' },
  ],
  colorScheme: 'dark light',
}

// Enhanced JSON-LD with multilingual support
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Periodical',
      '@id': `${baseUrl}/#periodical`,
      name: 'Alleycats Alcove Zine',
      alternateName: ['Alleycats Alcove', 'AAZ'],
      description: 'A collaborative zine with substance. Interactive digital zine reader supporting local artists.',
      url: baseUrl,
      inLanguage: ['en-US', 'es-US', 'fr-CA'],
      genre: ['Literature', 'Poetry', 'Creative Writing', 'Underground Art', 'Indie Publishing'],
      audience: {
        '@type': 'Audience',
        audienceType: 'Readers, Writers, Artists, Literature Enthusiasts',
      },
      hasPart: {
        '@type': 'PublicationIssue',
        issueNumber: '1',
        datePublished: '2026-05',
        name: 'A Letter to A Substance',
      },
    },
    {
      '@type': 'WebApplication',
      '@id': `${baseUrl}/#webapp`,
      name: 'Alleycats Alcove Digital Reader',
      description: 'Premium interactive digital zine reader with zoom, multiple reading modes, and download support.',
      url: baseUrl,
      applicationCategory: 'ReaderApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript, Modern browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Interactive page navigation',
        'Swipe gestures support',
        'Multiple reading modes (Dark, Sepia, Light)',
        'Zoom functionality',
        'Fullscreen mode',
        'Download as PDF/Text/HTML',
        'Mobile-first responsive design',
        'Keyboard shortcuts',
      ],
    },
    {
      '@type': 'CreativeWorkSeries',
      name: 'Alleycats Alcove Zine Series',
      description: 'Monthly collaborative zine from the Writer\'s Alcove',
      url: baseUrl,
      creator: {
        '@type': 'Organization',
        name: 'The Writer\'s Alcove',
        description: 'A group of writers meeting Friday evenings before Karaoke',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Alleycats Alcove Zine?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Alleycats Alcove is a collaborative zine created by local writers who meet Friday evenings at the Writer\'s Alcove. Each issue features creative writing around a specific theme.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can I read the zine?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can read the zine directly in your browser using our interactive digital reader. The reader supports swipe gestures, zoom, multiple reading modes, and full-screen viewing.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I download the zine?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! You can download the zine in multiple formats including PDF, HTML, and plain text using the download button in the reader.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can I submit to the zine?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Submissions are due on the 15th of each month and can be submitted to the Writer\'s Alcove. Each month has a different theme - check our latest issue for upcoming themes.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Icons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.jpg" />
        {/* Humans & RSS */}
        <link rel="author" href="/humans.txt" type="text/plain" />
        <link rel="alternate" type="application/rss+xml" title="Alleycats Alcove RSS" href="/feed.xml" />
        {/* Language alternates */}
        <link rel="alternate" hrefLang="en-US" href={baseUrl} />
        <link rel="alternate" hrefLang="es-US" href={`${baseUrl}?lang=es`} />
        <link rel="alternate" hrefLang="fr-CA" href={`${baseUrl}?lang=fr`} />
        <link rel="alternate" hrefLang="x-default" href={baseUrl} />
      </head>
      <body className={`${oswald.variable} ${sourceSerif.variable} font-sans antialiased`}>
        {/* Skip to content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none"
        >
          Skip to content
        </a>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
