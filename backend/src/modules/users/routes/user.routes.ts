import { Router } from "express";
import { userRepository } from "../repositories/user.repository.js";
import { UserService } from "../services/user.service.js";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../../core/errors/async-handler.js";

const router = Router();

const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get("/me", authMiddleware, asyncHandler(userController.getMe));

export default router;
