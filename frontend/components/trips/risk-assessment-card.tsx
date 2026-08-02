import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RiskAssessment, RiskLevel } from "@/types/trip.types";

const RISK_CONFIG: Record<RiskLevel, { label: string; icon: typeof ShieldCheck; color: string }> = {
  LOW: { label: "Low risk", icon: ShieldCheck, color: "#0ca30c" },
  MEDIUM: { label: "Medium risk", icon: ShieldAlert, color: "#fab219" },
  HIGH: { label: "High risk", icon: ShieldX, color: "#d03b3b" },
};

export function RiskAssessmentCard({ risk }: { risk: RiskAssessment }) {
  const config = RISK_CONFIG[risk.riskLevel];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI risk & safety advisor</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: `color-mix(in oklab, ${config.color}, transparent 85%)`, color: config.color }}
          >
            <Icon className="size-5" />
          </span>
          <div>
            <p className="font-medium" style={{ color: config.color }}>
              {config.label}
            </p>
            <p className="text-sm text-muted-foreground">Risk score: {risk.riskScore}/100</p>
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all")}
            style={{ width: `${risk.riskScore}%`, backgroundColor: config.color }}
          />
        </div>

        {risk.recommendations.length > 0 && (
          <div>
            <p className="mb-1.5 text-sm font-medium">Recommendations</p>
            <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
              {risk.recommendations.map((rec) => (
                <li key={rec}>• {rec}</li>
              ))}
            </ul>
          </div>
        )}

        {risk.alternativeActivities.length > 0 && (
          <div>
            <p className="mb-1.5 text-sm font-medium">Backup activities</p>
            <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
              {risk.alternativeActivities.map((activity) => (
                <li key={activity}>• {activity}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
