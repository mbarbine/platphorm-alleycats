'use client'

import { useState, useCallback } from 'react'
import { Download, FileText, Image as ImageIcon, Share2, Check, Copy, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { alleycatsZine, tableOfContents } from '@/lib/zine-data'

interface DownloadDialogProps {
  trigger?: React.ReactNode
}

export function DownloadDialog({ trigger }: DownloadDialogProps) {
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleDownloadText = useCallback(async () => {
    setIsDownloading('text')
    
    const content = `
═══════════════════════════════════════════════════════════════
                    ${alleycatsZine.title.toUpperCase()}
                    ${alleycatsZine.subtitle}
═══════════════════════════════════════════════════════════════

Issue #${alleycatsZine.issue} | ${alleycatsZine.date}
Theme: "${alleycatsZine.theme}"

Part of the Platphorm News Network
zine540.platphormnews.com

═══════════════════════════════════════════════════════════════
                        TABLE OF CONTENTS
═══════════════════════════════════════════════════════════════

${tableOfContents.map(item => `  ${item.number}. ${item.title}
     by ${item.author}`).join('\n\n')}

═══════════════════════════════════════════════════════════════
                         INTRODUCTION
═══════════════════════════════════════════════════════════════

This zine here comes from a little group calling themselves the 
"Writer's Alcove". They meet on Friday evenings before Karaoke 
starts and do their little exercises. One day, they decided, 
"F#%ck it! Let's start a zine!" and this is the accumulation 
of some of that.

So, welcome to our first monthly Alley Cats Alcove zine, to 
and from the local literary community. This month's theme was 
"A Letter to A Substance", where the submissions were 
influenced by influences.

We hope you enjoy and are able to find a little inspiration 
in these works.

Not to use substances... but to write!

═══════════════════════════════════════════════════════════════
                         NEXT ISSUE
═══════════════════════════════════════════════════════════════

Next month's theme will be "Wildest Dreams" - meaning the 
strange things you see in your subconscious, some insane 
aspirations, or... maybe that one dream you had about 
Billy's mom...

Submissions will be due on May 15th and can be submitted 
to the Writer's Alcove.

═══════════════════════════════════════════════════════════════
                          CREDITS
═══════════════════════════════════════════════════════════════

Cover art was hand-drawn by Sam Rusnak.
Special thanks to Chris Kemp for showing us how to make a zine.

Writer's Alcove Fridays 5:30-7:00

═══════════════════════════════════════════════════════════════
                     SUPPORT LOCAL ARTISTS
═══════════════════════════════════════════════════════════════

Thank you for reading! Support local artists and independent
publications. Visit zine540.platphormnews.com for more.

© 2026 Alleycats Alcove | Platphorm News Network
    `.trim()

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500))

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `alleycats-alcove-issue-${alleycatsZine.issue}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setIsDownloading(null)
  }, [])

  const handleDownloadHTML = useCallback(async () => {
    setIsDownloading('html')
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${alleycatsZine.title} - Issue #${alleycatsZine.issue}</title>
  <style>
    :root {
      --bg: #0f0a14;
      --fg: #fafafa;
      --primary: #e85a4f;
      --accent: #d4618c;
      --muted: #9ca3af;
      --card: #1a1520;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Georgia', serif;
      background: var(--bg);
      color: var(--fg);
      line-height: 1.6;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    h1, h2, h3 { font-family: 'Oswald', sans-serif; }
    .header {
      text-align: center;
      padding: 4rem 0;
      border-bottom: 1px solid var(--card);
    }
    .header h1 {
      font-size: 3rem;
      color: var(--fg);
      margin-bottom: 0.5rem;
    }
    .header h1 span { color: var(--primary); }
    .header p { color: var(--muted); font-style: italic; }
    .meta {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 1.5rem;
      color: var(--accent);
    }
    .section {
      padding: 3rem 0;
      border-bottom: 1px solid var(--card);
    }
    .section h2 {
      color: var(--primary);
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .toc-item {
      padding: 1rem 0;
      border-bottom: 1px solid var(--card);
    }
    .toc-item:last-child { border-bottom: none; }
    .toc-number { color: var(--primary); font-weight: bold; margin-right: 0.5rem; }
    .toc-author { color: var(--muted); font-size: 0.9rem; }
    .intro { font-size: 1.1rem; }
    .intro p { margin-bottom: 1rem; }
    .credits { text-align: center; color: var(--muted); }
    .credits p { margin-bottom: 0.5rem; }
    .footer {
      text-align: center;
      padding: 2rem 0;
      color: var(--muted);
      font-size: 0.9rem;
    }
    a { color: var(--primary); }
    @media print {
      body { background: white; color: black; }
      .header h1, .section h2, .toc-number { color: #333; }
    }
  </style>
</head>
<body>
  <header class="header">
    <h1>ALLEYCATS <span>ALCOVE</span></h1>
    <p>${alleycatsZine.subtitle}</p>
    <div class="meta">
      <span>Issue #${alleycatsZine.issue}</span>
      <span>${alleycatsZine.date}</span>
    </div>
    <p style="margin-top: 1rem; color: var(--accent);">Theme: "${alleycatsZine.theme}"</p>
  </header>

  <section class="section">
    <h2>Table of Contents</h2>
    ${tableOfContents.map(item => `
    <div class="toc-item">
      <span class="toc-number">${item.number}.</span>
      <span class="toc-title">${item.title}</span>
      <div class="toc-author">by ${item.author}</div>
    </div>`).join('')}
  </section>

  <section class="section intro">
    <h2>Introduction</h2>
    <p>This zine here comes from a little group calling themselves the "Writer's Alcove". They meet on Friday evenings before Karaoke starts and do their little exercises. One day, they decided, "F#%ck it! Let's start a zine!" and this is the accumulation of some of that.</p>
    <p>So, welcome to our first monthly Alley Cats Alcove zine, to and from the local literary community. This month's theme was "A Letter to A Substance", where the submissions were influenced by influences.</p>
    <p>We hope you enjoy and are able to find a little inspiration in these works.</p>
    <p><strong style="color: var(--primary);">Not to use substances... but to write!</strong></p>
  </section>

  <section class="section">
    <h2>Next Issue</h2>
    <p>Next month's theme will be <strong>"Wildest Dreams"</strong> - meaning the strange things you see in your subconscious, some insane aspirations, or... maybe that one dream you had about Billy's mom...</p>
    <p style="margin-top: 1rem;">Submissions will be due on May 15th and can be submitted to the Writer's Alcove.</p>
  </section>

  <section class="section credits">
    <h2>Credits</h2>
    <p>Cover art was hand-drawn by <strong>Sam Rusnak</strong></p>
    <p>Special thanks to <strong>Chris Kemp</strong> for showing us how to make a zine.</p>
    <p style="margin-top: 1.5rem; color: var(--accent);">Writer's Alcove Fridays 5:30-7:00</p>
  </section>

  <footer class="footer">
    <p>&copy; 2026 Alleycats Alcove | Platphorm News Network</p>
    <p><a href="https://zine540.platphormnews.com">zine540.platphormnews.com</a></p>
  </footer>
</body>
</html>`

    await new Promise(resolve => setTimeout(resolve, 500))

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `alleycats-alcove-issue-${alleycatsZine.issue}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setIsDownloading(null)
  }, [])

  const handleDownloadJSON = useCallback(async () => {
    setIsDownloading('json')
    
    const data = {
      ...alleycatsZine,
      tableOfContents,
      exportedAt: new Date().toISOString(),
      source: 'zine540.platphormnews.com',
    }

    await new Promise(resolve => setTimeout(resolve, 300))

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `alleycats-alcove-issue-${alleycatsZine.issue}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setIsDownloading(null)
  }, [])

  const handleShare = useCallback(async () => {
    const shareData = {
      title: `${alleycatsZine.title} - Issue #${alleycatsZine.issue}`,
      text: `${alleycatsZine.subtitle} | Theme: "${alleycatsZine.theme}"`,
      url: 'https://zine540.platphormnews.com',
    }

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled or share failed
        console.log('[v0] Share cancelled or failed:', err)
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText('https://zine540.platphormnews.com')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
            <Download className="h-5 w-5" />
            <span className="sr-only">Download zine</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Download Zine</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Export {alleycatsZine.title} Issue #{alleycatsZine.issue} in your preferred format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-3 py-4">
          <button
            onClick={handleDownloadText}
            disabled={isDownloading === 'text'}
            className="flex items-center gap-4 p-4 rounded-lg border border-border bg-background hover:bg-muted hover:border-primary/50 transition-colors text-left group"
          >
            <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {isDownloading === 'text' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">Plain Text (.txt)</p>
              <p className="text-sm text-muted-foreground">Simple text format for reading anywhere</p>
            </div>
          </button>

          <button
            onClick={handleDownloadHTML}
            disabled={isDownloading === 'html'}
            className="flex items-center gap-4 p-4 rounded-lg border border-border bg-background hover:bg-muted hover:border-primary/50 transition-colors text-left group"
          >
            <div className="p-2 rounded-md bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              {isDownloading === 'html' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ImageIcon className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">Printable HTML</p>
              <p className="text-sm text-muted-foreground">Styled page you can print or save as PDF</p>
            </div>
          </button>

          <button
            onClick={handleDownloadJSON}
            disabled={isDownloading === 'json'}
            className="flex items-center gap-4 p-4 rounded-lg border border-border bg-background hover:bg-muted hover:border-primary/50 transition-colors text-left group"
          >
            <div className="p-2 rounded-md bg-chart-3/20 text-chart-3 group-hover:bg-chart-3 group-hover:text-foreground transition-colors">
              {isDownloading === 'json' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">Data Export (.json)</p>
              <p className="text-sm text-muted-foreground">Full zine data for developers</p>
            </div>
          </button>

          <div className="border-t border-border pt-3 mt-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-4 p-4 rounded-lg border border-border bg-background hover:bg-muted hover:border-primary/50 transition-colors text-left group w-full"
            >
              <div className="p-2 rounded-md bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {copied ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Share2 className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {copied ? 'Link Copied!' : 'Share Zine'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {copied ? 'zine540.platphormnews.com' : 'Share with friends and support local artists'}
                </p>
              </div>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
