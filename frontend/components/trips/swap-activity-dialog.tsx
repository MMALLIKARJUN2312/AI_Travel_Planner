"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegenerateActivity } from "@/hooks/use-trip-edit";
import { ItineraryDay, ItinerarySlot } from "@/types/trip.types";

const SLOT_OPTIONS: { value: ItinerarySlot; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

/**
 * Render with `key={suggestion}` from the parent so selections reset
 * whenever a different suggestion is swapped in.
 */
export function SwapActivityDialog({
  tripId,
  itinerary,
  suggestion,
  open,
  onOpenChange,
}: {
  tripId: string;
  itinerary: ItineraryDay[];
  suggestion: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const firstDay = itinerary[0];
  const [dayNumber, setDayNumber] = useState(firstDay.dayNumber);
  const [slot, setSlot] = useState<ItinerarySlot>("morning");
  const [activityId, setActivityId] = useState(firstDay.morning[0]?._id ?? "");
  const regenerateActivity = useRegenerateActivity(tripId);

  const day = itinerary.find((d) => d.dayNumber === dayNumber) ?? firstDay;
  const activities = day[slot];

  const handleDayChange = (value: string | null) => {
    if (!value) return;
    const newDayNumber = Number(value);
    const newDay = itinerary.find((d) => d.dayNumber === newDayNumber);
    setDayNumber(newDayNumber);
    setActivityId(newDay?.[slot][0]?._id ?? "");
  };

  const handleSlotChange = (value: string | null) => {
    if (!value) return;
    const newSlot = value as ItinerarySlot;
    setSlot(newSlot);
    setActivityId(day[newSlot][0]?._id ?? "");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Swap in a safer activity</DialogTitle>
          <DialogDescription>
            &ldquo;{suggestion}&rdquo; — choose which activity to replace with this.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Day</Label>
            <Select value={String(dayNumber)} onValueChange={handleDayChange}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {() => {
                    const selectedDay = itinerary.find((d) => d.dayNumber === dayNumber);
                    return selectedDay ? `Day ${selectedDay.dayNumber} · ${selectedDay.title}` : null;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {itinerary.map((d) => (
                  <SelectItem key={d.dayNumber} value={String(d.dayNumber)}>
                    Day {d.dayNumber} · {d.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Time of day</Label>
            <Select value={slot} onValueChange={handleSlotChange}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {() => SLOT_OPTIONS.find((option) => option.value === slot)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SLOT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Activity to replace</Label>
            <Select value={activityId} onValueChange={(value) => setActivityId(value ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {() => activities.find((activity) => activity._id === activityId)?.title}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {activities.map((activity) => (
                  <SelectItem key={activity._id} value={activity._id}>
                    {activity.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
          <Button
            disabled={!activityId || regenerateActivity.isPending}
            onClick={() => {
              if (!suggestion) return;
              regenerateActivity.mutate(
                {
                  dayNumber,
                  activityId,
                  slot,
                  instruction: `Replace this activity with something like: ${suggestion}`,
                },
                { onSuccess: () => onOpenChange(false) }
              );
            }}
          >
            Swap in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
