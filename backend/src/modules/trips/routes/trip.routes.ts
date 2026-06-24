import { Router } from "express";
import { TripRepository } from "../repositories/trip.repository.js";
import { TripService } from "../services/trip.service.js";
import { TripController } from "../controllers/trip.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { createTripSchema } from "../schemas/create-trip.schema.js";
import { updateTripSchema } from "../schemas/update-trip.schema.js";
import { asyncHandler } from "../../../core/errors/async-handler.js";

const router = Router();

const tripRepository = new TripRepository();
const tripService = new TripService(tripRepository);
const tripController = new TripController(tripService);

router.post("/", authMiddleware, validate(createTripSchema), asyncHandler(tripController.createTrip));
router.get("/", authMiddleware, asyncHandler(tripController.getTrips));
router.get("/:id", authMiddleware, asyncHandler(tripController.getTrip));
router.put("/:id", authMiddleware, validate(updateTripSchema), asyncHandler(tripController.updateTrip));
router.delete("/:id", authMiddleware, asyncHandler(tripController.deleteTrip));

export default router;