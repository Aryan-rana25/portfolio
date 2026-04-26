import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-scroll'
import { FiGithub, FiLinkedin, FiArrowDown, FiDownload } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import CanvasErrorBoundary from './CanvasErrorBoundary'

const HeroCanvas = lazy(() => import('./HeroCanvas'))

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function Hero() {
  const { isDark } = useTheme()
  const accent = isDark ? '#2997ff' : '#0071e3'
  const textPrimary   = isDark ? '#f5f5f7' : '#1d1d1f'
  const textSecondary = isDark ? '#a1a1a6' : '#6e6e73'

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: isDark ? '#000000' : '#ffffff' }}
    >
      <CanvasErrorBoundary>
        <Suspense fallback={null}>
          <HeroCanvas isDark={isDark} />
        </Suspense>
      </CanvasErrorBoundary>

      {/* Radial tint behind content */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 70% 60% at 70% 50%, rgba(41,151,255,0.07) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 70% 60% at 70% 50%, rgba(0,113,227,0.05) 0%, transparent 70%)',
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 lg:px-20 pt-24 pb-16"
      >
        <div className="max-w-xl lg:max-w-2xl">
          <motion.p
            variants={item}
            className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-4 sm:mb-6"
            style={{ color: accent }}
          >
            Full-Stack Developer
          </motion.p>

          <motion.h1 variants={item} className="heading-xl mb-4 sm:mb-6" style={{ color: textPrimary }}>
            Crafting<br />
            <span style={{ color: accent }}>digital</span><br />
            experiences.
          </motion.h1>

          <motion.p
            variants={item}
            className="body-lg mb-8 sm:mb-10 max-w-md"
            style={{ color: textSecondary }}
          >
            I build scalable, high-performance web apps with the MERN stack.
            Clean code, great UX, pixel-perfect design.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-14">
            <Link to="projects" smooth duration={600} offset={-56}>
              <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="apple-btn-primary">
                View Work
              </motion.span>
            </Link>
            <Link to="contact" smooth duration={600} offset={-56}>
              <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="apple-btn-secondary">
                Contact Me
              </motion.span>
            </Link>
            <motion.a
              href="/Resume.pdf"
              download="Aryan_Resume.pdf"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="apple-btn-secondary flex items-center gap-2"
            >
              <FiDownload size={15} />
              Resume
            </motion.a>
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-5">
            {[
              { icon: FiGithub,   href: 'https://github.com/',   label: 'GitHub' },
              { icon: FiLinkedin, href: 'https://linkedin.com/', label: 'LinkedIn' },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.2, y: -2 }}
                style={{ color: textSecondary }}
              >
                <Icon size={19} />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10"
        style={{ color: isDark ? '#3a3a3c' : '#c7c7cc' }}
      >
        <Link to="about" smooth duration={600} offset={-56} className="cursor-pointer">
          <FiArrowDown size={18} />
        </Link>
      </motion.div>
    </section>
  )
}
