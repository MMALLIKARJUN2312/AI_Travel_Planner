"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tripService } from "@/services/trip.service";
import { getApiErrorMessage } from "@/lib/errors";
import { CreateTripInput, Trip } from "@/types/trip.types";

export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: tripService.getTrips,
  });
}

export function useTrip(tripId: string) {
  return useQuery({
    queryKey: ["trips", tripId],
    queryFn: () => tripService.getTrip(tripId),
    enabled: Boolean(tripId),
  });
}

export function useCreateTrip() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTripInput) => tripService.createTrip(input),
    onSuccess: async (trip) => {
      await queryClient.invalidateQueries({ queryKey: ["trips"] });
      toast.success("Your itinerary is ready!");
      router.push(`/trips/${trip._id}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not generate this trip. Please try again."));
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => tripService.deleteTrip(tripId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["trips"] });
      toast.success("Trip deleted");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not delete this trip."));
    },
  });
}

export function useDuplicateTrip() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (trip: Trip) =>
      tripService.createTrip({
        destination: trip.destination,
        originCity: trip.originCity,
        numberOfDays: trip.numberOfDays,
        budgetType: trip.budgetType,
        currency: trip.currency,
        interests: trip.interests,
      }),
    onSuccess: async (trip) => {
      await queryClient.invalidateQueries({ queryKey: ["trips"] });
      toast.success("Trip duplicated with a freshly generated itinerary");
      router.push(`/trips/${trip._id}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not duplicate this trip."));
    },
  });
}
