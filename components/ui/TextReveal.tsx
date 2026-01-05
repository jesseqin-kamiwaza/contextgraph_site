'use client'

import { useRef, useEffect, ReactNode, useState } from 'react'
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
  duration = 0.6,
  className = '',
  as: Component = 'div',
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const animations = {
      slideUp: {
        from: { y: 30, opacity: 0 },
        to: { y: 0, opacity: 1 },
      },
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      scaleIn: {
        from: { scale: 0.95, opacity: 0 },
        to: { scale: 1, opacity: 1 },
      },
    }

    const anim = animations[animation]

    // Set initial state
    gsap.set(element, anim.from)

    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 92%',
      onEnter: () => {
        if (!isVisible) {
          setIsVisible(true)
          gsap.to(element, {
            ...anim.to,
            duration,
            delay,
            ease: 'power2.out',
          })
        }
      },
    })

    // Fallback: if element is already in view, animate immediately
    const rect = element.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92 && !isVisible) {
      setIsVisible(true)
      gsap.to(element, {
        ...anim.to,
        duration,
        delay,
        ease: 'power2.out',
      })
    }

    return () => {
      scrollTrigger.kill()
    }
  }, [animation, delay, duration, isVisible])

  return (
    // @ts-expect-error - dynamic component type
    <Component ref={ref} className={className}>
      {children}
    </Component>
  )
}
