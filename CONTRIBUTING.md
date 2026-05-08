# Contributing to Alleycats Alcove

Welcome to the Alleycats Alcove community zine platform! We're excited to help local artists and writers share their work.

## Submitting Your Zine

### For Individual Pieces (to Alleycats Alcove)

**Current Theme:** "Wildest Dreams" (June 2026)  
**Deadline:** May 15th  
**Submit to:** Writer's Alcove, Fridays 5:30-7:00

### For Community Zines (Your Own Zine)

Want to host your community zine on the Platphorm News Network? Here's what we need:

#### Required Materials

1. **Zine Pages** (8-20 spreads)
   - High-quality photos or scans
   - JPEG format, minimum 1200px width
   - Clean backgrounds (avoid hands in frame if possible)

2. **Metadata**
   - Title and subtitle
   - Issue number
   - Publication date
   - Theme (if applicable)
   - Location/community

3. **Table of Contents**
   - Piece titles
   - Author/artist names
   - Page numbers

4. **Credits**
   - Cover artist
   - Editors/organizers
   - Special thanks

#### Submission Process

1. Fork this repository
2. Add your zine data to `lib/zines/your-zine-name.ts`
3. Add page images to `public/zines/your-zine-name/`
4. Submit a pull request

#### Template

See `lib/platphorm-network.ts` for the `CommunityZineTemplate` interface:

```typescript
{
  id: 'your-zine-slug',
  title: 'Your Zine Name',
  subtitle: 'Your tagline',
  issue: 1,
  date: 'Month Year',
  theme: 'Your Theme',
  location: 'City, State or "Earth"',
  // ... full template in lib/platphorm-network.ts
}
```

## Code Contributions

### Development Setup

```bash
git clone https://github.com/mbarbine/interactive-zine-reader
cd interactive-zine-reader
pnpm install
pnpm dev
```

### Areas for Contribution

- **New reading modes** (high contrast, dyslexia-friendly)
- **Export formats** (EPUB, print layouts)
- **Accessibility improvements**
- **Translation support**
- **Mobile gesture enhancements**

### Pull Request Guidelines

1. Create a feature branch from `main`
2. Follow existing code patterns
3. Test on mobile and desktop
4. Update documentation if needed

## Network Integration

This site is part of the Platphorm News Network. For network-level contributions:

- **ASCII Art**: [ascii.platphormnews.com](https://ascii.platphormnews.com)
- **Translation**: [reader.platphormnews.com](https://reader.platphormnews.com)
- **Central Hub**: [mcp.platphormnews.com](https://mcp.platphormnews.com)

## Contact

- **Email:** zine@platphormnews.com
- **GitHub:** [@mbarbine](https://github.com/mbarbine)
- **Network:** [platphormnews.com](https://platphormnews.com)

---

*Supporting local artists, one zine at a time.*
