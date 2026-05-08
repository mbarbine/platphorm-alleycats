// Platphorm News Network Integration
// alleycats.platphormnews.com - Part of 130+ site network

export const NETWORK_CONFIG = {
  name: 'PlatPhorm News Network',
  rootSite: 'https://www.platphormnews.com',
  mcpHub: 'https://mcp.platphormnews.com',
  sitemapUrl: 'https://platphormnews.com/sitemap-main.xml',
  
  // This site
  thisSite: {
    domain: 'alleycats.platphormnews.com',
    name: 'Alleycats Alcove Zine',
    vertical: 'zines',
    description: 'Interactive digital zine reader supporting local artists',
    mcpEnabled: true,
    apiDocs: '/api/docs',
    health: '/api/health',
  },
  
  // Network siblings for cross-linking
  siblings: {
    ascii: {
      domain: 'ascii.platphormnews.com',
      name: 'ASCII Art Converter',
      description: 'Convert images to ASCII art',
      apiEndpoint: '/api/convert',
      mcpEnabled: true,
    },
    reader: {
      domain: 'reader.platphormnews.com', 
      name: 'Reader Translation',
      description: 'Instant translation magnifier with dictionary enrichment',
      apiEndpoint: '/api/v1/translate',
      mcpEnabled: true,
    },
    claws: {
      domain: 'claws.platphormnews.com',
      name: 'CLAWS Security Intelligence',
      description: 'Security threat data and policy information',
      apiEndpoint: '/api/threats',
      mcpEnabled: true,
    },
    quake: {
      domain: 'quake.platphormnews.com',
      name: 'Quake Stats',
      description: 'Live server statistics and player counts',
      mcpEnabled: true,
    },
    calendar: {
      domain: 'calendar.platphormnews.com',
      name: 'Events Calendar',
      description: 'Community events and scheduling',
      mcpEnabled: true,
    },
    monitor: {
      domain: 'monitor.platphormnews.com',
      name: 'Network Monitor',
      description: 'Platform-wide health and analytics',
      mcpEnabled: true,
    },
  },
  
  // Full network directory (from live API)
  directory: {
    atlas: { domain: 'atlas.platphormnews.com', vertical: 'analytics', mcp: true },
    calendar: { domain: 'calendar.platphormnews.com', vertical: 'productivity', mcp: true },
    cobol: { domain: 'cobol.platphormnews.com', vertical: 'tools', mcp: true },
    desa: { domain: 'desa.platphormnews.com', vertical: 'analytics', mcp: true },
    games: { domain: 'games.platphormnews.com', vertical: 'games', mcp: false },
    gta: { domain: 'gta.platphormnews.com', vertical: 'gaming', mcp: false },
    jobs: { domain: 'jobs.platphormnews.com', vertical: 'careers', mcp: true },
    kanban: { domain: 'kanban.platphormnews.com', vertical: 'productivity', mcp: true },
    monitor: { domain: 'monitor.platphormnews.com', vertical: 'infrastructure', mcp: true },
    onboard: { domain: 'onboard.platphormnews.com', vertical: 'tools', mcp: true },
    polymaths: { domain: 'polymaths.platphormnews.com', vertical: 'general', mcp: false },
    redteam: { domain: 'redteam.platphormnews.com', vertical: 'cybersecurity', mcp: true },
    reflux: { domain: 'reflux.platphormnews.com', vertical: 'commerce', mcp: true },
    svg: { domain: 'svg.platphormnews.com', vertical: 'tools', mcp: true },
    warm: { domain: 'warm.platphormnews.com', vertical: 'e-commerce', mcp: true },
    shipping: { domain: 'shipping.vanagain.com', vertical: 'ecommerce', mcp: true },
  },

  // Network stats (updated via API)
  stats: {
    totalSites: 130,
    mcpEnabledSites: 84,
    tools: 53,
    resources: 12,
    prompts: 9,
  },
  
  // Integration endpoints
  integrations: {
    asciiConvert: 'https://ascii.platphormnews.com/api/convert',
    translate: 'https://reader.platphormnews.com/api/v1/translate',
    clawsThreats: 'https://claws.platphormnews.com/api/threats',
    networkGraph: 'https://platphormnews.com/api/network/graph',
    mcpProxy: 'https://mcp.platphormnews.com/api/proxy',
  },
} as const

