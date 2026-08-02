import { RISK_CONFIG } from "@/lib/risk";
import { RiskLevel } from "@/types/trip.types";

export function RiskBadge({ level }: { level: RiskLevel }) {
  const config = RISK_CONFIG[level];
  const Icon = config.icon;

  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `color-mix(in oklab, ${config.color}, transparent 85%)`, color: config.color }}
    >
      <Icon className="size-3" />
      {config.label}
    </span>
  );
}
