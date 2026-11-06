import { Briefcase, Search, MapPin } from "lucide-react"

export default function HeroSection() {
  return (
    <div className="relative z-20 flex w-full max-w-5xl flex-col items-center px-4">
      {/* Announcement Badge */}
      <div className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
        <Briefcase className="h-3.5 w-3.5 text-[#d48c6a]" />
        <span className="text-[11px] font-medium tracking-[0.2em] text-gray-300 uppercase">
          50,000+ New Jobs This Month
        </span>
      </div>

      {/* Headlines */}
      <h1 className="mb-6 text-center text-5xl font-semibold tracking-tight text-white md:text-6xl">
        Find Your Dream Job Today
      </h1>
      <p className="mb-10 max-w-2xl text-center text-base leading-relaxed text-gray-400 md:text-lg">
        HireLoop connects top talent with world-class companies. Browse
        thousands of curated opportunities and land your next role — faster.
      </p>

      {/* Search Bar */}
      <div className="relative z-30 flex w-full max-w-3xl flex-col items-center gap-2 rounded-full border border-white/5 bg-[#0f0f11] p-2 shadow-2xl md:flex-row">
        {/* Job Search Input */}
        <div className="flex w-full flex-1 items-center gap-3 px-4 py-2">
          <Search className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Job title, skill or company"
            className="w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
          />
        </div>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-white/10 md:block" />

        {/* Location Input */}
        <div className="flex w-full flex-1 items-center gap-3 px-4 py-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Location or Remote"
            className="w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
          />
        </div>

        {/* Search Button */}
        <button className="flex w-full shrink-0 items-center justify-center rounded-full bg-[#5b45ff] p-3 transition-colors hover:bg-[#4a35ea] md:w-auto">
          <Search className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Trending Tags */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <span className="mr-2 text-sm text-gray-500">Trending Position</span>
        {["Product Designer", "AI Engineering", "Dev-ops Engineer"].map(
          (tag) => (
            <button
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-gray-300 transition-colors hover:bg-white/10"
            >
              {tag}
            </button>
          )
        )}
      </div>
    </div>
  )
}