// ASCII Art integration - convert zine pages to ASCII
export async function convertToAscii(imageBase64: string, options?: {
  resolution?: number
  charset?: 'standard' | 'detailed' | 'blocks' | 'minimal' | 'binary' | 'matrix'
  inverted?: boolean
}) {
  const response = await fetch(NETWORK_CONFIG.integrations.asciiConvert, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: imageBase64,
      resolution: options?.resolution ?? 0.11,
      charset: options?.charset ?? 'standard',
      grayscale: true,
      inverted: options?.inverted ?? false,
    }),
  })
  
  if (!response.ok) {
    throw new Error(`ASCII conversion failed: ${response.statusText}`)
  }
  
  return response.json()
}

// Translation integration - translate zine content
export async function translateText(text: string, target: string, options?: {
  source?: string
  enrich?: boolean
}) {
  const response = await fetch(NETWORK_CONFIG.integrations.translate, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      target,
      source: options?.source ?? 'en',
      enrich: options?.enrich ?? false,
    }),
  })
  
  if (!response.ok) {
    throw new Error(`Translation failed: ${response.statusText}`)
  }
  
  return response.json()
}

// CLAWS security integration (Community-Led AI Web Security)
export async function checkClawsStatus(): Promise<{
  status: 'ok' | 'deploying' | 'error'
  message: string
  policies?: string[]
}> {
  try {
    const response = await fetch(`https://${NETWORK_CONFIG.siblings.claws.domain}/api/health`)
    if (!response.ok) {
      return { status: 'deploying', message: 'CLAWS is being deployed - security features coming soon' }
    }
    return response.json()
  } catch {
    return { status: 'deploying', message: 'CLAWS endpoint coming soon' }
  }
}

// Get CLAWS security policies (when available)
export async function getClawsPolicies(): Promise<{ policies: string[]; lastUpdated: string } | null> {
  try {
    const response = await fetch(`https://${NETWORK_CONFIG.siblings.claws.domain}/api/policies`)
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

// Network graph data
export async function getNetworkGraph() {
  const response = await fetch(NETWORK_CONFIG.integrations.networkGraph)
  return response.json()
}

// Community zine template for onboarding new zines
export interface CommunityZineTemplate {
  id: string
  title: string
  subtitle: string
  issue: number
  date: string
  theme: string
  location: string
  meetingInfo?: {
    day: string
    time: string
    venue: string
  }
  contributors: Array<{
    name: string
    handle?: string
    role: 'author' | 'artist' | 'editor' | 'organizer'
  }>
  tableOfContents: Array<{
    number: number
    title: string
    author: string
    page: number
  }>
  pages: Array<{
    number: number
    type: 'cover' | 'intro' | 'toc' | 'content' | 'spread' | 'credits' | 'back'
    image: string
    title?: string
    author?: string
    content?: string
  }>
  metadata: {
    printRun?: number
    paperSize?: string
    foldType?: string
    distribution?: string[]
  }
  network: {
    domain: string
    vertical: 'zines'
    parentSite: 'alleycats.platphormnews.com'
    mcpEnabled: boolean
  }
}

// Create empty zine template for new community submissions
export function createZineTemplate(overrides?: Partial<CommunityZineTemplate>): CommunityZineTemplate {
  return {
    id: `zine-${Date.now()}`,
    title: 'New Community Zine',
    subtitle: 'A collaborative zine',
    issue: 1,
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    theme: 'Open Theme',
    location: 'Earth',
    contributors: [],
    tableOfContents: [],
    pages: [],
    metadata: {
      paperSize: 'Half Letter',
      foldType: '8-page mini',
      distribution: ['local', 'digital'],
    },
    network: {
      domain: '',
      vertical: 'zines',
      parentSite: 'alleycats.platphormnews.com',
      mcpEnabled: true,
    },
    ...overrides,
  }
}
