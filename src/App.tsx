import { useEffect, useLayoutEffect, useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Clapperboard,
  Film,
  MapPin,
  Play,
  Sparkles,
  UserRound,
  BriefcaseBusiness,
  Download,
  Eye,
  Lock,
  RotateCcw,
  Save,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import './App.css'
import type { Project } from './data/projects'
import {
  adminSessionKey,
  defaultAdminPasswordHash,
  getConfiguredProfile,
  getConfiguredProjects,
  loadOverrides,
  normalizeImageUrl,
  resetOverrides,
  saveOverrides,
  type PortfolioOverrides,
  type ProjectOverride,
  type SiteProfile,
} from './config/portfolio'

const fadeIn = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
}

const cardSpring = { type: 'spring', stiffness: 260, damping: 24 } as const

const themeStyle = (project: Project) =>
  ({
    '--page-bg': project.theme.background,
    '--page-surface': project.theme.surface,
    '--page-text': project.theme.text,
    '--page-muted': project.theme.muted,
    '--page-accent': project.theme.accent,
    '--page-secondary': project.theme.secondary,
    '--page-display': project.theme.displayFont,
    '--page-body': project.theme.bodyFont,
  }) as CSSProperties

const hashPassword = async (value: string) => {
  const data = new TextEncoder().encode(value)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

const compressImageFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.addEventListener('load', () => {
      URL.revokeObjectURL(url)
      const maxSize = 1600
      const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight))
      const width = Math.max(1, Math.round(image.naturalWidth * scale))
      const height = Math.max(1, Math.round(image.naturalHeight * scale))
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')

      if (!context) {
        reject(new Error('This browser could not prepare the image.'))
        return
      }

      context.drawImage(image, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    })

    image.addEventListener('error', () => {
      URL.revokeObjectURL(url)
      reject(new Error('That image could not be loaded.'))
    })

    image.src = url
  })

const imageFileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file.'))
      return
    }

    if (!file.type.includes('svg') && !file.type.includes('gif')) {
      compressImageFile(file).then(resolve).catch(reject)
      return
    }

    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(String(reader.result)))
    reader.addEventListener('error', () => reject(reader.error ?? new Error('Image upload failed.')))
    reader.readAsDataURL(file)
  })

function usePortfolioConfig() {
  const [overrides, setOverrides] = useState<PortfolioOverrides>(() => loadOverrides())

  useEffect(() => {
    const refresh = () => setOverrides(loadOverrides())
    window.addEventListener('portfolio-config-updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('portfolio-config-updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return useMemo(
    () => ({
      overrides,
      profile: getConfiguredProfile(overrides),
      configuredProjects: getConfiguredProjects(overrides),
    }),
    [overrides],
  )
}

function SiteHeader({ profile }: { profile: SiteProfile }) {
  return (
    <header className="site-header" aria-label="Main navigation">
      <Link className="brand" to="/" aria-label="Wian Mostert portfolio home">
        <span className="brand-mark">WM</span>
        <span>
          <strong>Wian Mostert</strong>
          <small>Director portfolio</small>
        </span>
      </Link>
      <nav className="nav-links">
        <NavLink to="/">Work</NavLink>
        <a href={profile.linkedInUrl} target="_blank" rel="noreferrer">
          LinkedIn
          <ArrowUpRight aria-hidden="true" />
        </a>
        <a href={profile.youtubeUrl} target="_blank" rel="noreferrer">
          YouTube
          <ArrowUpRight aria-hidden="true" />
        </a>
      </nav>
    </header>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 28, mass: 0.2 })

  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
}

function KineticBackdrop() {
  return (
    <div className="kinetic-backdrop" aria-hidden="true">
      <span className="light-sweep sweep-one" />
      <span className="light-sweep sweep-two" />
      <span className="frame-lines" />
    </div>
  )
}

function PageLoadSlate() {
  const [isVisible, setIsVisible] = useState(true)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), reduceMotion ? 450 : 2250)
    return () => window.clearTimeout(timer)
  }, [reduceMotion])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="load-slate"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <motion.div
            className="slate-card"
            initial={reduceMotion ? false : { scale: 0.92, rotate: -2, y: 28 }}
            animate={reduceMotion ? undefined : { scale: 1, rotate: 0, y: 0 }}
            transition={{ type: 'spring', stiffness: 210, damping: 19 }}
          >
            <motion.div
              className="slate-top"
              initial={reduceMotion ? false : { rotate: -18, y: -18 }}
              animate={reduceMotion ? undefined : { rotate: [ -18, -18, 0, -4, 0 ], y: [ -18, -18, 0, 0, 0 ] }}
              transition={{ duration: 1.15, times: [0, 0.28, 0.5, 0.68, 1], ease: 'easeInOut' }}
            >
              <span />
              <span />
              <span />
              <span />
            </motion.div>
            <div className="slate-body">
              <span className="slate-kicker">Wian Mostert</span>
              <strong>Director Portfolio</strong>
              <div className="slate-meta">
                <span>Scene 01</span>
                <span>Take 09</span>
                <span>Roll 2026</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function FilmMarquee({ configuredProjects }: { configuredProjects: Project[] }) {
  const items = configuredProjects.flatMap((project) => [project.shortTitle, project.role])

  return (
    <section className="film-marquee" aria-label="Film disciplines and projects">
      <div className="marquee-track">
        {[...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </section>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    const frame = window.requestAnimationFrame(() => window.scrollTo(0, 0))
    const timer = window.setTimeout(() => window.scrollTo(0, 0), 120)
    const lateTimer = window.setTimeout(() => window.scrollTo(0, 0), 320)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      window.clearTimeout(lateTimer)
    }
  }, [pathname])

  return null
}

