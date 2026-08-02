"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tripService } from "@/services/trip.service";
import { getApiErrorMessage } from "@/lib/errors";
import {
  Activity,
  ItineraryDay,
  ItinerarySlot,
  RegenerateActivityInput,
  RegenerateDayInput,
  Trip,
} from "@/types/trip.types";

const stripActivityId = (activity: Activity): Omit<Activity, "_id"> => ({
  title: activity.title,
  description: activity.description,
  duration: activity.duration,
  estimatedCost: activity.estimatedCost,
});

export function useRestoreDay(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dayNumber, day }: { dayNumber: number; day: ItineraryDay }) =>
      tripService.restoreDay(tripId, dayNumber, {
        title: day.title,
        morning: day.morning.map(stripActivityId),
        afternoon: day.afternoon.map(stripActivityId),
        evening: day.evening.map(stripActivityId),
        tips: day.tips,
        estimatedCost: day.estimatedCost,
      }),
    onSuccess: (updatedTrip: Trip) => {
      queryClient.setQueryData(["trips", tripId], updatedTrip);
      toast.success("Change undone");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not undo this change."));
    },
  });
}

export function useRegenerateDay(tripId: string) {
  const queryClient = useQueryClient();
  const restoreDay = useRestoreDay(tripId);

  return useMutation({
    mutationFn: (input: RegenerateDayInput) => tripService.regenerateDay(tripId, input),
    onMutate: (input) => {
      const trip = queryClient.getQueryData<Trip>(["trips", tripId]);
      const previousDay = trip?.itinerary.find((d) => d.dayNumber === input.dayNumber);
      return { previousDay };
    },
    onSuccess: (updatedTrip: Trip, _input, context) => {
      queryClient.setQueryData(["trips", tripId], updatedTrip);
      const previousDay = context?.previousDay;
      toast.success("Day regenerated", {
        action: previousDay
          ? {
              label: "Undo",
              onClick: () => restoreDay.mutate({ dayNumber: previousDay.dayNumber, day: previousDay }),
            }
          : undefined,
      });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not regenerate this day."));
    },
  });
}

export function useRegenerateActivity(tripId: string) {
  const queryClient = useQueryClient();
  const restoreDay = useRestoreDay(tripId);

  return useMutation({
    mutationFn: (input: RegenerateActivityInput) => tripService.regenerateActivity(tripId, input),
    onMutate: (input) => {
      const trip = queryClient.getQueryData<Trip>(["trips", tripId]);
      const previousDay = trip?.itinerary.find((d) => d.dayNumber === input.dayNumber);
      return { previousDay };
    },
    onSuccess: (updatedTrip: Trip, _input, context) => {
      queryClient.setQueryData(["trips", tripId], updatedTrip);
      const previousDay = context?.previousDay;
      toast.success("Activity regenerated", {
        action: previousDay
          ? {
              label: "Undo",
              onClick: () => restoreDay.mutate({ dayNumber: previousDay.dayNumber, day: previousDay }),
            }
          : undefined,
      });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not regenerate this activity."));
    },
  });
}

export function useAddActivity(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      dayNumber,
      slot,
      activity,
    }: {
      dayNumber: number;
      slot: ItinerarySlot;
      activity: Omit<Activity, "_id">;
    }) => tripService.updateActivities(tripId, dayNumber, { action: "add", slot, activity }),
    onSuccess: (updatedTrip: Trip) => {
      queryClient.setQueryData(["trips", tripId], updatedTrip);
      toast.success("Activity added");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not add this activity."));
    },
  });
}

export function useRemoveActivity(tripId: string) {
  const queryClient = useQueryClient();
  const addActivity = useAddActivity(tripId);

  return useMutation({
    mutationFn: ({
      dayNumber,
      slot,
      activity,
    }: {
      dayNumber: number;
      slot: ItinerarySlot;
      activity: Activity;
    }) => tripService.updateActivities(tripId, dayNumber, { action: "remove", slot, activityId: activity._id }),
    onSuccess: (updatedTrip: Trip, variables) => {
      queryClient.setQueryData(["trips", tripId], updatedTrip);
      toast.success("Activity removed", {
        action: {
          label: "Undo",
          onClick: () =>
            addActivity.mutate({
              dayNumber: variables.dayNumber,
              slot: variables.slot,
              activity: stripActivityId(variables.activity),
            }),
        },
      });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not remove this activity."));
    },
  });
}

export function useReorderActivities(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      dayNumber,
      slot,
      activityIds,
    }: {
      dayNumber: number;
      slot: ItinerarySlot;
      activityIds: string[];
    }) => tripService.updateActivities(tripId, dayNumber, { action: "reorder", slot, activityIds }),
    onSuccess: (updatedTrip: Trip) => {
      queryClient.setQueryData(["trips", tripId], updatedTrip);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not reorder activities."));
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
    },
  });
}
