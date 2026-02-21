import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

// Asset URLs (keeping original images, replacing branding)
const ASSETS = {
  heroGif: 'https://cdn.prod.website-files.com/68af31ddf12f0b14be84dba1/68bda3bb47ddddd3659d54d3_Main-Guy2.gif',
  laptopGif: 'https://cdn.prod.website-files.com/68af31ddf12f0b14be84dba1/68b7949841b31d8f52405755_Laptop-Ladies2_Width560.gif',
  brainOutline: 'https://cdn.prod.website-files.com/68af31ddf12f0b14be84dba1/68b7764b7928e6a7ff385790_brain-outline.png',
  hammerOutline: 'https://cdn.prod.website-files.com/68af31ddf12f0b14be84dba1/68b77ac2469af7df69017071_hammer-outline.png',
  globeOutline: 'https://cdn.prod.website-files.com/68af31ddf12f0b14be84dba1/68b77bb9d97eebf3666569be_globe-outline.png',
  arrowRight: 'https://cdn.prod.website-files.com/68af31ddf12f0b14be84dba1/68b37d56dcd4bbf1b4b9e32b_right-arrow.svg',
  arrowDown: 'https://cdn.prod.website-files.com/68af31ddf12f0b14be84dba1/6907af679e2deb54cc11e957_arrow-down.svg',
  snapback: 'https://cdn.prod.website-files.com/68af31ddf12f0b14be84dba1/68b200ab4ec523255712bae8_snapback-sports.webp',
  blip: 'https://cdn.prod.website-files.com/68af31ddf12f0b14be84dba1/68b200d0d47eda9a2e3718b3_blip.webp',
  eightai: 'https://cdn.prod.website-files.com/68af31ddf12f0b14be84dba1/68c162cf3571f72a7891c9b5_eightAI%20Logomark%20(2).png',
  garman: 'https://cdn.prod.website-files.com/68af31ddf12f0b14be84dba1/68c162dedb665b096fbb91d2_Group%201%20(1).png',
  eightaiTestimonial: 'https://cdn.prod.website-files.com/68af32cbd5555c406456f114/68c0881d11b38883b0b06121_eightAI%20Logomark.png',
  garmanTestimonial: 'https://cdn.prod.website-files.com/68af32cbd5555c406456f114/68c08a09c9615dd872d953ef_garman-homes.png',
  snapbackTestimonial: 'https://cdn.prod.website-files.com/68af32cbd5555c406456f114/68bdaf64d9282a20f316cafd_snapback-sports-logo.webp',
  gogglesGif: 'https://cdn.prod.website-files.com/68af31ddf12f0b14be84dba1/68b794d5d51d8c79b4eb5d81_Goggles.gif',
}

// --- Scroll animation hook (replaces framer-motion) ---
function useInView(options = {}) {
  const { threshold = 0.15, once = true } = options
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.unobserve(element)
        }
      },
      { threshold }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, once])

  return [ref, isInView]
}

