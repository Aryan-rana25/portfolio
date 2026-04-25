import { useRef, lazy, Suspense } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import CanvasErrorBoundary from './CanvasErrorBoundary'

const SkillsCanvas = lazy(() => import('./SkillsCanvas'))

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

function SkillBar({ name, level, accent, surface, textPrimary, textSecondary, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-xs sm:text-sm">
        <span style={{ color: textPrimary }}>{name}</span>
        <span style={{ color: textSecondary }}>{level}%</span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: `${accent}20` }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.1, delay, ease: [0.25, 0.1, 0.25, 1] }}
          className="h-full rounded-full"
          style={{ background: accent }}
        />
      </div>
    </div>
  )
}

const skillGroups = [
  {
    category: 'Frontend',
    skills: [
      { name: 'React / Next.js', level: 90 },
      { name: 'TypeScript', level: 78 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'Framer Motion', level: 82 },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js / Express', level: 88 },
      { name: 'MongoDB', level: 84 },
      { name: 'REST APIs', level: 92 },
      { name: 'PostgreSQL', level: 72 },
    ],
  },
  {
    category: 'Tools',
    skills: [
      { name: 'Git & GitHub', level: 90 },
      { name: 'Docker', level: 66 },
      { name: 'Linux', level: 76 },
      { name: 'Postman', level: 88 },
    ],
  },
]

const techStack = [
  'React', 'Node.js', 'MongoDB', 'Express', 'TypeScript',
  'Tailwind', 'Three.js', 'Docker', 'Git', 'PostgreSQL',
  'Redux', 'JWT', 'GraphQL', 'Next.js', 'Vite',
]

export default function Skills() {
  const { isDark } = useTheme()
  const bg            = isDark ? '#000000' : '#ffffff'
  const surface       = isDark ? '#1d1d1f' : '#f5f5f7'
  const textPrimary   = isDark ? '#f5f5f7' : '#1d1d1f'
  const textSecondary = isDark ? '#a1a1a6' : '#6e6e73'
  const accent        = isDark ? '#2997ff' : '#0071e3'
  const border        = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  return (
    <section id="skills" className="section-pad" style={{ background: bg }}>
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase mb-3" style={{ color: accent }}>
            Skills
          </p>
          <h2 className="heading-lg mb-12 sm:mb-16 lg:mb-20" style={{ color: textPrimary }}>
            The tools<br />
            <span style={{ color: textSecondary }}>I work with.</span>
          </h2>
        </FadeUp>

        {/* Globe on top for mobile, side-by-side on lg */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16 items-center">
          <FadeUp delay={0.05}>
            <div
              className="rounded-2xl overflow-hidden w-full"
              style={{ height: 320, background: surface, border: `1px solid ${border}` }}
            >
              <CanvasErrorBoundary>
                <Suspense fallback={null}>
                  <SkillsCanvas isDark={isDark} />
                </Suspense>
              </CanvasErrorBoundary>
            </div>
          </FadeUp>

          <div className="space-y-4 sm:space-y-5">
            {skillGroups.map((group, gi) => (
              <FadeUp key={group.category} delay={gi * 0.09}>
                <div className="rounded-xl sm:rounded-2xl p-5 sm:p-6" style={{ background: surface, border: `1px solid ${border}` }}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 sm:mb-5" style={{ color: accent }}>
                    {group.category}
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {group.skills.map((skill, si) => (
                      <SkillBar
                        key={skill.name}
                        {...skill}
                        accent={accent}
                        surface={surface}
                        textPrimary={textPrimary}
                        textSecondary={textSecondary}
                        delay={gi * 0.09 + si * 0.05}
                      />
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* Marquee */}
        <FadeUp delay={0.2}>
          <div className="overflow-hidden">
            <div className="flex gap-2 sm:gap-3" style={{ animation: 'marquee 22s linear infinite' }}>
              {[...techStack, ...techStack].map((tech, i) => (
                <span
                  key={i}
                  className="shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap"
                  style={{ background: surface, color: textSecondary, border: `1px solid ${border}` }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <style>{`@keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
        </FadeUp>
      </div>
    </section>
  )
}
