// ASCII art utilities for the Alleycats Alcove zine reader
// Integrates with ascii.platphormnews.com

import { SITE_CONFIG, NEWS_CONTEXT } from './zine-data'

export const ASCII_API = SITE_CONFIG.ascii.endpoint

// Fetch ASCII conversion from the backend
export async function convertToAscii(
  input: string, 
  type: 'text' | 'image' = 'text',
  options?: { width?: number; chars?: string }
): Promise<string> {
  try {
    const params = new URLSearchParams({
      input,
      type,
      width: String(options?.width || 80),
      chars: options?.chars || '@%#*+=-:. ',
    })
    
    const response = await fetch(`${ASCII_API}/api/convert?${params}`)
    if (!response.ok) throw new Error('ASCII conversion failed')
    
    const data = await response.json()
    return data.ascii || data.result || input
  } catch {
    // Fallback to local conversion
    return type === 'text' ? textToAscii(input) : imageToAsciiPlaceholder()
  }
}

// Get themed ASCII banner for sharing
export function getShareBanner(): string {
  const countdown = getDaysUntilNextIssue()
  return `
${ASCII_ART.divider}
${ASCII_ART.logo}
${ASCII_ART.divider}

  Issue #1: "A Letter to A Substance"
  May 2026 | ${SITE_CONFIG.location}
  
  ${countdown.days} days until Issue #2: "${NEWS_CONTEXT.nextIssue.theme}"

${ASCII_ART.divider}
  ${SITE_CONFIG.domain}
${ASCII_ART.divider}
`
}

// Pre-made ASCII art for key elements
export const ASCII_ART = {
  logo: `
    _    _ _                      _       
   / \\  | | | ___ _   _  ___ __ _| |_ ___ 
  / _ \\ | | |/ _ \\ | | |/ __/ _\` | __/ __|
 / ___ \\| | |  __/ |_| | (_| (_| | |_\\__ \\
/_/   \\_\\_|_|\\___|\\__, |\\___\\__,_|\\__|___/
                  |___/      ALCOVE       
`,
  cat: `
     /\\_/\\  
    ( o.o ) 
     > ^ <  
    /|   |\\
   (_|   |_)
`,
  catDrinking: `
     /\\_/\\    ___
    ( o.o )  |   |
     > ^ <   |~~~|
    /|   |\\  |   |
   (_|   |_) |___|
`,
  divider: `════════════════════════════════════════`,
  border: {
    topLeft: '╔',
    topRight: '╗',
    bottomLeft: '╚',
    bottomRight: '╝',
    horizontal: '═',
    vertical: '║',
  },
  pageIndicator: (current: number, total: number) => {
    const filled = '●'
    const empty = '○'
    return Array.from({ length: total }, (_, i) => 
      i === current ? filled : empty
    ).join(' ')
  },
  frame: (text: string, width = 40) => {
    const lines = text.split('\n')
    const maxLen = Math.max(...lines.map(l => l.length), width)
    const top = '╔' + '═'.repeat(maxLen + 2) + '╗'
    const bottom = '╚' + '═'.repeat(maxLen + 2) + '╝'
    const middle = lines.map(line => 
      '║ ' + line.padEnd(maxLen) + ' ║'
    ).join('\n')
    return `${top}\n${middle}\n${bottom}`
  },
}

// Convert text to basic ASCII art (simple block letters)
export function textToAscii(text: string): string {
  const letters: Record<string, string[]> = {
    'A': ['  A  ', ' A A ', 'AAAAA', 'A   A', 'A   A'],
    'B': ['BBBB ', 'B   B', 'BBBB ', 'B   B', 'BBBB '],
    'C': [' CCC ', 'C    ', 'C    ', 'C    ', ' CCC '],
    'E': ['EEEEE', 'E    ', 'EEE  ', 'E    ', 'EEEEE'],
    'I': ['IIIII', '  I  ', '  I  ', '  I  ', 'IIIII'],
    'L': ['L    ', 'L    ', 'L    ', 'L    ', 'LLLLL'],
    'O': [' OOO ', 'O   O', 'O   O', 'O   O', ' OOO '],
    'S': [' SSS ', 'S    ', ' SSS ', '    S', ' SSS '],
    'T': ['TTTTT', '  T  ', '  T  ', '  T  ', '  T  '],
    'U': ['U   U', 'U   U', 'U   U', 'U   U', ' UUU '],
    'Y': ['Y   Y', ' Y Y ', '  Y  ', '  Y  ', '  Y  '],
    ' ': ['     ', '     ', '     ', '     ', '     '],
  }
  
  const chars = text.toUpperCase().split('')
  const lines: string[] = ['', '', '', '', '']
  
  chars.forEach(char => {
    const art = letters[char] || letters[' ']
    art.forEach((line, i) => {
      lines[i] += line + ' '
    })
  })
  
  return lines.join('\n')
}

