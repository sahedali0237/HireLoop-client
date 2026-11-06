import HeroSection from "@/components/hero-section"
import GlobeSection from "@/components/globe-section"
import StatsSection from "@/components/stats-section"
export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-black pt-20 pb-12 font-sans selection:bg-indigo-500/30">
        <HeroSection />
        <GlobeSection />
        <StatsSection />
      </main>
    </div>
  )
}
