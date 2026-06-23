import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthService } from "../services/auth.service.js";
import { userRepository } from "../../users/repositories/user.repository.js";
import { JwtService } from "../services/jwt.service.js";
import { PasswordService } from "../services/password.service.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { registerSchema } from "../schemas/register.schema.js";
import { loginSchema } from "../schemas/login.schema.js";
import { authRateLimit } from "../middleware/auth-rate-limit.js";
import { asyncHandler } from "../../../core/errors/async-handler.js";

const router = Router();

const passwordService = new PasswordService();
const jwtService = new JwtService();
const authService = new AuthService(
    userRepository,
    passwordService,
    jwtService
);

const authController = new AuthController(authService);

router.post('/register', authRateLimit, validate(registerSchema), asyncHandler(authController.register));
router.post('/login', authRateLimit, validate(loginSchema), asyncHandler(authController.login));
router.post('/refresh', authRateLimit, asyncHandler(authController.refresh));
router.post('/logout', asyncHandler(authController.logout));

export default router;
