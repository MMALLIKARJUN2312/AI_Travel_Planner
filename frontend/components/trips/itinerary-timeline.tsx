import { Sunrise, Sun, Moon, Clock, Lightbulb } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ItineraryDay } from "@/types/trip.types";

const SLOTS = [
  { key: "morning", label: "Morning", icon: Sunrise },
  { key: "afternoon", label: "Afternoon", icon: Sun },
  { key: "evening", label: "Evening", icon: Moon },
] as const satisfies ReadonlyArray<{ key: keyof Pick<ItineraryDay, "morning" | "afternoon" | "evening">; label: string; icon: typeof Sunrise }>;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

function ActivityRow({ activity }: { activity: Activity }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-medium">{activity.title}</p>
        <p className="text-sm text-muted-foreground">{activity.description}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" />
          {activity.duration}
        </p>
      </div>
      <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
        {formatCurrency(activity.estimatedCost)}
      </span>
    </div>
  );
}

export function ItineraryTimeline({ days }: { days: ItineraryDay[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Day-by-day itinerary</CardTitle>
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
                <div className="flex flex-col divide-y">
                  {SLOTS.map((slot) => {
                    const activities = day[slot.key];
                    if (!activities.length) return null;
                    return (
                      <div key={slot.key} className="py-3 first:pt-0">
                        <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          <slot.icon className="size-3.5" />
                          {slot.label}
                        </p>
                        <div className="flex flex-col divide-y">
                          {activities.map((activity) => (
                            <ActivityRow key={activity._id} activity={activity} />
                          ))}
                        </div>
                      </div>
                    );
                  })}

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
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
