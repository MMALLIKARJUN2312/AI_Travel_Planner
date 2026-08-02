"use client";

import Link from "next/link";
import { Calendar, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DeleteTripDialog } from "@/components/trips/delete-trip-dialog";
import { RiskBadge } from "@/components/trips/risk-badge";
import { useDuplicateTrip } from "@/hooks/use-trips";
import { cn } from "@/lib/utils";
import { Trip } from "@/types/trip.types";

const BUDGET_TYPE_LABEL: Record<string, string> = {
  BUDGET: "Budget-friendly",
  MID_RANGE: "Mid-range",
  LUXURY: "Luxury",
};

export function TripCard({ trip }: { trip: Trip }) {
  const duplicateTrip = useDuplicateTrip();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>
          <Link href={`/trips/${trip._id}`} className="hover:underline">
            {trip.destination}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            {trip.numberOfDays} days
          </span>
          <Badge variant="outline">{BUDGET_TYPE_LABEL[trip.budgetType] ?? trip.budgetType}</Badge>
          {trip.riskAssessment && <RiskBadge level={trip.riskAssessment.riskLevel} />}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {trip.interests.slice(0, 3).map((interest) => (
            <Badge key={interest} variant="secondary">
              {interest}
            </Badge>
          ))}
          {trip.interests.length > 3 && <Badge variant="secondary">+{trip.interests.length - 3}</Badge>}
        </div>

        <p className="text-xs text-muted-foreground">
          Created{" "}
          {new Date(trip.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <div className="mt-auto flex gap-2 pt-2">
          <Link href={`/trips/${trip._id}`} className={cn(buttonVariants({ size: "sm", variant: "outline" }), "flex-1")}>
            View
          </Link>
          <Button
            size="sm"
            variant="outline"
            aria-label="Duplicate trip"
            disabled={duplicateTrip.isPending}
            onClick={() => duplicateTrip.mutate(trip)}
          >
            <Copy className="size-4" />
          </Button>
          <DeleteTripDialog tripId={trip._id} destination={trip.destination} />
        </div>
      </CardContent>
    </Card>
  );
}
