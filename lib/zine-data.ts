export interface ZinePage {
  id: string
  type: 'cover' | 'spread' | 'single' | 'toc' | 'back'
  title?: string
  author?: string
  content?: string
  image: string
  pageNumber: number
}

export interface ZineIssue {
  id: string
  title: string
  subtitle: string
  issue: number
  date: string
  theme: string
  coverImage: string
  pages: ZinePage[]
}

export interface ZineContributor {
  name: string
  pieces: string[]
}

export const SITE_CONFIG = {
  domain: 'alleycats.platphormnews.com',
  // All domain aliases for this zine
  domainAliases: [
    'alleycats.platphormnews.com',
    'frontroyal.platphormnews.com',
    'alleycatsalcove.platphormnews.com',
    'zine540.platphormnews.com',
  ],
  name: 'Alleycats Alcove',
  tagline: 'A Collaborative Zine with Substance',
  // 540 - Front Royal, VA - Community zine written locally
  location: 'Front Royal, VA',
  address: 'Main Street, Front Royal, VA 22630',
  areaCode: '540',
  region: 'Shenandoah Valley',
  geo: {
    city: 'Front Royal',
    state: 'VA',
    zipCode: '22630',
    country: 'USA',
    coordinates: { lat: 38.918, lng: -78.194 },
  },
  meetup: {
    day: 'Fridays',
    time: '5:30-7:00 PM',
    venue: "Writer's Alcove",
    location: 'Main Street, Front Royal',
  },
  social: {
    submissions: "Writer's Alcove",
  },
  version: '1.0.0',
  // ASCII integration
  ascii: {
    endpoint: 'https://ascii.platphormnews.com',
    enabled: true,
  },
  // Reader integration
  reader: {
    endpoint: 'https://reader.platphormnews.com',
  },
}

// Dynamic news/context for discoverability
export const NEWS_CONTEXT = {
  recentEvents: [
    {
      date: '2026-04-30',
      headline: 'King Charles III and Queen Camilla visit Front Royal',
      relevance: 'The royal visit on the eve of Issue #1 launch symbolizes a new centennial era - raw and uncut, celebrating the greatest parts of our generation through independent publishing.',
    },
    {
      date: '2026-05-01',
      headline: 'Alleycats Alcove Issue #1 launches',
      relevance: 'First issue of the collaborative zine from the Writer\'s Alcove community on Main Street, Front Royal.',
    },
  ],
  tags: [
    'independent-zine',
    'local-artists',
    'creative-writing',
    'poetry',
    'substance-theme',
    'writers-alcove',
    'may-2026',
    'issue-1',
    'collaborative-art',
    'underground-publishing',
    // Local / Regional
    'front-royal-va',
    'shenandoah-valley',
    '540-area',
    'virginia-arts',
    'small-town-publishing',
    // Search keywords people use
    'main-street-front-royal',
    'front-royal-zine',
    'alleycats-alcove',
    'zine-540',
    'frontroyal-arts',
    'writers-alcove-front-royal',
  ],
  nextIssue: {
    number: 2,
    theme: 'Wildest Dreams',
    deadline: '2026-05-15',
    releaseDate: '2026-06-06', // First Friday of June
  },
}

