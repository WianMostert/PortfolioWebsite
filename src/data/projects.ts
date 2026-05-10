export type ProjectTheme = {
  background: string
  surface: string
  text: string
  muted: string
  accent: string
  secondary: string
  displayFont: string
  bodyFont: string
  motion: 'drift' | 'snap' | 'pulse' | 'slow' | 'flicker'
}

export type Project = {
  id: string
  slug: string
  title: string
  shortTitle: string
  published: string
  year: string
  logline: string
  description: string
  role: string
  tags: string[]
  youtubeUrl: string
  embedUrl: string
  thumbnail: string
  theme: ProjectTheme
}

const thumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
const watch = (id: string) => `https://www.youtube.com/watch?v=${id}`
const embed = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`

export const projects: Project[] = [
  {
    id: '3dJ_m19nCxQ',
    slug: 'between-life-and-breath',
    title: 'Between Life and Breath | A Short Essay Film',
    shortTitle: 'Between Life and Breath',
    published: '2026-02-24',
    year: '2026',
    logline:
      'A poetic essay film about a childhood near-drowning, faith, memory, and the quiet miracle of being alive.',
    description:
      'Wian reflects on a life-defining moment he cannot remember: being pulled unconscious from a family swimming pool and revived through desperate CPR and prayer.',
    role: 'Director / Essay Film',
    tags: ['Essay film', 'Faith', 'Memory', 'Natural imagery'],
    youtubeUrl: watch('3dJ_m19nCxQ'),
    embedUrl: embed('3dJ_m19nCxQ'),
    thumbnail: thumbnail('3dJ_m19nCxQ'),
    theme: {
      background: '#eef0e5',
      surface: '#fffaf0',
      text: '#1d2118',
      muted: '#6f725f',
      accent: '#b88f49',
      secondary: '#8da38a',
      displayFont: '"Cormorant Garamond", Georgia, serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      motion: 'slow',
    },
  },
  {
    id: 'FSbUX0BBz5Q',
    slug: 'the-last-hand',
    title: 'The Last Hand Short Film',
    shortTitle: 'The Last Hand',
    published: '2025-11-27',
    year: '2025',
    logline:
      'A Guy Ritchie-inspired cowboy poker short where a mysterious stranger turns a high-stakes night into chaos.',
    description:
      'A kinetic western short built around character intros, split screens, slow motion, cheeky narration, and a poker table full of secrets.',
    role: 'Director / Western Short',
    tags: ['Western', 'Poker', 'Split screen', 'Slow motion'],
    youtubeUrl: watch('FSbUX0BBz5Q'),
    embedUrl: embed('FSbUX0BBz5Q'),
    thumbnail: thumbnail('FSbUX0BBz5Q'),
    theme: {
      background: '#2b1b12',
      surface: '#d2aa72',
      text: '#fff2d2',
      muted: '#d2b083',
      accent: '#f3b24b',
      secondary: '#6f2d16',
      displayFont: 'Rye, Georgia, serif',
      bodyFont: 'Oswald, Inter, sans-serif',
      motion: 'snap',
    },
  },
  {
    id: 'Fdr4y1gJGOk',
    slug: 'between-life-and-breath-teaser',
    title: 'Between Life and Breath Teaser Trailer',
    shortTitle: 'Between Life and Breath Teaser',
    published: '2025-10-21',
    year: '2025',
    logline:
      'A meditative teaser for a film about miracles, faith, and the light that breaks through darkness.',
    description:
      'A trailer shaped by natural imagery and reflective voice-over, introducing the full film through Terrence Malick-inspired atmosphere.',
    role: 'Director / Teaser',
    tags: ['Trailer', 'Poetic', 'Faith', 'Light'],
    youtubeUrl: watch('Fdr4y1gJGOk'),
    embedUrl: embed('Fdr4y1gJGOk'),
    thumbnail: thumbnail('Fdr4y1gJGOk'),
    theme: {
      background: '#f5f1e8',
      surface: '#fffdf8',
      text: '#24221d',
      muted: '#817768',
      accent: '#c4924e',
      secondary: '#9fb7a5',
      displayFont: '"Cormorant Garamond", Georgia, serif',
      bodyFont: 'Manrope, Inter, sans-serif',
      motion: 'drift',
    },
  },
  {
    id: 'Sgy-p1yxNhg',
    slug: 'levels',
    title: 'LEVELS - Experimental Short Film I Directed Using VFX from My Favorite Movies',
    shortTitle: 'LEVELS',
    published: '2025-05-15',
    year: '2025',
    logline:
      'An experimental visual piece exploring directorial voice through whip pans, mirror transitions, underwater symbolism, and sci-fi surrealism.',
    description:
      'A connected set of dream-like sequences that tests how camera movement, editing rhythm, and symbolic storytelling can emotionally charge a scene.',
    role: 'Director / Experimental VFX',
    tags: ['Experimental', 'VFX', 'Sci-fi', 'Visual rhythm'],
    youtubeUrl: watch('Sgy-p1yxNhg'),
    embedUrl: embed('Sgy-p1yxNhg'),
    thumbnail: thumbnail('Sgy-p1yxNhg'),
    theme: {
      background: '#060711',
      surface: '#111833',
      text: '#eef8ff',
      muted: '#8aa2b8',
      accent: '#28f0ff',
      secondary: '#ff3fd5',
      displayFont: '"Space Grotesk", Inter, sans-serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      motion: 'pulse',
    },
  },
  {
    id: 'S5Iz3hRMaGk',
    slug: 'secrets-beneath-the-surface',
    title: 'Secrets Beneath The Surface | A Tshwane University of Technology Student Film (2024)',
    shortTitle: 'Secrets Beneath The Surface',
    published: '2025-04-10',
    year: '2025',
    logline:
      'A psychological drama about buried motives and quiet tension threatening to surface under pressure.',
    description:
      'A final-year student film co-directed by Wian Mostert and Themba Hlatswayo, with Wian also designing the soundscape.',
    role: 'Co-Director / Soundscape',
    tags: ['Psychological drama', 'Student film', 'Co-directed', 'Sound design'],
    youtubeUrl: watch('S5Iz3hRMaGk'),
    embedUrl: embed('S5Iz3hRMaGk'),
    thumbnail: thumbnail('S5Iz3hRMaGk'),
    theme: {
      background: '#101820',
      surface: '#d5dde2',
      text: '#ecf3f4',
      muted: '#a9b7bf',
      accent: '#83a9b7',
      secondary: '#394b5a',
      displayFont: '"Libre Baskerville", Georgia, serif',
      bodyFont: '"Source Sans 3", Inter, sans-serif',
      motion: 'slow',
    },
  },
  {
    id: '2qItgG-GCRo',
    slug: 'final-standoff',
    title: 'FINAL STANDOFF - Action Short Film',
    shortTitle: 'FINAL STANDOFF',
    published: '2024-03-13',
    year: '2024',
    logline:
      'A sunset-lit action short where a protagonist races against the clock to stop a bomb hidden inside a mall.',
    description:
      'A compact brawl staged around urgency, impact, and a parking-lot action atmosphere captured on an Osmo Action 3.',
    role: 'Director / Action Short',
    tags: ['Action', 'Brawl', 'Clock pressure', 'Sunset'],
    youtubeUrl: watch('2qItgG-GCRo'),
    embedUrl: embed('2qItgG-GCRo'),
    thumbnail: thumbnail('2qItgG-GCRo'),
    theme: {
      background: '#23100b',
      surface: '#3a1e14',
      text: '#fff1df',
      muted: '#e0a66f',
      accent: '#ff6b21',
      secondary: '#ffc15a',
      displayFont: '"Bebas Neue", Impact, sans-serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      motion: 'snap',
    },
  },
  {
    id: 'UdQCHEXO_Ek',
    slug: 'the-night-after',
    title: 'The Night After | A Gripping Sci-Fi Short Film | [Official Release]',
    shortTitle: 'The Night After',
    published: '2023-06-18',
    year: '2023',
    logline:
      'A gripping sci-fi short built around a tense night, a mystery voice, and immersive production texture.',
    description:
      'Shot on Blackmagic Pocket 4K with immersive sound capture, this release blends suspense, genre atmosphere, and practical production craft.',
    role: 'Director / Cinematographer / Editor',
    tags: ['Sci-fi', 'Thriller', 'Blackmagic', 'Atmosphere'],
    youtubeUrl: watch('UdQCHEXO_Ek'),
    embedUrl: embed('UdQCHEXO_Ek'),
    thumbnail: thumbnail('UdQCHEXO_Ek'),
    theme: {
      background: '#05080d',
      surface: '#0e1a25',
      text: '#e9f7ff',
      muted: '#8bb0c3',
      accent: '#57d9ff',
      secondary: '#7338ff',
      displayFont: 'Orbitron, Inter, sans-serif',
      bodyFont: 'Rajdhani, Inter, sans-serif',
      motion: 'flicker',
    },
  },
  {
    id: 'dRPOWjPBzyo',
    slug: 'godfather-reimagined',
    title: 'Godfather Reimagined: Epic Recreation of the Iconic Opening Scene!',
    shortTitle: 'Godfather Reimagined',
    published: '2023-05-23',
    year: '2023',
    logline:
      'A classic scene recreation focused on shadow, performance, and the controlled weight of an iconic opening.',
    description:
      'A recreation exercise using BMPCC 4K, GVM lighting, and Rode/Zoom audio tools to study noir lighting and performance blocking.',
    role: 'Director / Recreation',
    tags: ['Noir', 'Recreation', 'Performance', 'Lighting'],
    youtubeUrl: watch('dRPOWjPBzyo'),
    embedUrl: embed('dRPOWjPBzyo'),
    thumbnail: thumbnail('dRPOWjPBzyo'),
    theme: {
      background: '#080604',
      surface: '#1c130b',
      text: '#f8ead0',
      muted: '#b19a76',
      accent: '#d8a246',
      secondary: '#5d130f',
      displayFont: '"Playfair Display", Georgia, serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      motion: 'slow',
    },
  },
  {
    id: 'zqcLBgHWMUk',
    slug: 'saurian',
    title: 'Saurian - Sci fi/Thriller Short Film',
    shortTitle: 'Saurian',
    published: '2022-12-26',
    year: '2022',
    logline:
      'A convenience-store sci-fi thriller where a flickering back-room light pulls Morgan toward something ominous.',
    description:
      'Written and directed by Wian Mostert, shot on a Samsung S9+ using Filmic Pro, and built around escalating dread in an ordinary location.',
    role: 'Writer / Director',
    tags: ['Sci-fi thriller', 'Creature suspense', 'Mobile filmmaking', 'Dread'],
    youtubeUrl: watch('zqcLBgHWMUk'),
    embedUrl: embed('zqcLBgHWMUk'),
    thumbnail: thumbnail('zqcLBgHWMUk'),
    theme: {
      background: '#06100b',
      surface: '#0d2418',
      text: '#ecffe8',
      muted: '#8fb894',
      accent: '#8dff77',
      secondary: '#1b6b3c',
      displayFont: '"Share Tech Mono", monospace',
      bodyFont: 'Inter, system-ui, sans-serif',
      motion: 'flicker',
    },
  },
]

export const featuredProject = projects[0]

export const findProject = (slug: string | undefined) =>
  projects.find((project) => project.slug === slug)
