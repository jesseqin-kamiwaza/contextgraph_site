'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface AnimatedLogoProps {
  size?: number
  className?: string
  animate?: boolean
}

export function AnimatedLogo({ size = 60, className = '', animate = true }: AnimatedLogoProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!animate || !svgRef.current) return

    const nodes = svgRef.current.querySelectorAll('.logo-node')
    const lines = svgRef.current.querySelectorAll('.logo-line')

    // Initial state
    gsap.set(nodes, { scale: 0, transformOrigin: 'center center' })
    gsap.set(lines, { strokeDasharray: 100, strokeDashoffset: 100 })

    // Animation timeline
    const tl = gsap.timeline({ delay: 0.2 })

    tl.to(nodes, {
      scale: 1,
      duration: 0.5,
      stagger: 0.08,
      ease: 'back.out(1.7)',
    }).to(
      lines,
      {
        strokeDashoffset: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
      },
      '-=0.3'
    )

    // Continuous pulse animation for nodes
    gsap.to(nodes, {
      filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.8))',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: {
        each: 0.2,
        repeat: -1,
        yoyo: true,
      },
    })

    return () => {
      tl.kill()
    }
  }, [animate])

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Connection lines */}
      <line className="logo-line" x1="50" y1="20" x2="25" y2="45" stroke="url(#lineGradient)" strokeWidth="2" />
      <line className="logo-line" x1="50" y1="20" x2="75" y2="45" stroke="url(#lineGradient)" strokeWidth="2" />
      <line className="logo-line" x1="25" y1="45" x2="25" y2="75" stroke="url(#lineGradient)" strokeWidth="2" />
      <line className="logo-line" x1="75" y1="45" x2="75" y2="75" stroke="url(#lineGradient)" strokeWidth="2" />
      <line className="logo-line" x1="25" y1="75" x2="50" y2="90" stroke="url(#lineGradient)" strokeWidth="2" />
      <line className="logo-line" x1="75" y1="75" x2="50" y2="90" stroke="url(#lineGradient)" strokeWidth="2" />
      <line className="logo-line" x1="25" y1="45" x2="75" y2="45" stroke="url(#lineGradient)" strokeWidth="2" />
      <line className="logo-line" x1="50" y1="55" x2="50" y2="90" stroke="url(#lineGradient)" strokeWidth="2" />

      {/* Nodes */}
      <circle className="logo-node" cx="50" cy="20" r="8" fill="url(#nodeGradient)" />
      <circle className="logo-node" cx="25" cy="45" r="7" fill="url(#nodeGradient)" />
      <circle className="logo-node" cx="75" cy="45" r="7" fill="url(#nodeGradient)" />
      <circle className="logo-node" cx="50" cy="55" r="6" fill="url(#nodeGradient)" />
      <circle className="logo-node" cx="25" cy="75" r="6" fill="url(#nodeGradient)" />
      <circle className="logo-node" cx="75" cy="75" r="6" fill="url(#nodeGradient)" />
      <circle className="logo-node" cx="50" cy="90" r="7" fill="url(#nodeGradient)" />

      {/* Gradients */}
      <defs>
        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdba74" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Text logo with icon
export function LogoWithText({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AnimatedLogo size={size} animate={false} />
      <span className="text-xl font-semibold tracking-tight">
        <span className="text-foreground">Context</span>
        <span className="gradient-text">Graph</span>
      </span>
    </div>
  )
}
