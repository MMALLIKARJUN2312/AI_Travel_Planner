import { Router } from "express";
import { TripRepository } from "../repositories/trip.repository.js";
import { TripService } from "../services/trip.service.js";
import { TripController } from "../controllers/trip.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { createTripSchema } from "../schemas/create-trip.schema.js";
import { updateTripSchema } from "../schemas/update-trip.schema.js";
import { regenerateDaySchema } from "../schemas/regenerate-day.schema.js";
import { regenerateActivitySchema } from "../schemas/regenerate-activity.schema.js";
import { restoreDaySchema } from "../schemas/restore-day.schema.js";
import { activityEditSchema } from "../schemas/activity-edit.schema.js";
import { asyncHandler } from "../../../core/errors/async-handler.js";
import { ItineraryAiService } from "../../ai/services/itinerary-ai.service.js";
import { getAiProvider } from "../../ai/providers/provider.factory.js";

const router = Router();

const tripRepository = new TripRepository();
const itineraryAiService = new ItineraryAiService(getAiProvider());
const tripService = new TripService(tripRepository, itineraryAiService);
const tripController = new TripController(tripService);

router.post("/", authMiddleware, validate(createTripSchema), asyncHandler(tripController.createTrip));
router.get("/", authMiddleware, asyncHandler(tripController.getTrips));
router.get("/:id", authMiddleware, asyncHandler(tripController.getTrip));
router.put("/:id", authMiddleware, validate(updateTripSchema), asyncHandler(tripController.updateTrip));
router.delete("/:id", authMiddleware, asyncHandler(tripController.deleteTrip));

router.post(
  "/:id/regenerate-day",
  authMiddleware,
  validate(regenerateDaySchema),
  asyncHandler(tripController.regenerateDay)
);
router.patch(
  "/:id/itinerary/:dayNumber/activities",
  authMiddleware,
  validate(activityEditSchema),
  asyncHandler(tripController.updateActivities)
);
router.post(
  "/:id/itinerary/:dayNumber/activities/:activityId/regenerate",
  authMiddleware,
  validate(regenerateActivitySchema),
  asyncHandler(tripController.regenerateActivity)
);
router.put(
  "/:id/itinerary/:dayNumber",
  authMiddleware,
  validate(restoreDaySchema),
  asyncHandler(tripController.restoreDay)
);
router.post(
  "/:id/hotels/refresh",
  authMiddleware,
  asyncHandler(tripController.refreshHotels)
);

export default router;
