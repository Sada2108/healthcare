interface ProgressRingProps {
  value: number
  total: number
  label?: string
  size?: number
}

export default function ProgressRing({ value, total, label, size = 140 }: ProgressRingProps) {
  const percent = total > 0 ? Math.min(Math.max(value / total, 0), 1) : 0
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - percent)
  const cx = size / 2
  const cy = size / 2
  const step = Math.min(Math.ceil((value / total) * total) || 1, total)

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 140 140" className="transform -rotate-90">
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec6a8f" />
            <stop offset="45%" stopColor="#d98bc9" />
            <stop offset="100%" stopColor="#f4a08a" />
          </linearGradient>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="rgba(236, 106, 143, 0.12)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="url(#progress-gradient)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="text-center">
        <span className="text-2xl font-bold text-ink">{step}</span>
        {label && <span className="text-xs text-ink/60">{label}</span>}
      </div>
    </div>
  )
}
