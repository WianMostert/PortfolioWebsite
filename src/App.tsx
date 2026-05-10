import { useEffect, useLayoutEffect, useState, type CSSProperties } from 'react'
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
} from 'lucide-react'
import './App.css'
import { findProject, projects, type Project } from './data/projects'

const channelUrl = 'https://www.youtube.com/@WianMostertDirector'
const linkedInUrl = 'https://www.linkedin.com/in/wian-mostert-594820253/'
const profileImage = '/wian-headshot.png'

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

function SiteHeader() {
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
        <a href={linkedInUrl} target="_blank" rel="noreferrer">
          LinkedIn
          <ArrowUpRight aria-hidden="true" />
        </a>
        <a href={channelUrl} target="_blank" rel="noreferrer">
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

function FilmMarquee() {
  const items = projects.flatMap((project) => [project.shortTitle, project.role])

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

function HomePage() {
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
          <h1>South African short films shaped by memory, pressure, and genre.</h1>
          <p className="hero-intro">
            Wian Mostert builds cinematic shorts across poetic essay film, western chaos,
            sci-fi tension, psychological drama, and action-driven experiments.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href={channelUrl} target="_blank" rel="noreferrer">
              <Play aria-hidden="true" />
              Watch the channel
            </a>
            <a className="secondary-action" href={linkedInUrl} target="_blank" rel="noreferrer">
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
              src={profileImage}
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
            {projects.slice(0, 4).map((project) => (
              <img src={project.thumbnail} alt="" key={project.id} />
            ))}
          </div>
        </motion.div>
      </section>

      <FilmMarquee />

      <section className="profile-band" aria-label="Director profile" id="profile">
        <motion.div
          className="profile-statement"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
        >
          <Clapperboard aria-hidden="true" />
          <p>
            Director, cinematographer, and editor working from South Africa with a focus
            on short-form cinematic storytelling. This portfolio is organised like a
            slate: each film opens into its own visual world, with a palette and type
            system drawn from the project&apos;s subject, thumbnail, and genre language.
          </p>
        </motion.div>
        <div className="profile-facts" aria-label="Portfolio facts">
          <span>
            <Camera aria-hidden="true" />
            Director / Cinematographer / Editor
          </span>
          <span>
            <MapPin aria-hidden="true" />
            South Africa
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
          <h2>Built around the person behind the camera.</h2>
          <p>
            The homepage now gives visitors a stronger sense of Wian before they enter
            the individual film pages, with a profile image area, LinkedIn pathway,
            role language, and a reel of project stills.
          </p>
        </div>
        <div className="still-stack">
          {projects.slice(4, 9).map((project) => (
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
          {projects.map((project, index) => (
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

function ProjectPage() {
  const { slug } = useParams()
  const project = findProject(slug)
  const reduceMotion = useReducedMotion()

  if (!project) {
    return <NotFound />
  }

  const related = projects.filter((item) => item.id !== project.id).slice(0, 3)

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

function App() {
  return (
    <div className="app-shell">
      <KineticBackdrop />
      <ScrollProgress />
      <PageLoadSlate />
      <ScrollToTop />
      <SiteHeader />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/films/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
