import { CrowdLevel } from '../../types';
import { getCrowdLabel } from '../../data/places';

interface CrowdBadgeProps {
  level: CrowdLevel;
  pct: number;
  small?: boolean;
  showIcon?: boolean;
}

export default function CrowdBadge({ level, pct, small = false, showIcon = true }: CrowdBadgeProps) {
  const config: Record<CrowdLevel, { bg: string; text: string; icon: string }> = {
    low: { bg: 'bg-crowd-low-bg', text: 'text-crowd-low', icon: '🌿' },
    moderate: { bg: 'bg-crowd-moderate-bg', text: 'text-crowd-moderate', icon: '🟡' },
    high: { bg: 'bg-crowd-high-bg', text: 'text-crowd-high', icon: '🟠' },
    critical: { bg: 'bg-crowd-critical-bg', text: 'text-crowd-critical', icon: '🔴' },
  };

  const { bg, text, icon } = config[level];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${bg} ${text} ${
        small ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
    >
      {showIcon && <span className={small ? 'text-[8px]' : 'text-[10px]'}>{icon}</span>}
      {pct}% {!small && getCrowdLabel(level)}
    </span>
  );
}
