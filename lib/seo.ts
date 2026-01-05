import type { Metadata } from 'next'

export const siteConfig = {
  name: 'Context Graph Marketplace',
  description:
    'The marketplace for AI decision traces. Turn tribal knowledge into searchable precedent for autonomous agents. Join the waitlist for early access.',
  url: 'https://contextgraph.tech',
  email: 'hello@daydayup.co',
  keywords: [
    'context graph',
    'context graph marketplace',
    'AI agents',
    'decision traces',
    'tribal knowledge',
    'systems of record',
    'AI decision lineage',
    'agent orchestration',
    'enterprise AI',
    'AI memory',
  ],
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Coming Soon`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - AI's Trillion-Dollar Opportunity`,
    description: siteConfig.description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Coming Soon`,
    description: siteConfig.description,
    images: ['/og-image.png'],
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
}

export function generateJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: `${siteConfig.url}/logo.svg`,
      email: siteConfig.email,
    },
  }
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.svg`,
    description: siteConfig.description,
    email: siteConfig.email,
    sameAs: [
      'https://twitter.com/contextgraph',
      'https://github.com/contextgraph',
      'https://linkedin.com/company/contextgraph',
    ],
  }
}