function HomePage({ profile, configuredProjects }: { profile: SiteProfile; configuredProjects: Project[] }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.main
      className="home-page"
      initial="initial"
      animate="animate"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <section className="director-hero">
        <motion.div
          className="hero-copy"
          variants={fadeIn}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p className="section-label">Director / Cinematographer / Editor</p>
          <h1>{profile.headline}</h1>
          <p className="hero-intro">{profile.intro}</p>
          <div className="hero-actions">
            <a className="primary-action" href={profile.youtubeUrl} target="_blank" rel="noreferrer">
              <Play aria-hidden="true" />
              Watch the channel
            </a>
            <a className="secondary-action" href={profile.linkedInUrl} target="_blank" rel="noreferrer">
              <BriefcaseBusiness aria-hidden="true" />
              LinkedIn
            </a>
            <a className="secondary-action" href="#films">
              View projects
            </a>
          </div>
        </motion.div>

        <motion.div
          className="director-portrait"
          variants={fadeIn}
          transition={{ duration: 0.8, delay: 0.12, ease: 'easeOut' }}
        >
          <div className="portrait-panel">
            <motion.img
              src={profile.profileImage}
              alt="Wian Mostert"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.025, 1],
                      rotate: [0, -0.2, 0],
                    }
              }
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="portrait-copy">
              <span>Wian Mostert</span>
              <strong>Director profile</strong>
            </div>
          </div>
          <div className="portrait-reel" aria-label="Project stills">
            {configuredProjects.slice(0, 4).map((project) => (
              <img src={project.thumbnail} alt="" key={project.id} />
            ))}
          </div>
        </motion.div>
      </section>

      <FilmMarquee configuredProjects={configuredProjects} />

      <section className="profile-band" aria-label="Director profile" id="profile">
        <motion.div
          className="profile-statement"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <Clapperboard aria-hidden="true" />
          <p>{profile.statement}</p>
        </motion.div>
        <div className="profile-facts" aria-label="Portfolio facts">
          <span>
            <Camera aria-hidden="true" />
            {profile.roles}
          </span>
          <span>
            <MapPin aria-hidden="true" />
            {profile.location}
          </span>
          <span>
            <BriefcaseBusiness aria-hidden="true" />
            LinkedIn profile connected
          </span>
        </div>
      </section>

      <section className="director-strip" aria-label="About Wian">
        <div className="about-card">
          <UserRound aria-hidden="true" />
          <h2>{profile.aboutTitle}</h2>
          <p>{profile.aboutBody}</p>
        </div>
        <div className="still-stack">
          {configuredProjects.slice(4, 9).map((project) => (
            <Link to={`/films/${project.slug}`} key={project.id}>
              <img src={project.thumbnail} alt="" loading="lazy" />
              <span>{project.shortTitle}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="project-index" id="films">
        <div className="section-heading">
          <p className="section-label">Selected uploads</p>
          <h2>Each page has its own visual language.</h2>
        </div>
        <div className="project-grid">
          {configuredProjects.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.id} />
          ))}
        </div>
      </section>
    </motion.main>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      className="project-card"
      style={themeStyle(project)}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, scale: 1.015 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ ...cardSpring, delay: Math.min(index * 0.035, 0.2) }}
    >
      <Link to={`/films/${project.slug}`} aria-label={`Open ${project.shortTitle}`}>
        <div className="project-poster">
          <img src={project.thumbnail} alt="" loading="lazy" />
          <span className="poster-glow" aria-hidden="true" />
          <span className="play-chip">
            <Play aria-hidden="true" />
          </span>
        </div>
        <div className="project-card-body">
          <span className="project-year">{project.year}</span>
          <h3>{project.shortTitle}</h3>
          <p>{project.logline}</p>
          <div className="project-tags">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

