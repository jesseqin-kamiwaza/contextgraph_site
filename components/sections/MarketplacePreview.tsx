'use client'

import { TextReveal } from '@/components/ui/TextReveal'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

const categories = [
  { name: 'Sales', count: '24 graphs', icon: '💼' },
  { name: 'Engineering', count: '18 graphs', icon: '⚙️' },
  { name: 'Support', count: '15 graphs', icon: '🎧' },
  { name: 'HR', count: '12 graphs', icon: '👥' },
  { name: 'Finance', count: '9 graphs', icon: '📊' },
  { name: 'Legal', count: '7 graphs', icon: '⚖️' },
]

const previewGraphs = [
  {
    title: 'Enterprise Sales Qualification',
    author: 'SalesOps Team',
    downloads: '2.4k',
    rating: 4.9,
    tags: ['Sales', 'B2B', 'Qualification'],
  },
  {
    title: 'Code Review Decision Tree',
    author: 'DevEx Community',
    downloads: '1.8k',
    rating: 4.8,
    tags: ['Engineering', 'Code Review'],
  },
  {
    title: 'Customer Escalation Handler',
    author: 'CX Institute',
    downloads: '3.1k',
    rating: 4.7,
    tags: ['Support', 'Escalation'],
  },
]

export function MarketplacePreview() {
  return (
    <section id="marketplace" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <TextReveal className="text-center mb-16">
          <span className="text-accent font-mono text-sm tracking-wider uppercase mb-4 block">
            Preview
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            The <span className="gradient-text">Marketplace</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Browse enterprise-grade context graphs from leading institutions or contribute your own
            to the community.
          </p>
        </TextReveal>

        {/* Categories */}
        <TextReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border hover:border-accent/50 transition-colors cursor-pointer"
              >
                <span>{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-xs text-muted-foreground">{category.count}</span>
              </div>
            ))}
          </div>
        </TextReveal>

        {/* Preview Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {previewGraphs.map((graph, index) => (
            <TextReveal key={graph.title} delay={0.1 + index * 0.1}>
              <Card variant="bordered" hover className="h-full relative group">
                {/* Blur overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl z-10 flex items-end justify-center pb-6">
                  <span className="text-accent font-medium text-sm">Coming Soon</span>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{graph.title}</CardTitle>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{graph.rating}</span>
                    </div>
                  </div>
                  <CardDescription>by {graph.author}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {graph.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-md bg-accent/10 text-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>{graph.downloads} downloads</span>
                  </div>
                </CardContent>
              </Card>
            </TextReveal>
          ))}
        </div>

        {/* Features Preview */}
        <TextReveal delay={0.4}>
          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-6 text-center">Marketplace Features</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: '🔍', title: 'Search', desc: 'Find graphs by use case' },
                { icon: '🏷️', title: 'Filter', desc: 'By industry & function' },
                { icon: '⭐', title: 'Ratings', desc: 'Community reviews' },
                { icon: '📥', title: 'Download', desc: 'One-click integration' },
              ].map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h4 className="font-medium text-foreground">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </TextReveal>
      </div>
    </section>
  )
}
