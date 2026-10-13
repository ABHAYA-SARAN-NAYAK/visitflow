import { getCrowdColor, getCrowdLevelFromPct, getCrowdLabel } from '../../data/places';

interface CrowdRingMeterProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export default function CrowdRingMeter({
  percentage,
  size = 160,
  strokeWidth = 12,
  showLabel = true,
}: CrowdRingMeterProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const level = getCrowdLevelFromPct(percentage);
  const color = getCrowdColor(level);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />
        {/* Animated progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="crowd-ring-animated"
          style={{
            transition: 'stroke-dashoffset 1.5s ease-out',
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-display font-bold" style={{ color }}>
            {percentage}%
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide mt-0.5" style={{ color }}>
            {getCrowdLabel(level)}
          </span>
        </div>
      )}
    </div>
  );
}
