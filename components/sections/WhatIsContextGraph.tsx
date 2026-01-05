'use client'

import { TextReveal } from '@/components/ui/TextReveal'
import { Card, CardContent } from '@/components/ui/Card'

const concepts = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: 'Decision Traces',
    description:
      'Captures the "why" behind every decision. Not just rules, but the specific context, exceptions, and reasoning that led to each outcome.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    title: 'Tribal Knowledge',
    description:
      'Exception logic that lives in people\'s heads. The unwritten rules, edge cases, and institutional memory that AI agents need to operate.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    title: 'Searchable Precedent',
    description:
      'Turn scattered decisions into reusable patterns. Every automated decision adds another trace to the graph, creating compound intelligence.',
  },
]

export function WhatIsContextGraph() {
  return (
    <section id="what-is-context-graph" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <TextReveal className="text-center mb-16">
          <span className="text-accent font-mono text-sm tracking-wider uppercase mb-4 block">
            Understanding the Concept
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            What is a <span className="gradient-text">Context Graph</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            A context graph is a{' '}
            <span className="text-foreground font-medium">
              living record of decision traces stitched across entities and time
            </span>
            , so precedent becomes searchable and AI agents can learn from institutional memory.
          </p>
        </TextReveal>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {concepts.map((concept, index) => (
            <TextReveal key={concept.title} delay={index * 0.1}>
              <Card variant="bordered" hover className="h-full">
                <CardContent>
                  <div className="text-accent mb-4">{concept.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{concept.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {concept.description}
                  </p>
                </CardContent>
              </Card>
            </TextReveal>
          ))}
        </div>

        {/* Quote Block */}
        <TextReveal delay={0.3}>
          <blockquote className="relative max-w-3xl mx-auto text-center">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl text-accent/20 font-serif">
              &ldquo;
            </div>
            <p className="text-xl sm:text-2xl text-foreground italic leading-relaxed pt-8">
              Rules tell an agent what should happen in general. Decision traces capture what
              happened in this specific case.
            </p>
            <footer className="mt-6">
              <cite className="text-muted-foreground text-sm not-italic">
                &mdash; Foundation Capital,{' '}
                <a
                  href="https://foundationcapital.com/context-graphs-ais-trillion-dollar-opportunity/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  &ldquo;Context Graphs: AI&apos;s Trillion-Dollar Opportunity&rdquo;
                </a>
              </cite>
            </footer>
          </blockquote>
        </TextReveal>
      </div>
    </section>
  )
}
