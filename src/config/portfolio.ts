import { projects, type Project } from '../data/projects'

export type SiteProfile = {
  headline: string
  intro: string
  statement: string
  aboutTitle: string
  aboutBody: string
  location: string
  roles: string
  profileImage: string
  youtubeUrl: string
  linkedInUrl: string
}

export type ProjectOverride = {
  logline?: string
  description?: string
  role?: string
  tags?: string[]
  thumbnail?: string
  theme?: Partial<Project['theme']>
}

export type PortfolioOverrides = {
  profile?: Partial<SiteProfile>
  projects?: Record<string, ProjectOverride>
}

export const defaultProfile: SiteProfile = {
  headline: 'South African short films shaped by memory, pressure, and genre.',
  intro:
    'Wian Mostert builds cinematic shorts across poetic essay film, western chaos, sci-fi tension, psychological drama, and action-driven experiments.',
  statement:
    "Director, cinematographer, and editor working from South Africa with a focus on short-form cinematic storytelling. This portfolio is organised like a slate: each film opens into its own visual world, with a palette and type system drawn from the project's subject, thumbnail, and genre language.",
  aboutTitle: 'Built around the person behind the camera.',
  aboutBody:
    'The homepage gives visitors a clear sense of Wian before they enter the individual film pages, with a profile image area, LinkedIn pathway, role language, and a reel of project stills.',
  location: 'South Africa',
  roles: 'Director / Cinematographer / Editor',
  profileImage: '/wian-headshot.png',
  youtubeUrl: 'https://www.youtube.com/@WianMostertDirector',
  linkedInUrl: 'https://www.linkedin.com/in/wian-mostert-594820253/',
}

export const storageKey = 'wian-portfolio-overrides-v1'
export const adminSessionKey = 'wian-portfolio-admin-unlocked'

export const defaultAdminPasswordHash =
  import.meta.env.VITE_ADMIN_PASSWORD_HASH ??
  '735cbc18ab600b9fec34d64758f6ed9f372371fea53b99020105b756117c34aa'

export const normalizeImageUrl = (value: string | undefined) => {
  const trimmed = value?.trim()

  if (!trimmed) {
    return ''
  }

  const driveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/?#]+)/)
  const driveQueryMatch = trimmed.match(/[?&]id=([^&#]+)/)
  const driveOpenMatch = trimmed.match(/drive\.google\.com\/open\?id=([^&#]+)/)
  const id = driveFileMatch?.[1] ?? driveOpenMatch?.[1] ?? driveQueryMatch?.[1]

  if (id && trimmed.includes('drive.google.com')) {
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w1600`
  }

  return trimmed
}

export const loadOverrides = (): PortfolioOverrides => {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const stored = window.localStorage.getItem(storageKey)
    return stored ? (JSON.parse(stored) as PortfolioOverrides) : {}
  } catch {
    return {}
  }
}

export const saveOverrides = (overrides: PortfolioOverrides) => {
  window.localStorage.setItem(storageKey, JSON.stringify(overrides, null, 2))
  window.dispatchEvent(new CustomEvent('portfolio-config-updated'))
}

export const getConfiguredProfile = (overrides: PortfolioOverrides): SiteProfile => ({
  ...defaultProfile,
  ...overrides.profile,
  profileImage: normalizeImageUrl(overrides.profile?.profileImage) || defaultProfile.profileImage,
})

export const getConfiguredProjects = (overrides: PortfolioOverrides): Project[] =>
  projects.map((project) => {
    const override = overrides.projects?.[project.slug]
    const thumbnailOverride = normalizeImageUrl(override?.thumbnail)

    if (!override) {
      return project
    }

    return {
      ...project,
      ...override,
      thumbnail: thumbnailOverride || project.thumbnail,
      tags: override.tags ?? project.tags,
      theme: {
        ...project.theme,
        ...override.theme,
      },
    }
  })

export const resetOverrides = () => {
  window.localStorage.removeItem(storageKey)
  window.dispatchEvent(new CustomEvent('portfolio-config-updated'))
}
