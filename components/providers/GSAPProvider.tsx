'use client'

import { useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

gsap.registerPlugin(ScrollTrigger)

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  useIsomorphicLayoutEffect(() => {
    // Set defaults for GSAP
    gsap.defaults({
      ease: 'power3.out',
      duration: 0.8,
    })

    // Refresh ScrollTrigger on resize
    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      // Kill all ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return <>{children}</>
}