export const alleycatsZine: ZineIssue = {
  id: 'alleycats-001',
  title: 'Alleycats Alcove',
  subtitle: 'A Collaborative Zine with Substance',
  issue: 1,
  date: 'May 2026',
  theme: 'A Letter to A Substance',
  coverImage: '/zine/page-01-cover.jpg',
  pages: [
    {
      id: 'cover',
      type: 'cover',
      title: 'Alleycats Alcove #1',
      content: 'A Collaborative Zine with Substance',
      image: '/zine/page-01-cover.jpg',
      pageNumber: 1,
    },
    {
      id: 'intro-spread',
      type: 'spread',
      title: 'Introduction',
      image: '/zine/page-02-intro.jpg',
      pageNumber: 2,
      defaultRotation: 0, // Horizontal orientation
      content: `This zine here comes from a little group calling themselves the "Writer's Alcove". They meet on Friday evenings before Karaoke starts and do their little exercises. One day, they decided, "F#%ck it! Let's start a zine!" and this is the accumulation of some of that. So, welcome to our first monthly Alley Cats Alcove zine, to and from the local literary community. This month's theme was "A Letter to A Substance", where the submissions were influenced by influences.

We hope you enjoy and are able to find a little inspiration in these works.

Not to use substances... but to write!`,
    },
    {
      id: 'coffee-toc',
      type: 'toc',
      title: 'Table of Contents',
      image: '/zine/page-03-toc.jpg',
      pageNumber: 3,
      content: `Table of Contents

1. A Love Letter to Cigarettes - H.B. Manion
2. Did You Know That They Make Liquid Cocaine? - Simone Endress
3. Town So New, Whiskey So Old - chris.unkempt.
4. Champagne Explosion - Mark Reeves
5. A Vape is Like a Lover - Julieta Hernandez
6. Peach Schnapp'd - chris.unkempt.
7. To My Dearest Beloved Disgusting and Vile Mistress Caffiene - Phil Taylor
8. Sitting On The Toilet, Waiting To Die - Sam Rusnak`,
    },
    {
      id: 'cigarettes',
      type: 'spread',
      title: 'A Love Letter to Cigarettes',
      author: 'H.B. Manion',
      image: '/zine/page-04-cigarettes.jpg',
      pageNumber: 4,
      content: `A Love Letter to Cigarettes

My Dearest Marlboro,

I feel my love for you
filling up my lungs
grasped between my fingertips
making me light-headed first thing in the morning.

I love watching the way
your sparks hit the pavement
through my rearview mirror
as I toss you out
leaving traces of my DNA
everywhere I go.

You are always there for me
consistent and unwavering
guiding me through
five minute meditations
twenty times a day.

My love for you will
maybe
probably
eventually
kill me

And that's fine by me.

H.B. Manion`,
    },
    {
      id: 'liquid-cocaine',
      type: 'spread',
      title: 'Did You Know That They Make Liquid Cocaine?',
      author: 'Simone Endress',
      image: '/zine/page-05-liquid-cocaine.jpg',
      pageNumber: 5,
      defaultRotation: 90, // Photo taken vertically, rotate 90deg for proper viewing
      content: `Did You Know That They Make Liquid Cocaine?

The bar was closed now. Ichiro passed me what I thought looked like an essential oil mister and told me to put it up my nose and spray. A faint note of synthetic lavender twisted up my nostrils, belying a more sinister sensation. It was the disturbing chemical absence of smell, the feeling of sterility. Liquid cocaine.

For a few hours, I was unburdened by an awareness that I would one day die. I felt flat on my face the way only a toddler or a truly intoxicated person could. And I didn't feel anything. A stunning nothing-at-all. Like I was somewhere else, in a VR headset simulation of a night out.

Ichiro walked me home and we stood on the rooftop, watching the polluted sunrise glint against Lady Liberty. We listened to the early Brooklyn traffic trickle.

After Ichiro left, all the feeling returned. My entire consciousness was dominated by a thunderous headache. I writhed in bed, pulling a hoodie over my face, wishing I had bothered to buy a curtain. But the light spoiled in relentlessly, intruded and insisted on my suffering. I remembered that whole mess about dying, and was convinced it would be today.

It wasn't.

Liquid cocaine, you came into my life exactly once. You were haunting and ruinous and probably not worth the trouble. I spent the rest of that day in bed, not sleeping. I think only love and drugs can make you feel like that.

Simone Endress`,
    },
    {
      id: 'vape-caffeine',
      type: 'spread',
      title: 'A Vape is Like a Lover / To My Dearest Beloved Disgusting and Vile Mistress Caffeine',
      author: 'Julieta Hernandez / Phil Taylor',
      image: '/zine/page-06-vape-caffeine.jpg',
      pageNumber: 6,
      content: `A Vape is Like a Lover

My world becomes fuzzy for a few minutes, and I cough to catch my breath... And I cough as it exits my lungs, and then I smile at my friend.
"You're right. It's delicious."

A vape has been in bed with me, nestled into the blankets, always in reach even as I dream.
A vape has accompanied me to the walk-in, and joined me in my sigh of frustration...
A vape has hid under my couch, giving me the fear of losing a small pet, and the fervor of lifting the couch to check; or the awkward task of asking a friend to check their pockets.
A vape has led me by my wallet and my lungs into far tobacco store, asking the woman who works there to help me today's flavors.
A vape has made me feel incomplete without the cool berry rush, a smoke let out through one nostril only, like a dragon, or like a God...
A vape has put me on top of the world while distracting me from how far I've fallen to the bottom.
A vape has hijacked my lungs and taken my breath away.

A vape comes to you out of nowhere after a loss introduced to you by an equally weary friend. "You can trust me."
An inhalation that sends currents of piña colada through my large limbs, down to a little buzz right at my fingertips... and right back up to a spin in my head.

Julieta Hernandez

---

To My Dearest Beloved Disgusting and Vile Mistress Caffeine:

What the fuck? One moment you're a goddess, and the next, a despicable creature casting me into some esoteric tide of inspiration never before seen, seeing me to heights of desperation caused by your absence as deep as by contrast. You reduce me easily. Your blacks bakes appear gorgeous, all energy and darkness, yet beneath it was cold the touch, I am going and I don't care. There is no way out...

...except perhaps you. You drive me to all of the greatest joy and great purpose.
If this is what she sells herself a romantic pose.

Phil Taylor`,
    },
    {
      id: 'schnapped',
      type: 'spread',
      title: 'Peppermint Schnapped',
      author: 'chris.unkempt.',
      image: '/zine/page-07-schnapped.jpg',
      pageNumber: 7,
      content: `PEPPERMINT SCHNAPPED

sometimes I like to drink like a hobo and get peppermint schnapped
it used to be a hip thing
to buy a bottle of Rumplemintz
throw it in the freezer
and do shots all night long

but the 100 proof cheap stuff
is half the price
and higher the percentage of alcohol

sometimes i like to put it in a brown paper bag
drink it warm and skulk the alleyways
of North Beach San Francisco and pretend to be a 1950's beatnik

or better yet a skid row bum
whose lost his wife
and his talent for writing
dooming him to a life
of back-alley romances
cold, wet San Francisco nights with bed bugs
and $20 hotel rooms

all thats left is that sweet minty liquid
as it passes his crusted lips
down his sun-scorched throat
and into his ulcerated stomach
it momentarily makes him forget all of it all of them...

at only $12 a bottle
he can beg enough cash
within an hour or two of waking up
to knock himself out food can wait until tomorrow
tomorrow can wait forever
he'll worry about tomorrow some other day

---

but in reality
he doesn't exist
its just me

and i'm just a normal man
who likes my fresh breath inducing intoxicants
that ill drink too much of

and fall asleep in my kingsize bed
watching cable tv or episodes of 'moonshiners' on
my laptop computer
with a stomach full of black bean burgers
because i am a vegetarian
and picky about what I eat

I may wake up to a hangover
but theres aspirin and filter water for that
and if its too bad
theres usually a little liquor left over
I know its too early to drink
but I have work to do
and I can worry about today

some other day

chris.unkempt. (pulled from "Unkempt" Document No. Two)`,
    },
    {
      id: 'toilet',
      type: 'spread',
      title: 'Sitting On The Toilet, Waiting To Die...',
      author: 'Sam Rusnak',
      image: '/zine/page-08-toilet.jpg',
      pageNumber: 8,
      defaultRotation: 0, // Already horizontal
      content: `Sitting on the toilet, waiting to die...

I want to be free from this porcelain prison.
But if you're going to sit
For a bit why not multi-task?
And inside my screen there are multiple things I can
swipe between. My favorite way to swipe isn't left or
right, but down. If you keep going down there's always
more to see...
Or not see - blink too fast and I miss the important
news, but keep going down and I'll know what new
app to get that will stop me from doomscrolling.
My legs are falling asleep now, but I'm pretty sure that
I'll soon find what I'm looking for and then I can stop.
Or, more likely: my savior comes in the form of a
sudden hiccup and spasm of black, depth turns to flat.
A relieving death that lasts as long as the time it takes
to wash my hands and go upstairs
where new life is waiting in the form
of an umbilical cord that attaches me to my wall.

Sam Rusnak`,
    },
    {
      id: 'credits',
      type: 'spread',
      title: 'Credits & Next Issue',
      image: '/zine/page-09-credits.jpg',
      pageNumber: 9,
      content: `Writer's Alcove Fridays
5:30 - 7:00

Thanks for visiting our May Zine!

Next month's theme will be "Wildest Dreams"
meaning the strange things you see in your subconscious,
some insane aspirations, or... maybe that one dream you
had about Billy's mom...

Submissions will be due on May 15th and can be
submitted to the Writer's Alcove.

This month's cover art was hand-drawn by Sam Rusnak.
Also a thank you to Chris Kemp for showing us how to
make a zine.`,
    },
    {
      id: 'back-cover',
      type: 'back',
      title: 'May 2026',
      image: '/zine/page-10-back.jpg',
      pageNumber: 10,
      content: `May 2026

"Where's my vape?!"

ALLEYCATS ALCOVE
ZINE`,
    },
  ],
}

