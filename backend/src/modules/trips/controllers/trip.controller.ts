import { Request, Response } from "express";
import { TripService } from "../services/trip.service.js";
import { AppError } from "../../../core/errors/app-error.js";

export class TripController {
  constructor(
    private readonly tripService: TripService
  ) {}

  createTrip = async (req: Request, res: Response) => {
    const trip = await this.tripService.createTrip(req.user.userId, req.body);

    res.status(201).json({
      success: true,
      message: "Trip created",
      data: trip
    });
  };

  getTrips = async (req: Request, res: Response) => {
    const trips = await this.tripService.getTrips(req.user.userId);

    res.status(200).json({
      success: true,
      data: trips
    });
  };

  getTrip = async (req: Request, res: Response) => {
    const tripId = req.params.id;

    if (!tripId || Array.isArray(tripId)) {
        throw new AppError("Invalid trip id", 400);
    }

    const trip = await this.tripService.getTrip(tripId, req.user.userId);

    res.status(200).json({
        success: true,
        data: trip
    });
    };

  updateTrip = async (req: Request, res: Response) => {
    const tripId = req.params.id;

    if (!tripId || Array.isArray(tripId)) {
        throw new AppError("Invalid trip id", 400);
    }

    const trip = await this.tripService.updateTrip(tripId, req.user.userId, req.body);

    res.status(200).json({
        success: true,
        message: "Trip updated",
        data: trip
    });
};

  deleteTrip = async (req: Request, res: Response) => {
    const tripId = req.params.id;

    if (!tripId || Array.isArray(tripId)) {
        throw new AppError("Invalid trip id", 400);
    }

    await this.tripService.deleteTrip(tripId, req.user.userId);

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully"
    });
    };
}