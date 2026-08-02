"use client";

import { useState } from "react";
import { Sunrise, Sun, Moon, Lightbulb, RefreshCw } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddActivityDialog } from "@/components/trips/add-activity-dialog";
import { RegenerateDialog } from "@/components/trips/regenerate-dialog";
import { RiskBadge } from "@/components/trips/risk-badge";
import { SortableActivityList } from "@/components/trips/sortable-activity-list";
import { useRegenerateDay } from "@/hooks/use-trip-edit";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ItineraryDay, RiskLevel } from "@/types/trip.types";

const SLOTS = [
  { key: "morning", label: "Morning", icon: Sunrise },
  { key: "afternoon", label: "Afternoon", icon: Sun },
  { key: "evening", label: "Evening", icon: Moon },
] as const satisfies ReadonlyArray<{ key: keyof Pick<ItineraryDay, "morning" | "afternoon" | "evening">; label: string; icon: typeof Sunrise }>;

function DayContent({ tripId, day }: { tripId: string; day: ItineraryDay }) {
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const regenerateDay = useRegenerateDay(tripId);

  const isRegenerating = regenerateDay.isPending && regenerateDay.variables?.dayNumber === day.dayNumber;

  return (
    <div className={cn("flex flex-col divide-y transition-opacity", isRegenerating && "opacity-50")}>
      <div className="flex justify-end pb-3">
        <Button variant="outline" size="sm" onClick={() => setRegenerateOpen(true)}>
          <RefreshCw className="size-4" />
          Regenerate day
        </Button>
      </div>

      {SLOTS.map((slot) => (
        <div key={slot.key} className="py-3 first:pt-0">
          <div className="mb-1 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <slot.icon className="size-3.5" />
              {slot.label}
            </p>
            <AddActivityDialog tripId={tripId} dayNumber={day.dayNumber} slot={slot.key} />
          </div>
          <SortableActivityList
            tripId={tripId}
            dayNumber={day.dayNumber}
            slot={slot.key}
            activities={day[slot.key]}
          />
        </div>
      ))}

      {day.tips.length > 0 && (
        <div className="flex items-start gap-2 pt-3 text-sm text-muted-foreground">
          <Lightbulb className="mt-0.5 size-4 shrink-0" />
          <ul className="flex flex-col gap-1">
            {day.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <RegenerateDialog
        open={regenerateOpen}
        onOpenChange={setRegenerateOpen}
        title="Regenerate this day"
        description={`Get a fresh plan for day ${day.dayNumber}.`}
        placeholder="e.g. more outdoor activities, lower budget, less walking…"
        onConfirm={(instruction) => regenerateDay.mutate({ dayNumber: day.dayNumber, instruction })}
      />
    </div>
  );
}

export function ItineraryTimeline({
  tripId,
  days,
  riskLevel,
}: {
  tripId: string;
  days: ItineraryDay[];
  riskLevel: RiskLevel;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Day-by-day itinerary</CardTitle>
          <RiskBadge level={riskLevel} />
        </div>
      </CardHeader>
      <CardContent>
        <Accordion multiple defaultValue={days.length ? [`day-${days[0].dayNumber}`] : []}>
          {days.map((day) => (
            <AccordionItem key={day._id} value={`day-${day.dayNumber}`}>
              <AccordionTrigger>
                <div className="flex flex-1 flex-wrap items-center justify-between gap-2 pr-4">
                  <span>
                    <span className="text-muted-foreground">Day {day.dayNumber} · </span>
                    {day.title}
                  </span>
                  <Badge variant="secondary" className="tabular-nums">
                    {formatCurrency(day.estimatedCost)}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <DayContent tripId={tripId} day={day} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
