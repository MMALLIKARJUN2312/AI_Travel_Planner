import { AppError } from "../../../core/errors/app-error.js";

import { TripRepository } from "../repositories/trip.repository.js";

import { CreateTripDto } from "../schemas/create-trip.schema.js";
import { UpdateTripDto } from "../schemas/update-trip.schema.js";

export class TripService {
  constructor(
    private readonly tripRepository: TripRepository
  ) {}

  async createTrip(userId: string, data: CreateTripDto) {
    return this.tripRepository.create({...data, userId});
  }

  async getTrips(userId: string) {
    return this.tripRepository.findAllByUserId(userId);
  }

  async getTrip(tripId: string, userId: string) {
    const trip = await this.tripRepository.findByIdAndUserId(tripId, userId);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    return trip;
  }

  async updateTrip(tripId: string, userId: string, data: UpdateTripDto) {
    const trip = await this.tripRepository.updateByIdAndUserId(tripId, userId, data);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    return trip;
  }

  async deleteTrip(tripId: string, userId: string) {
    const deletedTrip = await this.tripRepository.deleteByIdAndUserId(tripId, userId);

    if (!deletedTrip) {
      throw new AppError("Trip not found",404);
    }
  }
}