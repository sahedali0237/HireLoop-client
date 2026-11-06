import { Briefcase, Building2, Globe2, Star } from "lucide-react"

export default function StatsSection() {
  return (
    <div className="relative z-20 grid w-full grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<Briefcase className="h-4 w-4 text-white" />}
        value="50K"
        label="Active Jobs"
      />
      <StatCard
        icon={<Building2 className="h-4 w-4 text-white" />}
        value="12K"
        label="Companies"
      />
      <StatCard
        icon={<Globe2 className="h-4 w-4 text-white" />}
        value="2M"
        label="Job Seekers"
      />
      <StatCard
        icon={<Star className="h-4 w-4 text-white" />}
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
    <div className="flex h-40 flex-col justify-between rounded-2xl border border-white/5 bg-[#0a0a0a]/80 p-6 backdrop-blur-md transition-colors hover:border-white/10">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/5">
        {icon}
      </div>
      <div>
        <div className="mb-1 text-4xl font-bold tracking-tight text-white">
          {value}
        </div>
        <div className="text-xs font-medium text-gray-500">{label}</div>
      </div>
    </div>
  )
}