export const tableOfContents = [
  { number: 1, title: 'A Love Letter to Cigarettes', author: 'H.B. Manion', pageNumber: 4 },
  { number: 2, title: 'Did You Know That They Make Liquid Cocaine?', author: 'Simone Endress', pageNumber: 5 },
  { number: 3, title: 'Town So New, Whiskey So Old', author: 'chris.unkempt.', pageNumber: 7 },
  { number: 4, title: 'Champagne Explosion', author: 'Mark Reeves', pageNumber: 6 },
  { number: 5, title: 'A Vape is Like a Lover', author: 'Julieta Hernandez', pageNumber: 6 },
  { number: 6, title: "Peach Schnapp'd", author: 'chris.unkempt.', pageNumber: 7 },
  { number: 7, title: 'To My Dearest Beloved Disgusting and Vile Mistress Caffiene', author: 'Phil Taylor', pageNumber: 6 },
  { number: 8, title: 'Sitting On The Toilet, Waiting To Die', author: 'Sam Rusnak', pageNumber: 8 },
]

export const contributors: ZineContributor[] = [
  { name: 'H.B. Manion', pieces: ['A Love Letter to Cigarettes'] },
  { name: 'Simone Endress', pieces: ['Did You Know That They Make Liquid Cocaine?'] },
  { name: 'chris.unkempt.', pieces: ['Town So New, Whiskey So Old', "Peach Schnapp'd"] },
  { name: 'Mark Reeves', pieces: ['Champagne Explosion'] },
  { name: 'Julieta Hernandez', pieces: ['A Vape is Like a Lover'] },
  { name: 'Phil Taylor', pieces: ['To My Dearest Beloved Disgusting and Vile Mistress Caffiene'] },
  { name: 'Sam Rusnak', pieces: ['Sitting On The Toilet, Waiting To Die', 'Cover Art'] },
  { name: 'Chris Kemp', pieces: ['Zine Making Guidance'] },
]

