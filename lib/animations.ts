import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Animation presets
export const animations = {
  // Text reveal from bottom
  textRevealUp: {
    from: { y: 100, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.02, ease: 'power3.out' },
  },

  // Fade in with slight movement
  fadeInUp: {
    from: { y: 30, autoAlpha: 0 },
    to: { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out' },
  },

  // Card entrance
  cardReveal: {
    from: { y: 50, autoAlpha: 0, scale: 0.95 },
    to: { y: 0, autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.1 },
  },

  // Scale in
  scaleIn: {
    from: { scale: 0, autoAlpha: 0 },
    to: { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.7)' },
  },

  // Slide in from left
  slideInLeft: {
    from: { x: -100, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out' },
  },

  // Slide in from right
  slideInRight: {
    from: { x: 100, autoAlpha: 0 },
    to: { x: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out' },
  },
}

// ScrollTrigger defaults
export const scrollTriggerDefaults = {
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse' as const,
}

type DOMTarget = string | Element | null | undefined

// Create a scroll-triggered animation
export function createScrollAnimation(
  element: gsap.TweenTarget,
  animation: keyof typeof animations,
  options?: {
    trigger?: DOMTarget
    start?: string
    end?: string
    delay?: number
  }
) {
  const preset = animations[animation]
  const trigger: DOMTarget = options?.trigger ?? (element as DOMTarget)

  gsap.set(element, preset.from)

  return gsap.to(element, {
    ...preset.to,
    delay: options?.delay || 0,
    scrollTrigger: {
      trigger,
      start: options?.start || scrollTriggerDefaults.start,
      end: options?.end || scrollTriggerDefaults.end,
      toggleActions: scrollTriggerDefaults.toggleActions,
    },
  })
}

// Create a staggered animation for multiple elements
export function createStaggerAnimation(
  elements: gsap.TweenTarget,
  animation: keyof typeof animations,
  staggerAmount: number = 0.1,
  options?: {
    trigger?: DOMTarget
    start?: string
  }
) {
  const preset = animations[animation]
  const trigger: DOMTarget = options?.trigger ?? (elements as DOMTarget)

  gsap.set(elements, preset.from)

  return gsap.to(elements, {
    ...preset.to,
    stagger: staggerAmount,
    scrollTrigger: {
      trigger,
      start: options?.start || scrollTriggerDefaults.start,
      toggleActions: scrollTriggerDefaults.toggleActions,
    },
  })
}

// Hero animation timeline
export function createHeroTimeline() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  return tl
}
