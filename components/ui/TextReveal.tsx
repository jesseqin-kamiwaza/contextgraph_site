'use client'

import { useRef, useEffect, ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TextRevealProps {
  children: ReactNode
  animation?: 'slideUp' | 'fadeIn' | 'scaleIn'
  delay?: number
  duration?: number
  className?: string
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4'
  stagger?: number
}

export function TextReveal({
  children,
  animation = 'slideUp',
  delay = 0,
  duration = 0.8,
  className = '',
  as: Component = 'div',
  stagger = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const animations = {
      slideUp: {
        from: { y: 60, autoAlpha: 0 },
        to: { y: 0, autoAlpha: 1 },
      },
      fadeIn: {
        from: { autoAlpha: 0 },
        to: { autoAlpha: 1 },
      },
      scaleIn: {
        from: { scale: 0.8, autoAlpha: 0 },
        to: { scale: 1, autoAlpha: 1 },
      },
    }

    const anim = animations[animation]

    gsap.set(element, anim.from)

    const tween = gsap.to(element, {
      ...anim.to,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })

    return () => {
      tween.kill()
    }
  }, [animation, delay, duration, stagger])

  return (
    // @ts-expect-error - dynamic component type
    <Component ref={ref} className={className} style={{ visibility: 'hidden' }}>
      {children}
    </Component>
  )
}
