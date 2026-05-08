# Alleycats Alcove Zine Reader

> **A Collaborative Zine with Substance** - Interactive digital zine reader supporting local artists.

Part of the [Platphorm News Network](https://platphormnews.com) (130+ sites, MCP-powered, AI-ready).

**Live:** [alleycats.platphormnews.com](https://alleycats.platphormnews.com)

## Issue #1 - May 2026

**Theme:** "A Letter to A Substance"

### Table of Contents

1. A Love Letter to Cigarettes - H.B. Manion
2. Did You Know That They Make Liquid Cocaine? - Simone Endress
3. Town So New, Whiskey So Old - chris.unkempt
4. Champagne Explosion - Mark Reeves
5. A Vape is Like a Lover - Julieta Hernandez
6. Peach Schnapp'd - chris.unkempt
7. To My Dearest Beloved Disgusting and Vile Mistress Caffeine - Phil Taylor
8. Sitting On The Toilet, Waiting To Die - Sam Rusnak

**Cover Art:** Sam Rusnak  
**Meeting:** Writer's Alcove Fridays, 5:30-7:00  
**Next Issue Theme:** "Wildest Dreams"

---

## Features

- **Premium E-Reader Experience** - Swipe/gesture navigation, keyboard shortcuts, zoom controls
- **Three Reading Modes** - Dark, Sepia, Light
- **Download/Export** - Plain text, styled HTML (print-ready PDF), JSON data
- **Cinematic Intro** - Rockstar Games-style scroll reveal
- **Mobile-First** - Touch-optimized, responsive on all devices
- **Multilingual SEO** - EN/ES/FR support with hreflang

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check with roadmap |
| `GET /api/docs` | OpenAPI 3.1 specification |
| `GET /api/v1/zine` | Full zine metadata and TOC |
| `GET /api/v1/zine/pages/:n` | Individual page data |
| `GET /api/v1/contributors` | Artist/author directory |
| `POST /api/v1/ascii` | Convert page to ASCII art |
| `GET /api/mcp` | MCP server capabilities |
| `POST /api/mcp` | Execute MCP tools |

## Discovery Endpoints

| Endpoint | Description |
|----------|-------------|
| `/llms.txt` | LLM discovery file |
| `/llms-full.txt` | Extended LLM discovery |
| `/feed.xml` | RSS 2.0 feed |
| `/sitemap.xml` | XML sitemap with alternates |
| `/robots.txt` | Crawler directives |
| `/manifest.webmanifest` | PWA manifest |

## Network Integration

Integrated with the Platphorm News Network:

- **[ascii.platphormnews.com](https://ascii.platphormnews.com)** - ASCII art conversion
- **[reader.platphormnews.com](https://reader.platphormnews.com)** - Translation services
- **[claws.platphormnews.com](https://claws.platphormnews.com)** - Security intelligence
- **[mcp.platphormnews.com](https://mcp.platphormnews.com)** - Central MCP Hub

## MCP Tools Available

```json
{
  "tools": [
    "get_zine_info",
    "get_zine_page",
    "list_contributors",
    "get_table_of_contents",
    "convert_page_to_ascii"
  ]
}
```

## Community Zine Onboarding

This platform is designed to onboard community zines. See `/lib/platphorm-network.ts` for the `CommunityZineTemplate` interface.

### Requirements for New Zines:
1. 8-20 page spreads (photographed or scanned)
2. Table of contents with author credits
3. Meeting/submission info (optional)
4. Cover art attribution

## Development

```bash
pnpm install
pnpm dev
```

## Built With

- [Next.js 16](https://nextjs.org) - React framework
- [v0 by Vercel](https://v0.dev) - AI-powered development
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Framer Motion](https://framer.com/motion) - Animations
- [shadcn/ui](https://ui.shadcn.com) - Components

## Continue Development

<a href="https://v0.app/chat/projects/prj_W9RAJaKcy7HIVaZiIN9qEVzLDNx3" alt="Continue on v0">
  <img src="https://img.shields.io/badge/Continue%20on-v0-black?style=for-the-badge&logo=vercel" />
</a>

<a href="https://v0.app/chat/api/kiro/clone/mbarbine/interactive-zine-reader" alt="Open in Kiro">
  <img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" />
</a>

---

## Roadmap - Bringing Back the Joy of a Good Zine

### Phase 1: Launch (May 2026) ✓
- [x] Interactive zine reader with gesture navigation
- [x] Three reading modes (dark/sepia/light)
- [x] Download/export (TXT, HTML, JSON)
- [x] Cinematic intro sequence
- [x] Mobile-first responsive design
- [x] Full API with OpenAPI 3.1 docs
- [x] MCP server integration
- [x] RSS feed with dynamic countdown
- [x] Multilingual SEO (EN/ES/FR)

### Phase 2: Community Integration (June 2026)
- [ ] ASCII theme mode via ascii.platphormnews.com
- [ ] Translation overlay via reader.platphormnews.com
- [ ] Community zine submission portal
- [ ] CLAWS security integration (when deployed)
- [ ] User accounts with reading history
- [ ] Cross-zine discovery feed

### Phase 3: Network Expansion (Summer 2026)
- [ ] Multi-zine platform (host multiple community zines)
- [ ] Collaborative editing for zine creators
- [ ] Print-on-demand integration
- [ ] Calendar integration for meetups
- [ ] Kanban for editorial workflow
- [ ] Analytics dashboard for creators

### Phase 4: Ecosystem (Fall 2026)
- [ ] Zine marketplace
- [ ] Subscription model for collectors
- [ ] AR/VR zine experiences
- [ ] AI-assisted layout suggestions
- [ ] Cross-network syndication

## The Vision

> Good leaders are sorting wizards.

Zines represent the purest form of community publishing - raw, unfiltered, locally crafted. This platform exists to bring that joy to digital readers while maintaining the intimate feel of a hand-folded mini-zine passed between friends.

From Front Royal, VA (540) to everywhere - one zine at a time.

---

**Location:** Front Royal, VA (540) - Shenandoah Valley  
**License:** MIT  
**Network:** Platphorm News (130+ sites)  
**First Friday:** New issue every month
