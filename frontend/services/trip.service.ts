import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/types/api.types";
import { CreateTripInput, Trip } from "@/types/trip.types";

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
};
