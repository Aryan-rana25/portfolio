import { useRef, useState, lazy, Suspense } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiMail, FiMapPin, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import axios from 'axios'
import { useTheme } from '../context/ThemeContext'
import CanvasErrorBoundary from './CanvasErrorBoundary'

const ContactCanvas = lazy(() => import('./ContactCanvas'))

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

const initialForm = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm]     = useState(initialForm)
  const [status, setStatus] = useState(null)
  const [errors, setErrors] = useState({})
  const { isDark }          = useTheme()

  const bg            = isDark ? '#000000' : '#ffffff'
  const surface       = isDark ? '#1d1d1f' : '#f5f5f7'
  const textPrimary   = isDark ? '#f5f5f7' : '#1d1d1f'
  const textSecondary = isDark ? '#a1a1a6' : '#6e6e73'
  const accent        = isDark ? '#2997ff' : '#0071e3'
  const border        = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const inputBg       = isDark ? '#2d2d2f' : '#ffffff'

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.subject.trim()) e.subject = 'Required'
    if (form.message.trim().length < 10) e.message = 'At least 10 characters'
    return e
  }

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setErrors((p) => ({ ...p, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStatus('loading')
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, form)
      setStatus('success')
      setForm(initialForm)
    } catch {
      setStatus('error')
    }
  }

  const inputStyle = (field) => ({
    background: inputBg,
    border: `1px solid ${errors[field] ? '#ff453a' : border}`,
    color: textPrimary,
    borderRadius: 12,
    padding: '11px 14px',
    width: '100%',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
    WebkitAppearance: 'none',
  })

  return (
    <section id="contact" className="relative section-pad overflow-hidden" style={{ background: bg }}>
      {/* 3D network background */}
      <CanvasErrorBoundary>
        <Suspense fallback={null}>
          <ContactCanvas isDark={isDark} />
        </Suspense>
      </CanvasErrorBoundary>

      {/* Subtle overlay so text stays readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 100%)'
            : 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.82) 100%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <FadeUp>
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase mb-3" style={{ color: accent }}>
            Contact
          </p>
          <h2 className="heading-lg mb-12 sm:mb-16 lg:mb-20" style={{ color: textPrimary }}>
            Let's build<br />
            <span style={{ color: textSecondary }}>something great.</span>
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-5 gap-8 md:gap-12">
          {/* Left info */}
          <FadeUp delay={0.1} className="md:col-span-2 space-y-6 sm:space-y-8">
            <p className="body-md" style={{ color: textSecondary }}>
              Have a project in mind? I'd love to hear about it. Drop me a message and I'll get back to you as soon as possible.
            </p>

            {[
              { icon: FiMail,   label: 'Email',    value: 'bytecrafted.dev@gmail.com', href: 'mailto:bytecrafted.dev@gmail.com' },
              { icon: FiMapPin, label: 'Location', value: 'India', href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <motion.div key={label} whileHover={{ x: 4 }} className="flex items-center gap-3 sm:gap-4">
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${accent}18` }}
                >
                  <Icon size={15} style={{ color: accent }} />
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: textSecondary }}>{label}</p>
                  {href
                    ? <a href={href} className="text-xs sm:text-sm font-medium break-all" style={{ color: textPrimary }}>{value}</a>
                    : <p className="text-xs sm:text-sm font-medium" style={{ color: textPrimary }}>{value}</p>
                  }
                </div>
              </motion.div>
            ))}

            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-green-400">Available for new projects</span>
            </motion.div>
          </FadeUp>

          {/* Form */}
          <FadeUp delay={0.15} className="md:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="space-y-3 sm:space-y-4 rounded-2xl p-5 sm:p-7 lg:p-8"
              style={{ background: isDark ? 'rgba(29,29,31,0.8)' : 'rgba(245,245,247,0.85)', border: `1px solid ${border}`, backdropFilter: 'blur(12px)' }}
            >
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" style={inputStyle('name')} />
                  {errors.name && <p className="text-xs mt-1" style={{ color: '#ff453a' }}>{errors.name}</p>}
                </div>
                <div>
                  <input name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle('email')} />
                  {errors.email && <p className="text-xs mt-1" style={{ color: '#ff453a' }}>{errors.email}</p>}
                </div>
              </div>

              <div>
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" style={inputStyle('subject')} />
                {errors.subject && <p className="text-xs mt-1" style={{ color: '#ff453a' }}>{errors.subject}</p>}
              </div>

              <div>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  rows={5}
                  style={{ ...inputStyle('message'), resize: 'none' }}
                />
                {errors.message && <p className="text-xs mt-1" style={{ color: '#ff453a' }}>{errors.message}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={status === 'loading'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 sm:py-3.5 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all"
                style={{ background: accent, color: '#ffffff', opacity: status === 'loading' ? 0.7 : 1 }}
              >
                {status === 'loading'
                  ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⟳</motion.span>
                  : <><FiSend size={13} /> Send Message</>
                }
              </motion.button>

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-xs sm:text-sm p-3 rounded-xl"
                  style={{ background: 'rgba(52,199,89,0.1)', color: '#34c759', border: '1px solid rgba(52,199,89,0.2)' }}
                >
                  <FiCheckCircle size={13} /> Message sent! I'll get back to you soon.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-xs sm:text-sm p-3 rounded-xl"
                  style={{ background: 'rgba(255,69,58,0.1)', color: '#ff453a', border: '1px solid rgba(255,69,58,0.2)' }}
                >
                  <FiAlertCircle size={13} /> Something went wrong. Please try again.
                </motion.div>
              )}
            </form>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
