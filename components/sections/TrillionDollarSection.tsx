'use client'

import { TextReveal } from '@/components/ui/TextReveal'
import { Card, CardContent } from '@/components/ui/Card'

const pillars = [
  {
    past: 'Systems of Record',
    pastDesc: 'Salesforce, Workday, SAP',
    future: 'Systems of Decision',
    futureDesc: 'Context graphs that capture the why',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
        />
      </svg>
    ),
  },
  {
    past: 'Siloed Data',
    pastDesc: 'Context lost in ETL',
    future: 'Agent Orchestration',
    futureDesc: 'Real-time decision lineage',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    past: 'Manual Workflows',
    pastDesc: 'High headcount, slow decisions',
    future: 'Autonomous Agents',
    futureDesc: 'Powered by context graphs',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
]

const problems = [
  {
    title: 'Exception Logic',
    description: 'Tribal knowledge stuck in people\'s heads, unavailable to AI systems.',
  },
  {
    title: 'Lost Precedent',
    description: 'Past decisions unlinked from current context, forcing repeated manual review.',
  },
  {
    title: 'Cross-System Gaps',
    description: 'Reasoning happening in Slack, Zoom, and email—never captured.',
  },
  {
    title: 'Approval Chains',
    description: 'Decision authority scattered outside formal systems.',
  },
]

export function TrillionDollarSection() {
  return (
    <section id="opportunity" className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <TextReveal className="text-center mb-16">
          <span className="text-accent font-mono text-sm tracking-wider uppercase mb-4 block">
            The Opportunity
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            AI&apos;s <span className="gradient-text">Trillion-Dollar</span> Platform
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            While existing systems of record own canonical data, new platforms will own the reasoning
            behind decisions. This is the next trillion-dollar opportunity.
          </p>
        </TextReveal>

        {/* Transformation Pillars */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {pillars.map((pillar, index) => (
            <TextReveal key={pillar.future} delay={index * 0.1}>
              <Card variant="default" className="h-full relative overflow-hidden">
                <CardContent className="relative z-10">
                  <div className="text-accent mb-4">{pillar.icon}</div>

                  <div className="space-y-4">
                    <div className="opacity-50">
                      <p className="text-sm text-muted-foreground line-through">{pillar.past}</p>
                      <p className="text-xs text-muted-foreground">{pillar.pastDesc}</p>
                    </div>

                    <div className="flex items-center gap-2 text-accent">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <span className="text-xs font-mono">TRANSFORM</span>
                    </div>

                    <div>
                      <p className="text-lg font-semibold text-foreground">{pillar.future}</p>
                      <p className="text-sm text-muted-foreground">{pillar.futureDesc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TextReveal>
          ))}
        </div>

        {/* Problems Section */}
        <TextReveal delay={0.3}>
          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Why Incumbents Can&apos;t Build This
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {problems.map((problem) => (
                <div
                  key={problem.title}
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/50"
                >
                  <div className="mt-1 text-red-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{problem.title}</h4>
                    <p className="text-sm text-muted-foreground">{problem.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TextReveal>

        {/* Compound Advantage */}
        <TextReveal delay={0.4} className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-accent/10 border border-accent/30">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span className="text-foreground">
              <span className="font-semibold">Compound Advantage:</span>{' '}
              <span className="text-muted-foreground">
                Every automated decision adds another trace to the graph
              </span>
            </span>
          </div>
        </TextReveal>
      </div>
    </section>
  )
}
