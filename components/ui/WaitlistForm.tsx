'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { Button } from './Button'

interface WaitlistFormProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function WaitlistForm({ className = '', size = 'md' }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if already submitted
    const submitted = localStorage.getItem('waitlist_submitted')
    if (submitted) {
      setStatus('success')
      setMessage("You're already on the list!")
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || "You're on the list!")
        localStorage.setItem('waitlist_submitted', 'true')

        // Animate success
        if (formRef.current && successRef.current) {
          gsap.to(formRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            onComplete: () => {
              gsap.fromTo(
                successRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4 }
              )
            },
          })
        }
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Connection error. Please try again.')
    }
  }

  const inputSizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  }

  if (status === 'success') {
    return (
      <div ref={successRef} className={`text-center ${className}`}>
        <div className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-accent/10 border border-accent/30">
          <svg
            className="w-6 h-6 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-accent font-medium">{message}</span>
        </div>
        <p className="mt-4 text-muted-foreground text-sm">
          We&apos;ll notify you when we launch.
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={`${className}`}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className={`flex-1 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 ${inputSizes[size]}`}
          disabled={status === 'loading'}
        />
        <Button
          type="submit"
          size={size}
          disabled={status === 'loading'}
          className="whitespace-nowrap"
        >
          {status === 'loading' ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Joining...
            </span>
          ) : (
            'Join Waitlist'
          )}
        </Button>
      </div>
      {status === 'error' && (
        <p className="mt-3 text-red-400 text-sm">{message}</p>
      )}
    </form>
  )
}