// Calculate days until next issue
export function getDaysUntilNextIssue(): { days: number; month: string; issueNumber: number } {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  // Issue #1 was May 2026
  const baseMonth = 4 // May (0-indexed)
  const baseYear = 2026
  
  // Calculate next first Friday
  let targetMonth = currentMonth + 1
  let targetYear = currentYear
  if (targetMonth > 11) {
    targetMonth = 0
    targetYear++
  }
  
  // Find first Friday
  const firstDay = new Date(targetYear, targetMonth, 1)
  const dayOfWeek = firstDay.getDay()
  const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 5 + (7 - dayOfWeek)
  const firstFriday = new Date(targetYear, targetMonth, 1 + daysUntilFriday)
  
  const diffTime = firstFriday.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // Calculate issue number based on months since May 2026
  const monthsSinceBase = (targetYear - baseYear) * 12 + (targetMonth - baseMonth)
  const issueNumber = monthsSinceBase + 1
  
  return {
    days: Math.max(0, diffDays),
    month: firstFriday.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    issueNumber,
  }
}

// Issue themes (for future issues)
export const ISSUE_THEMES: Record<number, string> = {
  1: 'A Letter to A Substance',
  2: 'Wildest Dreams',
  3: 'TBD',
}

// ASCII loading animation frames
export const LOADING_FRAMES = [
  '( o.o )',
  '( o.O )',
  '( O.o )',
  '( O.O )',
  '( o.o )',
  '( -.o )',
  '( o.- )',
  '( -.- )',
]

// Convert image description to ASCII placeholder
export function imageToAsciiPlaceholder(pageType: string): string {
  const placeholders: Record<string, string> = {
    cover: `
┌─────────────────────────┐
│    ╔═══════════════╗    │
│    ║  ALLEYCATS    ║    │
│    ║    ALCOVE     ║    │
│    ╚═══════════════╝    │
│         /\\_/\\           │
│        ( o.o )          │
│         > ^ <           │
│    ═══════════════      │
│   A Collaborative Zine  │
│     with Substance      │
│                  #1     │
└─────────────────────────┘
`,
    spread: `
┌─────────────┬─────────────┐
│             │             │
│   ░░░░░░░   │   TEXT      │
│   ░IMAGE░   │   CONTENT   │
│   ░░░░░░░   │   HERE      │
│             │             │
└─────────────┴─────────────┘
`,
    single: `
┌─────────────────────────┐
│                         │
│   ░░░░░░░░░░░░░░░░░░   │
│   ░░░░░░░░░░░░░░░░░░   │
│   ░░░░ IMAGE ░░░░░░░   │
│   ░░░░░░░░░░░░░░░░░░   │
│   ░░░░░░░░░░░░░░░░░░   │
│                         │
│   Title / Content       │
│                         │
└─────────────────────────┘
`,
    toc: `
┌─────────────────────────┐
│   TABLE OF CONTENTS     │
│   ═══════════════════   │
│   1. ................   │
│   2. ................   │
│   3. ................   │
│   4. ................   │
│   5. ................   │
│   6. ................   │
│   7. ................   │
│   8. ................   │
└─────────────────────────┘
`,
    back: `
┌─────────────────────────┐
│                         │
│        /\\_/\\           │
│       ( o.o )           │
│        > ^ <            │
│                         │
│   "Where's my vape?!"   │
│                         │
│   ALLEYCATS ALCOVE      │
│      ZINE - #1          │
│      May 2026           │
└─────────────────────────┘
`,
  }
  
  return placeholders[pageType] || placeholders.single
}
