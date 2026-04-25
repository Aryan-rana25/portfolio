import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink, FiArrowUpRight } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack MERN app with JWT auth, Stripe payments, and admin dashboard.',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    category: 'Full Stack',
    github: 'https://github.com/',
    live: 'https://github.com/',
    emoji: '🛒',
  },
  {
    title: 'Task Management App',
    description: 'Collaborative boards with real-time updates via Socket.io and team workspaces.',
    tech: ['React', 'Express', 'Socket.io', 'MongoDB'],
    category: 'Full Stack',
    github: 'https://github.com/',
    live: 'https://github.com/',
    emoji: '✅',
  },
  {
    title: 'AI Chat Interface',
    description: 'GPT-powered chat with conversation history, custom personas, and code highlighting.',
    tech: ['React', 'Node.js', 'OpenAI API'],
    category: 'AI/ML',
    github: 'https://github.com/',
    live: 'https://github.com/',
    emoji: '🤖',
  },
  {
    title: 'Portfolio Website',
    description: 'This portfolio — MERN stack, Framer Motion, Three.js, Apple-inspired design.',
    tech: ['React', 'Three.js', 'Tailwind', 'MongoDB'],
    category: 'Frontend',
    github: 'https://github.com/',
    live: '#',
    emoji: '🌐',
  },
  {
    title: 'REST API Boilerplate',
    description: 'Production-ready Express boilerplate with JWT, rate limiting, and Swagger docs.',
    tech: ['Node.js', 'Express', 'MongoDB', 'Swagger'],
    category: 'Backend',
    github: 'https://github.com/',
    live: 'https://github.com/',
    emoji: '⚙️',
  },
  {
    title: 'Weather Dashboard',
    description: 'Real-time forecasts with geolocation, 7-day forecast, and Chart.js visualisations.',
    tech: ['React', 'Chart.js', 'OpenWeather API'],
    category: 'Frontend',
    github: 'https://github.com/',
    live: 'https://github.com/',
    emoji: '🌤️',
  },
]

const categories = ['All', 'Full Stack', 'Frontend', 'Backend', 'AI/ML']

function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Projects() {
  const [active, setActive] = useState('All')
  const { isDark } = useTheme()

  const bg            = isDark ? '#000000' : '#ffffff'
  const surface       = isDark ? '#1d1d1f' : '#f5f5f7'
  const textPrimary   = isDark ? '#f5f5f7' : '#1d1d1f'
  const textSecondary = isDark ? '#a1a1a6' : '#6e6e73'
  const accent        = isDark ? '#2997ff' : '#0071e3'
  const border        = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active)

  return (
    <section id="projects" className="section-pad" style={{ background: surface }}>
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase mb-3" style={{ color: accent }}>
            Projects
          </p>
          <h2 className="heading-lg mb-10 sm:mb-12" style={{ color: textPrimary }}>
            Things I've<br />
            <span style={{ color: textSecondary }}>built.</span>
          </h2>
        </FadeUp>

        {/* Filter */}
        <FadeUp delay={0.08} className="flex flex-wrap gap-2 mb-8 sm:mb-12">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive(cat)}
              className="px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all"
              style={
                active === cat
                  ? { background: accent, color: '#ffffff' }
                  : { background: bg, color: textSecondary, border: `1px solid ${border}` }
              }
            >
              {cat}
            </motion.button>
          ))}
        </FadeUp>

        {/* Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="rounded-xl sm:rounded-2xl overflow-hidden group"
                style={{ background: bg, border: `1px solid ${border}` }}
              >
                {/* Card header */}
                <div
                  className="h-28 sm:h-32 flex items-center justify-center text-3xl sm:text-4xl relative"
                  style={{ background: `${accent}10` }}
                >
                  <span>{project.emoji}</span>
                  <span
                    className="absolute top-2.5 right-2.5 text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: `${accent}18`, color: accent }}
                  >
                    {project.category}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="font-semibold text-sm sm:text-base" style={{ color: textPrimary }}>
                      {project.title}
                    </h3>
                    <motion.a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.1 }}
                      style={{ color: accent }}
                      className="shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiArrowUpRight size={15} />
                    </motion.a>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed mb-3" style={{ color: textSecondary }}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-1.5 sm:px-2 py-0.5 rounded text-xs font-medium"
                        style={{ background: `${accent}12`, color: accent }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div
                    className="flex items-center gap-4 pt-2"
                    style={{ borderTop: `1px solid ${border}` }}
                  >
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-medium"
                      style={{ color: textSecondary }}
                    >
                      <FiGithub size={12} /> Code
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-medium"
                      style={{ color: accent }}
                    >
                      <FiExternalLink size={12} /> Live
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
