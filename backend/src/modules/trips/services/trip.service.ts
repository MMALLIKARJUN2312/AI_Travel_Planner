import { AppError } from "../../../core/errors/app-error.js";
import { ItineraryAiService } from "../../ai/services/itinerary-ai.service.js";
import { TripRepository } from "../repositories/trip.repository.js";
import { ActivityEditDto } from "../schemas/activity-edit.schema.js";
import { CreateTripDto } from "../schemas/create-trip.schema.js";
import { RegenerateActivityDto } from "../schemas/regenerate-activity.schema.js";
import { RegenerateDayDto } from "../schemas/regenerate-day.schema.js";
import { RestoreDayDto } from "../schemas/restore-day.schema.js";
import { UpdateTripDto } from "../schemas/update-trip.schema.js";

export class TripService {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly itineraryAiService: ItineraryAiService
  ) {}

  async createTrip(userId: string, data: CreateTripDto) {
    const aiResult = await this.itineraryAiService.generateFullTrip(data);

    return this.tripRepository.create({
      ...data,
      userId,
      itinerary: aiResult.itinerary,
      budgetEstimate: aiResult.budgetEstimate,
      hotelSuggestions: aiResult.hotelSuggestions,
      riskAssessment: aiResult.riskAssessment,
    } as CreateTripDto & { userId: string });
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

  async regenerateDay(tripId: string, userId: string, data: RegenerateDayDto) {
    const trip = await this.tripRepository.findByIdAndUserId(tripId, userId);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    const day = trip.itinerary.find((d: any) => d.dayNumber === data.dayNumber);

    if (!day) {
      throw new AppError(`Day ${data.dayNumber} does not exist on this trip`, 400);
    }

    const regeneratedDay = await this.itineraryAiService.regenerateDay({
      destination: trip.destination,
      numberOfDays: trip.numberOfDays,
      budgetType: trip.budgetType,
      interests: trip.interests,
      dayNumber: data.dayNumber,
      instruction: data.instruction,
    });

    Object.assign(day, regeneratedDay);

    await trip.save();

    return trip;
  }

  async updateActivities(
    tripId: string,
    userId: string,
    dayNumber: number,
    data: ActivityEditDto
  ) {
    const trip = await this.tripRepository.findByIdAndUserId(tripId, userId);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    const day = trip.itinerary.find((d: any) => d.dayNumber === dayNumber);

    if (!day) {
      throw new AppError(`Day ${dayNumber} does not exist on this trip`, 400);
    }

    if (data.action === "add") {
      day[data.slot].push(data.activity);
    } else if (data.action === "remove") {
      const activity = day[data.slot].id(data.activityId);

      if (!activity) {
        throw new AppError("Activity not found", 404);
      }

      activity.deleteOne();
    } else {
      const currentSlot = day[data.slot];
      const reordered = data.activityIds
        .map((id: string) => currentSlot.id(id))
        .filter((activity: any) => activity !== null);

      if (reordered.length !== currentSlot.length) {
        throw new AppError("activityIds must include every activity in this slot exactly once", 400);
      }

      Object.assign(day, { [data.slot]: reordered });
    }

    const allActivities = [...day.morning, ...day.afternoon, ...day.evening];
    day.estimatedCost = allActivities.reduce(
      (sum: number, activity: any) => sum + (activity.estimatedCost || 0),
      0
    );

    await trip.save();

    return trip;
  }

  async regenerateActivity(
    tripId: string,
    userId: string,
    dayNumber: number,
    activityId: string,
    data: RegenerateActivityDto
  ) {
    const trip = await this.tripRepository.findByIdAndUserId(tripId, userId);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    const day = trip.itinerary.find((d: any) => d.dayNumber === dayNumber);

    if (!day) {
      throw new AppError(`Day ${dayNumber} does not exist on this trip`, 400);
    }

    const activity = day[data.slot].id(activityId);

    if (!activity) {
      throw new AppError("Activity not found", 404);
    }

    const regeneratedActivity = await this.itineraryAiService.regenerateActivity({
      destination: trip.destination,
      budgetType: trip.budgetType,
      interests: trip.interests,
      dayNumber,
      slot: data.slot,
      currentActivityTitle: activity.title ?? undefined,
      instruction: data.instruction,
    });

    Object.assign(activity, regeneratedActivity);

    const allActivities = [...day.morning, ...day.afternoon, ...day.evening];
    day.estimatedCost = allActivities.reduce(
      (sum: number, a: any) => sum + (a.estimatedCost || 0),
      0
    );

    await trip.save();

    return trip;
  }

  async restoreDay(tripId: string, userId: string, dayNumber: number, data: RestoreDayDto) {
    const trip = await this.tripRepository.findByIdAndUserId(tripId, userId);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    const day = trip.itinerary.find((d: any) => d.dayNumber === dayNumber);

    if (!day) {
      throw new AppError(`Day ${dayNumber} does not exist on this trip`, 400);
    }

    Object.assign(day, data);

    await trip.save();

    return trip;
  }

  async refreshHotels(tripId: string, userId: string) {
    const trip = await this.tripRepository.findByIdAndUserId(tripId, userId);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    const hotels = await this.itineraryAiService.regenerateHotels({
      destination: trip.destination,
      budgetType: trip.budgetType,
    });

    Object.assign(trip, { hotelSuggestions: hotels });
    await trip.save();

    return trip;
  }
}