// Default authors for metadata across all pages
export const DEFAULT_AUTHORS = [
  { name: 'Alleycats Alcove' },
  { name: 'H.B. Manion' },
  { name: 'Simone Endress' },
  { name: 'chris.unkempt' },
  { name: 'Mark Reeves' },
  { name: 'Julieta Hernandez' },
  { name: 'Phil Taylor' },
  { name: 'Sam Rusnak' },
] as const

// Multilingual content
export const zineMeta = {
  en: {
    title: 'Alleycats Alcove',
    subtitle: 'A Collaborative Zine with Substance',
    tagline: 'Supporting local artists',
    readNow: 'Read Now',
    download: 'Download',
    nextTheme: 'Wildest Dreams',
    location: 'Earth',
  },
  es: {
    title: 'Alleycats Alcove',
    subtitle: 'Una Revista Colaborativa con Sustancia',
    tagline: 'Apoyando artistas locales',
    readNow: 'Leer Ahora',
    download: 'Descargar',
    nextTheme: 'Sueños Más Salvajes',
    location: 'Tierra',
  },
  fr: {
    title: 'Alleycats Alcove',
    subtitle: 'Un Zine Collaboratif avec Substance',
    tagline: 'Soutenir les artistes locaux',
    readNow: 'Lire Maintenant',
    download: 'Télécharger',
    nextTheme: 'Rêves les Plus Fous',
    location: 'Terre',
  },
}

// Future zine template for community onboarding
export interface CommunityZineConfig {
  communityName: string
  slug: string
  location: string
  meetupSchedule?: string
  submissionEmail?: string
  socialLinks?: {
    instagram?: string
    twitter?: string
    website?: string
  }
  theme?: {
    primaryColor: string
    accentColor: string
  }
}

export const COMMUNITY_ZINE_TEMPLATE: CommunityZineConfig = {
  communityName: '',
  slug: '',
  location: 'Earth',
  meetupSchedule: '',
  submissionEmail: '',
  socialLinks: {},
  theme: {
    primaryColor: 'oklch(0.72 0.18 15)',
    accentColor: 'oklch(0.65 0.2 340)',
  },
}
