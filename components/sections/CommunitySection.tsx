'use client'

import { TextReveal } from '@/components/ui/TextReveal'
import { Card, CardContent } from '@/components/ui/Card'
import { WaitlistForm } from '@/components/ui/WaitlistForm'

const contributionPaths = [
  {
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    ),
    title: 'Share Context Graphs',
    description:
      'Upload your institutional context graphs to help others solve similar problems. Earn recognition and credits.',
    cta: 'Start Contributing',
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    title: 'Build Integrations',
    description:
      'Create connectors for popular AI agent frameworks. Help the ecosystem grow with your technical expertise.',
    cta: 'View API Docs',
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
    title: 'Early Access Program',
    description:
      'Join our founding members to shape the platform. Get exclusive access to beta features and direct input on roadmap.',
    cta: 'Apply Now',
  },
]

export function CommunitySection() {
  return (
    <section id="community" className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <TextReveal className="text-center mb-16">
          <span className="text-accent font-mono text-sm tracking-wider uppercase mb-4 block">
            Join Us
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Build the Future of <span className="gradient-text">AI Memory</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Context Graph is more than a marketplace&mdash;it&apos;s a community of pioneers shaping how AI
            agents learn from institutional knowledge.
          </p>
        </TextReveal>

        {/* Contribution Paths */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {contributionPaths.map((path, index) => (
            <TextReveal key={path.title} delay={index * 0.1}>
              <Card variant="bordered" hover className="h-full text-center">
                <CardContent className="pt-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-6">
                    {path.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{path.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {path.description}
                  </p>
                  <button className="text-accent font-medium text-sm hover:underline transition-all">
                    {path.cta} →
                  </button>
                </CardContent>
              </Card>
            </TextReveal>
          ))}
        </div>

        {/* Secondary CTA */}
        <TextReveal delay={0.4}>
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Join the waitlist to be the first to know when we launch. Early members get
                exclusive access and benefits.
              </p>
              <WaitlistForm className="max-w-md mx-auto" />
            </div>
          </div>
        </TextReveal>

        {/* Stats */}
        <TextReveal delay={0.5} className="mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Early Adopters' },
              { value: '50+', label: 'Enterprise Partners' },
              { value: '100+', label: 'Context Graphs' },
              { value: '∞', label: 'Possibilities' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </TextReveal>
      </div>
    </section>
  )
}
