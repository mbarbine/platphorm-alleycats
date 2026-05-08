import { NextResponse } from 'next/server'

// humans.txt - The people behind Alleycats Alcove
// https://humanstxt.org/

export async function GET() {
  const humansTxt = `/* TEAM */
Creator: Alleycats Alcove
Site: https://alleycats.platphormnews.com
Location: Front Royal, VA 22630 (540)
Twitter: @AlleycatsAlcove

/* CONTRIBUTORS - Issue #1: "A Letter to A Substance" */
Author: H.B. Manion
Role: Writer
Piece: "Sleeping Pills" (Page 3)

Author: Simone Endress
Role: Writer
Piece: "An Email to Coffee" (Page 4)

Author: chris.unkempt
Role: Writer
Piece: "Did You Know That They Make Liquid Cocaine?" (Page 5)

Author: Mark Reeves
Role: Writer
Piece: "Untitled" (Page 6)

Author: Julieta Hernandez
Role: Poet
Piece: "Peppermint Schnapped" (Page 7)

Author: Phil Taylor
Role: Writer/Artist
Piece: "Sitting On The Toilet, Waiting To Die..." (Page 8)

Author: Sam Rusnak
Role: Writer
Piece: "Dear Alcohol" (Page 9)

/* SITE */
Standards: HTML5, CSS3, JavaScript
Software: Next.js 16, React 19, Tailwind CSS 4
Hosting: Vercel

/* NETWORK */
Organization: Platphorm News Network
Sites: alleycats.platphormnews.com, frontroyal.platphormnews.com, alleycatsalcove.platphormnews.com, zine540.platphormnews.com

/* LOCATION */
Venue: Writer's Alcove
Address: Main Street, Front Royal, VA 22630
Region: Shenandoah Valley
Meetup: Fridays 5:30-7:00 PM (before Karaoke)

/* SPECIAL THANKS */
Thanks: To everyone who believes that local voices matter.
Thanks: King Charles III and Queen Camilla for visiting Front Royal on the eve of our launch.
Thanks: The Shenandoah Valley arts community.

/* ABOUT */
This zine exists because a small group of writers decided "F#%ck it! Let's start a zine!"
Theme: A Letter to A Substance
Issue: 1 (May 2026)
Next Issue: Wildest Dreams (June 2026)
`

  return new NextResponse(humansTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
