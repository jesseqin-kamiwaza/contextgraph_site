import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { WhatIsContextGraph } from '@/components/sections/WhatIsContextGraph'
import { TrillionDollarSection } from '@/components/sections/TrillionDollarSection'
import { MarketplacePreview } from '@/components/sections/MarketplacePreview'
import { CommunitySection } from '@/components/sections/CommunitySection'
import { GraphBackground } from '@/components/ui/GraphBackground'

export default function Home() {
  return (
    <>
      <GraphBackground nodeCount={40} connectionDistance={120} />
      <Header />
      <main className="relative z-10">
        <HeroSection />
        <WhatIsContextGraph />
        <TrillionDollarSection />
        <MarketplacePreview />
        <CommunitySection />
      </main>
      <Footer />
    </>
  )
}