// Animated wrapper component
function Animate({ children, animation = 'fade-up', delay = 0, className = '', style = {}, ...props }) {
  const [ref, isInView] = useInView()
  return (
    <div
      ref={ref}
      className={`anim ${animation} ${isInView ? 'in-view' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

// --- Cilantro Logo SVG ---
function CilantroLogo({ height = 28, color = '#fff' }) {
  return (
    <svg height={height} viewBox="0 0 180 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="4" width="24" height="24" rx="6" fill="#ff6b00" />
      <rect x="5" y="9" width="6" height="6" rx="1.5" fill="#fff" />
      <rect x="13" y="9" width="6" height="6" rx="1.5" fill="#fff" />
      <rect x="5" y="17" width="6" height="6" rx="1.5" fill="#fff" />
      <rect x="13" y="17" width="6" height="6" rx="1.5" fill="#fff" />
      <text x="32" y="24" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="22" fill={color}>Cilantro</text>
    </svg>
  )
}

function CilantroIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#ff6b00" />
      <rect x="8" y="8" width="13" height="13" rx="3" fill="#fff" />
      <rect x="27" y="8" width="13" height="13" rx="3" fill="#fff" />
      <rect x="8" y="27" width="13" height="13" rx="3" fill="#fff" />
      <rect x="27" y="27" width="13" height="13" rx="3" fill="#fff" />
    </svg>
  )
}

// --- Data ---
const faqItems = [
  {
    question: 'How is Cilantro Engineering different from a dev shop?',
    answer: 'We\'re not your stereotypical offshore dev shop. We\'re SF-based 10x engineers who are incentivized to deliver quality software. We work across the startup-to-enterprise spectrum with AI-accelerated engineering squads that ship features, not hours.',
  },
  {
    question: 'What does AI transformation mean?',
    answer: 'The process by which we identify your company\'s biggest bottlenecks, create scalable & effective AI-driven solutions to increase profits, train & upskill your people to use these solutions reliably, and repeat the virtuous cycle.',
  },
  {
    question: 'How does pricing work?',
    answer: 'Engineering uses a monthly subscription model. Transformation uses custom partnerships. We recommend scheduling a call to discuss specifics based on your unique needs.',
  },
  {
    question: 'What\'s different about Cilantro compared to other consultancies?',
    answer: 'We only care about one thing: business impact. No 200-slide strategy decks. No 6-month diagnostics. No strategy without implementation. We\'re just a group of proven builders helping you disrupt yourself before others do.',
  },
  {
    question: 'How do your AI engineering services work?',
    answer: 'We operate on an outcome-based subscription model. You pay for features delivered, not hours logged. Our AI-accelerated engineering squads leverage the latest tools to ship software faster and more affordably.',
  },
  {
    question: 'What kind of companies do you typically work with?',
    answer: 'At-scale companies (>$25 million revenue) that are motivated to become AI-first, but lack the resources internally to make that happen.',
  },
]

// --- Small components ---
function ArrowUpRight({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className="arrow">
      <path d="M1 13L13 1M13 1H3M13 1V11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// --- Sections ---
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <a href="/" className="logo-link">
            <CilantroLogo />
          </a>
          <button className="burger-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
      <div className={`nav-overlay ${menuOpen ? 'open' : ''}`}>
        <div className="nav-overlay-links">
          <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#approach" onClick={() => setMenuOpen(false)}>AI Transformation</a>
          <a href="#approach" onClick={() => setMenuOpen(false)}>AI Engineering</a>
          <a href="#" onClick={() => setMenuOpen(false)}>Who We Are</a>
          <a href="#" onClick={() => setMenuOpen(false)}>Resources</a>
          <a href="#cta" onClick={() => setMenuOpen(false)}>Get Started</a>
        </div>
      </div>
    </>
  )
}

function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setLoaded(true) }, [])

  return (
    <section className="hero-section">
      <div className="hero-image-wrapper">
        <img
          src={ASSETS.heroGif}
          alt="Greek statue holding a phone"
          className={`hero-statue anim scale-in ${loaded ? 'in-view' : ''}`}
        />
        <h1 className={`hero-headline anim fade-up ${loaded ? 'in-view' : ''}`} style={{ transitionDelay: '400ms' }}>
          Disrupt yourself.
        </h1>
      </div>
      <div className={`hero-bottom anim fade-up ${loaded ? 'in-view' : ''}`} style={{ transitionDelay: '700ms' }}>
        <div className="container">
          <div className="hero-tagline">
            <h2>Your <span className="accent">AI partner.</span></h2>
            <p>We set and execute your AI strategy at startup speed.</p>
          </div>
          <div className="hero-line">
            <div className="hero-line-inner"></div>
          </div>
          <a href="#approach" className="btn-learn-more">
            Learn more <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  )
}

function HowWeWorkSection() {
  const cards = [
    {
      title: 'Strategy',
      desc: 'No 6-month strategy work. No 200-slide presentations. We get right to work on holistic & function-specific audits that surface the most compelling AI use cases.',
      icon: ASSETS.brainOutline,
    },
    {
      title: 'Transformation',
      desc: 'Custom partnership that combines bespoke change management & AI tooling with baseline metrics to drive measurable ROI.',
      icon: ASSETS.hammerOutline,
    },
    {
      title: 'Engineering',
      desc: 'Outcome-based, subscription-style engineering squads that leverage AI acceleration to ship software faster and more affordably.',
      icon: ASSETS.globeOutline,
    },
  ]

  return (
    <section className="hww-section" id="approach">
      <div className="container">
        <div className="hww-label">OUR APPROACH</div>
        <div className="hww-grid">
          <div className="hww-left">
            <Animate animation="fade-up">
              <h2 className="hww-heading"><span className="hww-accent">Cilantro</span> helps you shift from AI-absent to AI-native.</h2>
            </Animate>
            <Animate animation="fade-up" delay={150}>
              <CilantroIcon size={48} />
            </Animate>
          </div>
          <div className="hww-right">
            {cards.map((card, i) => (
              <Animate animation="fade-up" delay={i * 120} key={i}>
                <div className="hww-card">
                  <div className="hww-card-content">
                    <h3 className="hww-title">{card.title}</h3>
                    <p className="hww-desc">{card.desc}</p>
                    <span className="hww-link">Learn more <ArrowUpRight size={14} /></span>
                  </div>
                  <div className="hww-card-icon">
                    <img src={card.icon} alt="" className="hww-icon" />
                  </div>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function DisruptionSection() {
  return (
    <section className="disruption-section">
      <div className="container">
        <div className="disruption-content">
          <Animate animation="fade-up">
            <h2 className="disruption-heading">You have a choice. <span className="disruption-pixel">Disrupt yourself.</span><br /><span className="disruption-accent">Or be disrupted by others.</span></h2>
          </Animate>
          <Animate animation="fade-up" delay={150}>
            <p className="disruption-body">
              AI isn't coming. it's here. The companies that win the next decade will be the ones that transform now. We don't care about today. We care about the next decade. And helping you win it.
            </p>
          </Animate>
          <Animate animation="fade-up" delay={300}>
            <a href="#cta" className="btn-get-started">Get started</a>
          </Animate>
        </div>
      </div>
    </section>
  )
}

function ScarySection() {
  return (
    <section className="scary-section">
      <div className="scary-grid-bg"></div>
      <div className="scary-layout">
        <Animate animation="scale-in">
          <div className="scary-image">
            <img src={ASSETS.gogglesGif} alt="Statue with VR headset" />
          </div>
        </Animate>
        <Animate animation="fade-up" delay={200}>
          <div className="scary-text">
            <h2>AI isn't scary. <span className="scary-pixel">Ignoring it is.</span></h2>
          </div>
        </Animate>
      </div>
    </section>
  )
}

function MarqueeSection() {
  const text = 'Built by builders, trusted by leaders'
  const items = Array(10).fill(text)
  return (
    <Animate animation="fade-in">
      <section className="marquee-section">
        <div className="marquee-track">
          {items.map((item, i) => (
            <span key={i} className="marquee-text">{item} <span className="dot"></span></span>
          ))}
        </div>
      </section>
    </Animate>
  )
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)
  const toggle = (index) => setOpenIndex(openIndex === index ? null : index)

  return (
    <section className="faq-section">
      <div className="container">
        <Animate animation="fade-up">
          <h2 className="faq-heading">Questions? We have answers</h2>
        </Animate>
        <div className="faq-list">
          {faqItems.map((item, i) => (
            <Animate key={i} animation="fade-up" delay={i * 100}>
              <div className={`faq-item ${openIndex === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => toggle(i)}>
                  {item.question}
                  <img src={ASSETS.arrowDown} alt="" className="faq-icon" />
                </button>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </div>
            </Animate>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="cta-section" id="cta">
      <div className="container">
        <div className="cta-top">
          <Animate animation="scale-in">
            <CilantroIcon size={48} />
          </Animate>
          <Animate animation="fade-up" delay={100}>
            <h2 className="cta-heading">Stay on the right side of history.</h2>
          </Animate>
          <Animate animation="fade-up" delay={200}>
            <a href="#" className="btn-cta">
              Get Started <ArrowUpRight size={16} />
            </a>
          </Animate>
        </div>
      </div>
      <Animate animation="scale-in" delay={200}>
        <div className="cta-image-wrap">
          <img src={ASSETS.laptopGif} alt="People working with AI" className="cta-image" />
        </div>
      </Animate>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <Animate animation="fade-up">
          <div className="footer-inner">
            <div className="footer-left">
              <a href="/">
                <CilantroLogo height={24} />
              </a>
              <span className="footer-copy">&copy; 2026 Cilantro. All rights reserved.</span>
            </div>
            <div className="footer-right">
              <a href="mailto:hello@cilantro.ai" className="footer-email">hello@cilantro.ai</a>
            </div>
          </div>
        </Animate>
      </div>
    </footer>
  )
}

function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HowWeWorkSection />
      <DisruptionSection />
      <ScarySection />
      <MarqueeSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  )
}

export default App
