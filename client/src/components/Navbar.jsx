import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-scroll'
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
  { label: 'About', to: 'about' },
  { label: 'Skills', to: 'skills' },
  { label: 'Projects', to: 'projects' },
  { label: 'Contact', to: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isDark, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navBg = scrolled
    ? isDark
      ? 'bg-black/80 border-b border-white/[0.06]'
      : 'bg-white/80 border-b border-black/[0.06]'
    : 'bg-transparent'

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 apple-blur transition-all duration-300 ${navBg}`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
        <Link to="hero" smooth duration={600} className="cursor-pointer">
          <span className={`text-base font-semibold tracking-tight ${isDark ? 'text-white' : 'text-apple-text-light'}`}>
            Aryan Rana
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                smooth
                duration={600}
                offset={-56}
                className={`text-sm cursor-pointer transition-colors ${
                  isDark
                    ? 'text-apple-text-dark-2 hover:text-white'
                    : 'text-apple-text-light-2 hover:text-apple-text-light'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggle}
            aria-label="Toggle theme"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/8 text-apple-text-light hover:bg-black/12'
            }`}
          >
            {isDark ? <FiSun size={14} /> : <FiMoon size={14} />}
          </motion.button>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              isDark ? 'text-white' : 'text-apple-text-light'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`md:hidden overflow-hidden border-t apple-blur ${
              isDark ? 'bg-black/90 border-white/[0.06]' : 'bg-white/90 border-black/[0.06]'
            }`}
          >
            <ul className="flex flex-col py-4 px-6 gap-4">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    smooth
                    duration={600}
                    offset={-56}
                    onClick={() => setMenuOpen(false)}
                    className={`text-base cursor-pointer ${isDark ? 'text-apple-text-dark' : 'text-apple-text-light'}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
