import { useRef, lazy, Suspense } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import CanvasErrorBoundary from './CanvasErrorBoundary'

const AboutCanvas = lazy(() => import('./AboutCanvas'))

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

const stats = [
  { value: '2+',   label: 'Years Exp.' },
  { value: '20+',  label: 'Projects' },
  { value: '10+',  label: 'Clients' },
  { value: '100%', label: 'Passion' },
]

export default function About() {
  const { isDark } = useTheme()
  const bg            = isDark ? '#000000' : '#ffffff'
  const surface       = isDark ? '#1d1d1f' : '#f5f5f7'
  const textPrimary   = isDark ? '#f5f5f7' : '#1d1d1f'
  const textSecondary = isDark ? '#a1a1a6' : '#6e6e73'
  const accent        = isDark ? '#2997ff' : '#0071e3'
  const border        = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  return (
    <section id="about" className="section-pad" style={{ background: surface }}>
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase mb-3" style={{ color: accent }}>
            About Me
          </p>
          <h2 className="heading-lg mb-12 sm:mb-16 lg:mb-20" style={{ color: textPrimary }}>
            Developer.<br />
            <span style={{ color: textSecondary }}>Creator. Problem-solver.</span>
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 sm:mb-16 lg:mb-20">
          {/* 3D Blob canvas */}
          <FadeUp delay={0.1}>
            <div
              className="rounded-2xl sm:rounded-3xl overflow-hidden w-full"
              style={{ height: 280, background: bg }}
            >
              <div className="sm:hidden w-full h-full flex items-center justify-center"
                style={{ display: 'none' }}>
              </div>
              <CanvasErrorBoundary>
                <Suspense fallback={null}>
                  <AboutCanvas isDark={isDark} />
                </Suspense>
              </CanvasErrorBoundary>
            </div>
          </FadeUp>

          {/* Text */}
          <div className="space-y-5 sm:space-y-7">
            <FadeUp delay={0.12}>
              <h3 className="heading-md" style={{ color: textPrimary }}>
                Building the web,<br />one component at a time.
              </h3>
            </FadeUp>
            <FadeUp delay={0.18}>
              <p className="body-md" style={{ color: textSecondary }}>
                I'm a passionate full-stack developer specialising in the MERN stack. I love turning
                complex problems into simple, beautiful, and intuitive solutions.
              </p>
            </FadeUp>
            <FadeUp delay={0.24}>
              <p className="body-md" style={{ color: textSecondary }}>
                When I'm not coding, I'm exploring new technologies, contributing to open-source,
                and pushing the limits of what's possible on the web.
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="flex flex-wrap gap-2">
                {['Available for Freelance', 'Open to Work', 'Remote Friendly'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.07}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center"
                style={{ background: bg, border: `1px solid ${border}` }}
              >
                <p className="text-2xl sm:text-4xl font-bold mb-1" style={{ color: accent }}>{s.value}</p>
                <p className="text-xs sm:text-sm" style={{ color: textSecondary }}>{s.label}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
