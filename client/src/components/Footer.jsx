import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { Link } from 'react-scroll'
import { useTheme } from '../context/ThemeContext'

export default function Footer() {
  const { isDark } = useTheme()
  const surface       = isDark ? '#1d1d1f' : '#f5f5f7'
  const textPrimary   = isDark ? '#f5f5f7' : '#1d1d1f'
  const textSecondary = isDark ? '#6e6e73' : '#a1a1a6'
  const border        = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  return (
    <footer style={{ background: surface, borderTop: `1px solid ${border}` }} className="py-6 sm:py-8 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
        <Link to="hero" smooth duration={600} className="cursor-pointer">
          <span className="text-sm sm:text-base font-semibold" style={{ color: textPrimary }}>
            Aryan Rana
          </span>
        </Link>

        <p className="text-xs text-center" style={{ color: textSecondary }}>
          © {new Date().getFullYear()} · Built with React, Three.js & Node.js
        </p>

        <div className="flex items-center gap-4 sm:gap-5">
          {[
            { icon: FiGithub,   href: 'https://github.com/',                      label: 'GitHub' },
            { icon: FiLinkedin, href: 'https://linkedin.com/',                    label: 'LinkedIn' },
            { icon: FiMail,     href: 'mailto:bytecrafted.dev@gmail.com',         label: 'Email' },
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
              <Icon size={15} />
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  )
}
