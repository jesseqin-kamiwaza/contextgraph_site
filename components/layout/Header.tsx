'use client'

import { useState, useEffect } from 'react'
import { LogoWithText } from '@/components/ui/AnimatedLogo'
import { Button } from '@/components/ui/Button'

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToWaitlist = () => {
    const hero = document.getElementById('hero')
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <LogoWithText size={36} />

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#what-is-context-graph"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            What is Context Graph?
          </a>
          <a
            href="#opportunity"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            The Opportunity
          </a>
          <a
            href="#marketplace"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Marketplace
          </a>
        </nav>

        <Button onClick={scrollToWaitlist} size="sm">
          Join Waitlist
        </Button>
      </div>
    </header>
  )
}
