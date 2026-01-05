'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { AnimatedLogo } from '@/components/ui/AnimatedLogo'
import { WaitlistForm } from '@/components/ui/WaitlistForm'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const elements = [badgeRef.current, headingRef.current, taglineRef.current, formRef.current]

    // Only animate if all elements exist
    if (!elements.every(el => el)) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(
      badgeRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.2 }
    )
      .fromTo(
        headingRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.3'
      )
      .fromTo(
        taglineRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        formRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.3'
      )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden"
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Animated Logo */}
        <div className="flex justify-center mb-8">
          <AnimatedLogo size={100} />
        </div>

        {/* Coming Soon Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-8">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-accent text-sm font-medium tracking-wide uppercase">
            Coming Soon
          </span>
        </div>

        {/* Main Heading */}
        <h1
          ref={headingRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="text-foreground">The Marketplace for</span>
          <br />
          <span className="gradient-text">Context Graphs</span>
        </h1>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Turn tribal knowledge into searchable precedent. Download enterprise-grade context graphs
          or contribute your own to the community.
        </p>

        {/* Waitlist Form */}
        <div ref={formRef} className="max-w-md mx-auto">
          <WaitlistForm size="lg" />
          <p className="mt-4 text-muted-foreground text-sm">
            Join <span className="text-accent font-medium">500+</span> early adopters shaping the future of AI memory.
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  )
}
