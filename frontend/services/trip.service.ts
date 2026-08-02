import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/types/api.types";
import {
  ActivityEditInput,
  CreateTripInput,
  RegenerateActivityInput,
  RegenerateDayInput,
  RestoreDayInput,
  Trip,
} from "@/types/trip.types";

export const tripService = {
  async createTrip(input: CreateTripInput): Promise<Trip> {
    const { data } = await api.post<ApiSuccessResponse<Trip>>("/trips", input);
    return data.data;
  },

  async getTrips(): Promise<Trip[]> {
    const { data } = await api.get<ApiSuccessResponse<Trip[]>>("/trips");
    return data.data;
  },

  async getTrip(tripId: string): Promise<Trip> {
    const { data } = await api.get<ApiSuccessResponse<Trip>>(`/trips/${tripId}`);
    return data.data;
  },

  async deleteTrip(tripId: string): Promise<void> {
    await api.delete(`/trips/${tripId}`);
  },

  async regenerateDay(tripId: string, input: RegenerateDayInput): Promise<Trip> {
    const { data } = await api.post<ApiSuccessResponse<Trip>>(
      `/trips/${tripId}/regenerate-day`,
      input
    );
    return data.data;
  },

  async regenerateActivity(tripId: string, input: RegenerateActivityInput): Promise<Trip> {
    const { data } = await api.post<ApiSuccessResponse<Trip>>(
      `/trips/${tripId}/itinerary/${input.dayNumber}/activities/${input.activityId}/regenerate`,
      { slot: input.slot, instruction: input.instruction }
    );
    return data.data;
  },

  async updateActivities(
    tripId: string,
    dayNumber: number,
    input: ActivityEditInput
  ): Promise<Trip> {
    const { data } = await api.patch<ApiSuccessResponse<Trip>>(
      `/trips/${tripId}/itinerary/${dayNumber}/activities`,
      input
    );
    return data.data;
  },

  async restoreDay(tripId: string, dayNumber: number, input: RestoreDayInput): Promise<Trip> {
    const { data } = await api.put<ApiSuccessResponse<Trip>>(
      `/trips/${tripId}/itinerary/${dayNumber}`,
      input
    );
    return data.data;
  },
};
