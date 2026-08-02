import { Request, Response } from "express";
import { Types } from "mongoose";
import { TripService } from "../services/trip.service.js";
import { AppError } from "../../../core/errors/app-error.js";

type TripParams = {
  id: string;
};

type DayParams = {
  id: string;
  dayNumber: string;
};

type ActivityParams = {
  id: string;
  dayNumber: string;
  activityId: string;
};

export class TripController {
  constructor(
    private readonly tripService: TripService
  ) {}

  createTrip = async (req: Request, res: Response) => {
    const trip = await this.tripService.createTrip(req.user.userId, req.body);

    res.status(201).json({
      success: true,
      message: "Trip created",
      data: trip,
    });
  };

  getTrips = async (req: Request, res: Response) => {
    const trips = await this.tripService.getTrips(req.user.userId);

    res.status(200).json({
      success: true,
      data: trips,
    });
  };

  getTrip = async (req: Request<TripParams>, res: Response) => {
    const tripId = req.params.id;

    if (!Types.ObjectId.isValid(tripId)) {
      throw new AppError("Invalid trip id", 400);
    }

    const trip = await this.tripService.getTrip(tripId, req.user.userId);

    res.status(200).json({
      success: true,
      data: trip,
    });
  };

  updateTrip = async (req: Request<TripParams>, res: Response) => {
    const tripId = req.params.id;

    if (!Types.ObjectId.isValid(tripId)) {
      throw new AppError("Invalid trip id", 400);
    }

    const trip = await this.tripService.updateTrip(tripId, req.user.userId, req.body);

    res.status(200).json({
      success: true,
      message: "Trip updated",
      data: trip,
    });
  };

  deleteTrip = async (
    req: Request<TripParams>,
    res: Response
  ) => {
    const tripId = req.params.id;

    if (!Types.ObjectId.isValid(tripId)) {
      throw new AppError("Invalid trip id", 400);
    }

    await this.tripService.deleteTrip(
      tripId,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });
  };

  regenerateDay = async (req: Request<TripParams>, res: Response) => {
    const tripId = req.params.id;

    if (!Types.ObjectId.isValid(tripId)) {
      throw new AppError("Invalid trip id", 400);
    }

    const trip = await this.tripService.regenerateDay(tripId, req.user.userId, req.body);

    res.status(200).json({
      success: true,
      message: "Day regenerated",
      data: trip,
    });
  };

  updateActivities = async (req: Request<DayParams>, res: Response) => {
    const tripId = req.params.id;

    if (!Types.ObjectId.isValid(tripId)) {
      throw new AppError("Invalid trip id", 400);
    }

    const dayNumber = Number(req.params.dayNumber);

    if (!Number.isInteger(dayNumber) || dayNumber < 1) {
      throw new AppError("Invalid day number", 400);
    }

    const trip = await this.tripService.updateActivities(tripId, req.user.userId, dayNumber, req.body);

    res.status(200).json({
      success: true,
      message: "Itinerary updated",
      data: trip,
    });
  };

  regenerateActivity = async (req: Request<ActivityParams>, res: Response) => {
    const tripId = req.params.id;

    if (!Types.ObjectId.isValid(tripId)) {
      throw new AppError("Invalid trip id", 400);
    }

    const dayNumber = Number(req.params.dayNumber);

    if (!Number.isInteger(dayNumber) || dayNumber < 1) {
      throw new AppError("Invalid day number", 400);
    }

    const trip = await this.tripService.regenerateActivity(
      tripId,
      req.user.userId,
      dayNumber,
      req.params.activityId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Activity regenerated",
      data: trip,
    });
  };

  restoreDay = async (req: Request<DayParams>, res: Response) => {
    const tripId = req.params.id;

    if (!Types.ObjectId.isValid(tripId)) {
      throw new AppError("Invalid trip id", 400);
    }

    const dayNumber = Number(req.params.dayNumber);

    if (!Number.isInteger(dayNumber) || dayNumber < 1) {
      throw new AppError("Invalid day number", 400);
    }

    const trip = await this.tripService.restoreDay(tripId, req.user.userId, dayNumber, req.body);

    res.status(200).json({
      success: true,
      message: "Day restored",
      data: trip,
    });
  };

  refreshHotels = async (req: Request<TripParams>, res: Response) => {
    const tripId = req.params.id;

    if (!Types.ObjectId.isValid(tripId)) {
      throw new AppError("Invalid trip id", 400);
    }

    const trip = await this.tripService.refreshHotels(tripId, req.user.userId);

    res.status(200).json({
      success: true,
      message: "Hotel suggestions refreshed",
      data: trip,
    });
  };
}
