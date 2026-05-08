import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// Calculate days until next issue (first Friday of each month)
function getDaysUntilNextIssue(): number {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  // Find first Friday of next month
  let targetMonth = currentMonth + 1
  let targetYear = currentYear
  if (targetMonth > 11) {
    targetMonth = 0
    targetYear++
  }
  
  const firstDay = new Date(targetYear, targetMonth, 1)
  const dayOfWeek = firstDay.getDay()
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7
  const firstFriday = new Date(targetYear, targetMonth, 1 + daysUntilFriday)
  
  // If first Friday is day 1 and dayOfWeek is 5 (Friday), that's it
  if (daysUntilFriday === 0) {
    firstFriday.setDate(1)
  }
  
  const diffTime = firstFriday.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return Math.max(0, diffDays)
}

function getNextIssueMonth(): string {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return nextMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const theme = searchParams.get('theme') || 'default'
  const page = searchParams.get('page')
  const variant = searchParams.get('variant') || 'main' // main, countdown, page, ascii
  
  const daysUntil = getDaysUntilNextIssue()
  const nextIssue = getNextIssueMonth()
  
  // ASCII art cat for ASCII variant
  const asciiCat = `
    /\\_/\\  
   ( o.o ) 
    > ^ <
  `

  // Color schemes
  const themes = {
    default: {
      bg: 'linear-gradient(135deg, #0f0a1a 0%, #1a0f2e 50%, #0f0a1a 100%)',
      accent: '#e84393',
      text: '#ffffff',
      muted: '#a0a0a0',
    },
    ascii: {
      bg: '#000000',
      accent: '#00ff00',
      text: '#00ff00',
      muted: '#008800',
    },
    sepia: {
      bg: 'linear-gradient(135deg, #f4ecd8 0%, #e8dcc8 100%)',
      accent: '#8b4513',
      text: '#2c1810',
      muted: '#5c4030',
    },
  }
  
  const colors = themes[theme as keyof typeof themes] || themes.default

  if (variant === 'countdown') {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: colors.bg,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 32, color: colors.muted, marginBottom: 16 }}>
              ALLEYCATS ALCOVE
            </div>
            <div style={{ fontSize: 120, fontWeight: 'bold', color: colors.accent }}>
              {daysUntil}
            </div>
            <div style={{ fontSize: 36, color: colors.text, marginTop: 8 }}>
              days until Issue #2
            </div>
            <div style={{ fontSize: 24, color: colors.muted, marginTop: 16 }}>
              {nextIssue} - "Wildest Dreams"
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }

  if (variant === 'ascii') {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000000',
            fontFamily: 'monospace',
          }}
        >
          <pre style={{ fontSize: 48, color: '#00ff00', marginBottom: 24 }}>
            {asciiCat}
          </pre>
          <div style={{ fontSize: 64, fontWeight: 'bold', color: '#00ff00', letterSpacing: 8 }}>
            ALLEYCATS ALCOVE
          </div>
          <div style={{ fontSize: 32, color: '#008800', marginTop: 16 }}>
            Issue #1 - A Letter to A Substance
          </div>
          <div style={{ fontSize: 24, color: '#006600', marginTop: 24 }}>
            ascii.platphormnews.com/zine
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }

  if (variant === 'page' && page) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: colors.bg,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ fontSize: 24, color: colors.muted, marginBottom: 16 }}>
            ALLEYCATS ALCOVE - Issue #1
          </div>
          <div style={{ fontSize: 72, fontWeight: 'bold', color: colors.text }}>
            Page {page}
          </div>
          <div style={{ fontSize: 32, color: colors.accent, marginTop: 24 }}>
            "A Letter to A Substance"
          </div>
          <div style={{ 
            display: 'flex', 
            gap: 8, 
            marginTop: 32,
            alignItems: 'center',
          }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: parseInt(page) === i + 1 ? 24 : 12,
                  height: parseInt(page) === i + 1 ? 24 : 12,
                  borderRadius: '50%',
                  background: parseInt(page) === i + 1 ? colors.accent : colors.muted,
                }}
              />
            ))}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }

  // Default main OG image
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: colors.bg,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Left side - Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 80px',
          }}
        >
          <div style={{ 
            fontSize: 18, 
            color: colors.accent, 
            textTransform: 'uppercase',
            letterSpacing: 4,
            marginBottom: 16,
          }}>
            Issue #1 - May 2026
          </div>
          
          <div style={{ 
            fontSize: 72, 
            fontWeight: 'bold', 
            color: colors.text,
            lineHeight: 1.1,
            marginBottom: 24,
          }}>
            ALLEYCATS
            <br />
            ALCOVE
          </div>
          
          <div style={{ 
            fontSize: 28, 
            color: colors.muted,
            marginBottom: 32,
          }}>
            A Collaborative Zine with Substance
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}>
            <div style={{
              padding: '12px 24px',
              background: colors.accent,
              color: '#ffffff',
              borderRadius: 50,
              fontSize: 18,
              fontWeight: 'bold',
            }}>
              READ NOW
            </div>
            <div style={{ fontSize: 18, color: colors.muted }}>
              {daysUntil} days until Issue #2
            </div>
          </div>
        </div>
        
        {/* Right side - Visual accent */}
        <div
          style={{
            width: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)',
          }}
        >
          <div style={{
            fontSize: 180,
            fontWeight: 'bold',
            color: colors.accent,
            opacity: 0.3,
          }}>
            #1
          </div>
          <div style={{
            fontSize: 20,
            color: colors.muted,
            textAlign: 'center',
            marginTop: 16,
          }}>
            "A Letter to
            <br />
            A Substance"
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