function ProjectPage({ configuredProjects }: { configuredProjects: Project[] }) {
  const { slug } = useParams()
  const project = configuredProjects.find((item) => item.slug === slug)
  const reduceMotion = useReducedMotion()

  if (!project) {
    return <NotFound />
  }

  const related = configuredProjects.filter((item) => item.id !== project.id).slice(0, 3)

  return (
    <motion.main
      className={`film-page motion-${project.theme.motion}`}
      style={themeStyle(project)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className="film-accent-rail" aria-hidden="true" />
      <section className="film-hero">
        <div className="film-copy">
          <Link className="back-link" to="/">
            <ArrowLeft aria-hidden="true" />
            Back to all films
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="project-role">{project.role}</p>
            <h1>{project.shortTitle}</h1>
            <p className="film-logline">{project.logline}</p>
          </motion.div>
          <div className="film-meta" aria-label="Film details">
            <span>
              <CalendarDays aria-hidden="true" />
              {project.year}
            </span>
            <span>
              <Film aria-hidden="true" />
              {project.tags[0]}
            </span>
          </div>
        </div>

        <motion.div
          className="film-poster"
          initial={{ opacity: 0, scale: 0.96, rotate: -1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.img
            src={project.thumbnail}
            alt={`${project.shortTitle} thumbnail`}
            animate={
              reduceMotion
                ? undefined
                : {
                    y: project.theme.motion === 'snap' ? [0, -8, 0] : [0, -14, 0],
                  }
            }
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="poster-caption">{project.title}</span>
        </motion.div>
      </section>

      <section className="watch-section" aria-label={`Watch ${project.shortTitle}`}>
        <VideoPlayer project={project} />
        <div className="project-notes">
          <p className="section-label">Project notes</p>
          <p>{project.description}</p>
          <div className="project-tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <a className="primary-action compact" href={project.youtubeUrl} target="_blank" rel="noreferrer">
            Open on YouTube
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="related-section">
        <div className="section-heading">
          <p className="section-label">Keep watching</p>
          <h2>Other worlds in the portfolio</h2>
        </div>
        <div className="related-grid">
          {related.map((item) => (
            <Link className="related-card" to={`/films/${item.slug}`} key={item.id} style={themeStyle(item)}>
              <img src={item.thumbnail} alt="" loading="lazy" />
              <span>{item.year}</span>
              <strong>{item.shortTitle}</strong>
            </Link>
          ))}
        </div>
      </section>
    </motion.main>
  )
}

function VideoPlayer({ project }: { project: Project }) {
  return (
    <div className="video-shell">
      <a
        className="video-poster"
        href={project.youtubeUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Watch ${project.title} on YouTube`}
      >
        <img src={project.thumbnail} alt="" />
        <span className="video-play">
          <Play aria-hidden="true" />
        </span>
        <span className="video-copy">
          <strong>Watch on YouTube</strong>
          <small>The in-app browser blocks the embedded player, so this opens the working video page.</small>
        </span>
      </a>
    </div>
  )
}

function NotFound() {
  return (
    <main className="not-found">
      <Sparkles aria-hidden="true" />
      <h1>Film not found</h1>
      <p>The project page you opened is not part of the current Wian Mostert portfolio.</p>
      <Link className="primary-action" to="/">
        Return home
      </Link>
    </main>
  )
}

function AdminPage({
  configuredProjects,
  overrides,
}: {
  configuredProjects: Project[]
  overrides: PortfolioOverrides
}) {
  const [isUnlocked, setIsUnlocked] = useState(
    () => window.sessionStorage.getItem(adminSessionKey) === 'true',
  )
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [adminNotice, setAdminNotice] = useState('')
  const [draft, setDraft] = useState<PortfolioOverrides>(overrides)
  const [activeSlug, setActiveSlug] = useState(configuredProjects[0]?.slug ?? '')
  const draftProfile = useMemo(() => getConfiguredProfile(draft), [draft])
  const draftProjects = useMemo(() => getConfiguredProjects(draft), [draft])
  const activeProject = draftProjects.find((project) => project.slug === activeSlug) ?? draftProjects[0]

  const updateProfile = (key: keyof SiteProfile, value: string) => {
    setDraft((current) => ({
      ...current,
      profile: {
        ...current.profile,
        [key]: value,
      },
    }))
  }

  const updateProject = (slug: string, value: ProjectOverride) => {
    setDraft((current) => ({
      ...current,
      projects: {
        ...current.projects,
        [slug]: {
          ...current.projects?.[slug],
          ...value,
        },
      },
    }))
  }

  const updateProjectTheme = (slug: string, key: keyof Project['theme'], value: string) => {
    setDraft((current) => {
      const existing = current.projects?.[slug]
      return {
        ...current,
        projects: {
          ...current.projects,
          [slug]: {
            ...existing,
            theme: {
              ...existing?.theme,
              [key]: value,
            },
          },
        },
      }
    })
  }

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginError('')

    const hash = await hashPassword(password)
    if (hash === defaultAdminPasswordHash) {
      window.sessionStorage.setItem(adminSessionKey, 'true')
      setIsUnlocked(true)
      setPassword('')
      return
    }

    setLoginError('Password did not match. The default local password is configurable through VITE_ADMIN_PASSWORD_HASH.')
  }

  const save = () => {
    try {
      saveOverrides(draft)
      setAdminNotice('Saved locally. Preview will use these settings.')
      return true
    } catch {
      setAdminNotice('Could not save. The uploaded images may still be too large for browser storage.')
      return false
    }
  }

  const preview = () => {
    if (save()) {
      window.open(import.meta.env.BASE_URL, '_blank')
    }
  }

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'wian-portfolio-config.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const importConfig = async (file: File | undefined) => {
    if (!file) {
      return
    }

    try {
      const text = await file.text()
      setDraft(JSON.parse(text) as PortfolioOverrides)
      setAdminNotice('Config imported into the draft. Click Save local to apply it.')
    } catch {
      setAdminNotice('That JSON file could not be imported.')
    }
  }

  const uploadProfileImage = async (file: File | undefined) => {
    if (!file) {
      return
    }

    try {
      updateProfile('profileImage', await imageFileToDataUrl(file))
      setAdminNotice('Profile image loaded into the draft. Click Preview or Save local to keep it.')
    } catch (error) {
      setAdminNotice(error instanceof Error ? error.message : 'Image upload failed.')
    }
  }

  const uploadProjectImage = async (slug: string, file: File | undefined) => {
    if (!file) {
      return
    }

    try {
      updateProject(slug, { thumbnail: await imageFileToDataUrl(file) })
      setAdminNotice('Film image loaded into the draft. Click Preview or Save local to keep it.')
    } catch (error) {
      setAdminNotice(error instanceof Error ? error.message : 'Image upload failed.')
    }
  }

  const clearProjectThumbnail = (slug: string) => {
    updateProject(slug, { thumbnail: '' })
    setAdminNotice('Custom film image cleared. This film will use the default YouTube thumbnail after saving.')
  }

  const updateProfileImageUrl = (value: string) => {
    const normalized = normalizeImageUrl(value)
    updateProfile('profileImage', normalized)
    if (normalized !== value.trim() && normalized.includes('drive.google.com')) {
      setAdminNotice('Google Drive profile image link converted to a usable image URL.')
    }
  }

  const updateProjectThumbnailUrl = (slug: string, value: string) => {
    const normalized = normalizeImageUrl(value)
    updateProject(slug, { thumbnail: normalized })
    if (normalized !== value.trim() && normalized.includes('drive.google.com')) {
      setAdminNotice('Google Drive thumbnail link converted to a usable image URL.')
    }
  }

  if (!isUnlocked) {
    return (
      <motion.main className="admin-page admin-login" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <section className="admin-panel login-panel">
          <Lock aria-hidden="true" />
          <p className="section-label">Private controls</p>
          <h1>Portfolio admin</h1>
          <p>
            This unlocks local editing controls for the static site. It does not expose private data,
            store secrets, or write to GitHub from the browser.
          </p>
          <form onSubmit={login} className="admin-form">
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </label>
            {loginError && <span className="admin-error">{loginError}</span>}
            <button className="primary-action" type="submit">
              <ShieldCheck aria-hidden="true" />
              Unlock admin
            </button>
          </form>
        </section>
      </motion.main>
    )
  }

  return (
    <motion.main className="admin-page" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <section className="admin-hero">
        <div>
          <p className="section-label">Configuration</p>
          <h1>Portfolio control room</h1>
          <p>
            Edit the copy, links, profile image, thumbnails, tags, and per-film visual tokens.
            Preview saves the current draft locally before opening the public site.
          </p>
        </div>
        <div className="admin-actions">
          <button className="secondary-action" type="button" onClick={preview}>
            <Eye aria-hidden="true" />
            Preview
          </button>
          <button className="secondary-action" type="button" onClick={exportConfig}>
            <Download aria-hidden="true" />
            Export
          </button>
          <label className="secondary-action file-action">
            <Upload aria-hidden="true" />
            Import
            <input type="file" accept="application/json" onChange={(event) => importConfig(event.target.files?.[0])} />
          </label>
          <button className="secondary-action" type="button" onClick={() => setDraft({})}>
            <RotateCcw aria-hidden="true" />
            Clear draft
          </button>
          <button className="primary-action" type="button" onClick={save}>
            <Save aria-hidden="true" />
            Save local
          </button>
        </div>
        {adminNotice && <p className="admin-notice">{adminNotice}</p>}
      </section>

      <section className="admin-grid">
        <div className="admin-panel">
          <h2>Director profile</h2>
          <div className="field-grid">
            <label>
              Headline
              <textarea value={draftProfile.headline} onChange={(event) => updateProfile('headline', event.target.value)} />
            </label>
            <label>
              Intro
              <textarea value={draftProfile.intro} onChange={(event) => updateProfile('intro', event.target.value)} />
            </label>
            <label>
              Statement
              <textarea value={draftProfile.statement} onChange={(event) => updateProfile('statement', event.target.value)} />
            </label>
            <label>
              About title
              <input value={draftProfile.aboutTitle} onChange={(event) => updateProfile('aboutTitle', event.target.value)} />
            </label>
            <label>
              About body
              <textarea value={draftProfile.aboutBody} onChange={(event) => updateProfile('aboutBody', event.target.value)} />
            </label>
            <label>
              Roles
              <input value={draftProfile.roles} onChange={(event) => updateProfile('roles', event.target.value)} />
            </label>
            <label>
              Location
              <input value={draftProfile.location} onChange={(event) => updateProfile('location', event.target.value)} />
            </label>
            <label>
              Profile image URL or Google Drive link
              <input value={draftProfile.profileImage} onChange={(event) => updateProfileImageUrl(event.target.value)} />
              <span>Paste a public Drive share link; it converts automatically.</span>
            </label>
            <label className="upload-field">
              Upload profile image
              <input type="file" accept="image/*" onChange={(event) => uploadProfileImage(event.target.files?.[0])} />
              <span>Compressed and stored locally; it exports with the config.</span>
            </label>
            <label>
              YouTube URL
              <input value={draftProfile.youtubeUrl} onChange={(event) => updateProfile('youtubeUrl', event.target.value)} />
            </label>
            <label>
              LinkedIn URL
              <input value={draftProfile.linkedInUrl} onChange={(event) => updateProfile('linkedInUrl', event.target.value)} />
            </label>
          </div>
        </div>

        <div className="admin-panel project-editor">
          <h2>Film pages</h2>
          <div className="admin-tabs" role="tablist" aria-label="Film editor">
            {draftProjects.map((project) => (
              <button
                type="button"
                className={project.slug === activeSlug ? 'active' : ''}
                onClick={() => setActiveSlug(project.slug)}
                key={project.slug}
              >
                {project.shortTitle}
              </button>
            ))}
          </div>

          {activeProject && (
            <div className="film-admin-card" style={themeStyle(activeProject)}>
              <img src={activeProject.thumbnail} alt="" />
              <div className="field-grid">
                <label>
                  Logline
                  <textarea
                    value={activeProject.logline}
                    onChange={(event) => updateProject(activeProject.slug, { logline: event.target.value })}
                  />
                </label>
                <label>
                  Description
                  <textarea
                    value={activeProject.description}
                    onChange={(event) => updateProject(activeProject.slug, { description: event.target.value })}
                  />
                </label>
                <label>
                  Role
                  <input
                    value={activeProject.role}
                    onChange={(event) => updateProject(activeProject.slug, { role: event.target.value })}
                  />
                </label>
                <label>
                  Tags, comma separated
                  <input
                    value={activeProject.tags.join(', ')}
                    onChange={(event) =>
                      updateProject(activeProject.slug, {
                        tags: event.target.value
                          .split(',')
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </label>
                <label>
                  Custom thumbnail URL or Google Drive link
                  <input
                    value={activeProject.thumbnail}
                    onChange={(event) => updateProjectThumbnailUrl(activeProject.slug, event.target.value)}
                  />
                  <span>Leave blank or clear to use the default YouTube thumbnail.</span>
                </label>
                <label className="upload-field">
                  Upload film image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => uploadProjectImage(activeProject.slug, event.target.files?.[0])}
                  />
                  <span>Compressed locally. Clear it to fall back to YouTube.</span>
                </label>
                <div className="field-command">
                  <span>No custom reference needed?</span>
                  <button className="secondary-action" type="button" onClick={() => clearProjectThumbnail(activeProject.slug)}>
                    Use YouTube default
                  </button>
                </div>
                <label>
                  Background
                  <input
                    type="color"
                    value={activeProject.theme.background}
                    onChange={(event) => updateProjectTheme(activeProject.slug, 'background', event.target.value)}
                  />
                </label>
                <label>
                  Surface
                  <input
                    type="color"
                    value={activeProject.theme.surface}
                    onChange={(event) => updateProjectTheme(activeProject.slug, 'surface', event.target.value)}
                  />
                </label>
                <label>
                  Text
                  <input
                    type="color"
                    value={activeProject.theme.text}
                    onChange={(event) => updateProjectTheme(activeProject.slug, 'text', event.target.value)}
                  />
                </label>
                <label>
                  Accent
                  <input
                    type="color"
                    value={activeProject.theme.accent}
                    onChange={(event) => updateProjectTheme(activeProject.slug, 'accent', event.target.value)}
                  />
                </label>
                <label>
                  Secondary
                  <input
                    type="color"
                    value={activeProject.theme.secondary}
                    onChange={(event) => updateProjectTheme(activeProject.slug, 'secondary', event.target.value)}
                  />
                </label>
                <label>
                  Display font
                  <input
                    value={activeProject.theme.displayFont}
                    onChange={(event) => updateProjectTheme(activeProject.slug, 'displayFont', event.target.value)}
                  />
                </label>
                <label>
                  Body font
                  <input
                    value={activeProject.theme.bodyFont}
                    onChange={(event) => updateProjectTheme(activeProject.slug, 'bodyFont', event.target.value)}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="admin-panel danger-panel">
        <div>
          <h2>Safety model</h2>
          <p>
            This is safe for GitHub Pages because it stores only public portfolio settings in the
            browser. A static website cannot keep a real admin secret or commit changes to GitHub
            without a backend, so exported JSON should be reviewed before copying into code.
          </p>
        </div>
        <button
          className="secondary-action"
          type="button"
          onClick={() => {
            resetOverrides()
            setDraft({})
          }}
        >
          Reset saved local config
        </button>
      </section>
    </motion.main>
  )
}

function App() {
  const { profile, configuredProjects, overrides } = usePortfolioConfig()

  return (
    <div className="app-shell">
      <KineticBackdrop />
      <ScrollProgress />
      <PageLoadSlate />
      <ScrollToTop />
      <SiteHeader profile={profile} />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage profile={profile} configuredProjects={configuredProjects} />} />
          <Route path="/films/:slug" element={<ProjectPage configuredProjects={configuredProjects} />} />
          <Route
            path="/admin"
            element={<AdminPage configuredProjects={configuredProjects} overrides={overrides} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
