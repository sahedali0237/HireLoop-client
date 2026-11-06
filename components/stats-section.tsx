import { Briefcase, Building2, Globe2, Star } from "lucide-react"

export default function StatsSection() {
  return (
    <div className="relative z-20 mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<Briefcase className="h-5 w-5" />}
        value="50K"
        label="Active Jobs"
      />
      <StatCard
        icon={<Building2 className="h-5 w-5" />}
        value="12K"
        label="Companies"
      />
      <StatCard
        icon={<Globe2 className="h-5 w-5" />}
        value="2M"
        label="Job Seekers"
      />
      <StatCard
        icon={<Star className="h-5 w-5" />}
        value="97%"
        label="Satisfaction Rate"
      />
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="group relative flex h-44 flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-6 text-center shadow-lg shadow-black/40 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-white/25 hover:bg-[#111]/90 hover:shadow-2xl hover:shadow-black/60">
      {/* Soft white highlight on hover (neutral, no color) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Icon */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition-all duration-300 group-hover:scale-110 group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white">
        {icon}
      </div>

      {/* Text */}
      <div className="relative">
        <div className="mb-1 text-4xl font-bold tracking-tight text-white">
          {value}
        </div>
        <div className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-gray-300">
          {label}
        </div>
      </div>
    </div>
  )
}
