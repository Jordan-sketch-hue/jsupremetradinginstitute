import Hero from '@/components/Hero'
import TradingViewWidgets from '@/components/TradingViewWidgets'
import Philosophy from '@/components/Philosophy'
import LearningPath from '@/components/LearningPath'
import OrderBlockSection from '@/components/OrderBlockSection'
import MarketCycleSection from '@/components/MarketCycleSection'
import FeaturesGrid from '@/components/FeaturesGrid'
import CTASection from '@/components/CTASection'

export default function Home() {
  return (
    <>
      <Hero />
      <div className="py-4 bg-matte-black border-y border-royal-green/20">
        <TradingViewWidgets />
      </div>
      <Philosophy />
      <LearningPath />
      <OrderBlockSection />
      <MarketCycleSection />
      <FeaturesGrid />
      <CTASection />
    </>
  )
}
