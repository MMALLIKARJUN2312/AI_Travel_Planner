"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SwapActivityDialog } from "@/components/trips/swap-activity-dialog";
import { cn } from "@/lib/utils";
import { RISK_CONFIG } from "@/lib/risk";
import { Trip } from "@/types/trip.types";

export function RiskAssessmentCard({ trip }: { trip: Trip }) {
  const { riskAssessment: risk, itinerary } = trip;
  const config = RISK_CONFIG[risk.riskLevel];
  const Icon = config.icon;
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);

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
            <ul className="flex flex-col gap-2">
              {risk.alternativeActivities.map((activity) => (
                <li key={activity} className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                  <span>• {activity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => setActiveSuggestion(activity)}
                  >
                    <ArrowLeftRight className="size-3.5" />
                    Swap in
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <SwapActivityDialog
        key={activeSuggestion}
        tripId={trip._id}
        itinerary={itinerary}
        suggestion={activeSuggestion}
        open={activeSuggestion !== null}
        onOpenChange={(open) => {
          if (!open) setActiveSuggestion(null);
        }}
      />
    </Card>
  );
}
