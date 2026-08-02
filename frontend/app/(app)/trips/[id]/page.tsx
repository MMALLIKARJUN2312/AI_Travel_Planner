"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { useDuplicateTrip, useTrip } from "@/hooks/use-trips";
import { ItineraryTimeline } from "@/components/trips/itinerary-timeline";
import { BudgetBreakdown } from "@/components/trips/budget-breakdown";
import { HotelCards } from "@/components/trips/hotel-cards";
import { RiskAssessmentCard } from "@/components/trips/risk-assessment-card";
import { DeleteTripDialog } from "@/components/trips/delete-trip-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const BUDGET_TYPE_LABEL: Record<string, string> = {
  BUDGET: "Budget-friendly",
  MID_RANGE: "Mid-range",
  LUXURY: "Luxury",
};

export default function TripDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: trip, isLoading, isError } = useTrip(params.id);
  const duplicateTrip = useDuplicateTrip();

  if (isLoading) {
    return <TripDetailSkeleton />;
  }

  if (isError || !trip) {
    return (
      <div className="flex flex-col items-center gap-2 py-24 text-center">
        <p className="font-medium">Trip not found</p>
        <p className="text-sm text-muted-foreground">
          It may have been deleted, or you don&apos;t have access to it.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{trip.destination}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{trip.numberOfDays} days</span>
            <span>·</span>
            <Badge variant="outline">{BUDGET_TYPE_LABEL[trip.budgetType] ?? trip.budgetType}</Badge>
            {trip.interests.map((interest) => (
              <Badge key={interest} variant="secondary">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={duplicateTrip.isPending}
            onClick={() => duplicateTrip.mutate(trip)}
          >
            <Copy className="size-4" />
            Duplicate
          </Button>
          <DeleteTripDialog
            tripId={trip._id}
            destination={trip.destination}
            onDeleted={() => router.push("/trips")}
          />
        </div>
      </div>

      <ItineraryTimeline days={trip.itinerary} />

      <div className="grid gap-6 lg:grid-cols-2">
        <BudgetBreakdown budget={trip.budgetEstimate} />
        <RiskAssessmentCard risk={trip.riskAssessment} />
      </div>

      <HotelCards hotels={trip.hotelSuggestions} />
    </motion.div>
  );
}

function TripDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-64 w-full" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
