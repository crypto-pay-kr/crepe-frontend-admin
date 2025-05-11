type SegmentProps = {
  label?: string
  width: string
  startColor: string
  endColor: string
  textColor?: string
}

export default function GradientProgressBar({ segments }: { segments: SegmentProps[] }) {
  return (
    <div className="flex h-8 rounded-md overflow-hidden shadow-sm">
      {segments.map((segment, index) => (
        <div
          key={index}
          style={{
            background: `linear-gradient(to right, var(--${segment.startColor}), var(--${segment.endColor}))`,
          }}
          className={`text-center py-1 ${segment.width} flex items-center justify-center ${
            segment.textColor || "text-white"
          } font-medium text-xs transition-all duration-300 hover:brightness-105`}
        >
          {segment.label}
        </div>
      ))}
    </div>
  )
}
