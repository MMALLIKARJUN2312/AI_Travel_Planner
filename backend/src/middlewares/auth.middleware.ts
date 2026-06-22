import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/authenticated-request.interface.js";
import { JwtService } from "../modules/auth/services/jwt.service.js";
import { AppError } from "../core/errors/app-error.js";

const jwtService = new JwtService();

export const authMiddleware = (
    req : AuthenticatedRequest,
    res : Response,
    next : NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Authentication Required", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwtService.verifyAccessToken(token);
        req.user = payload;

        next();
    } catch(error) {
        throw new AppError("Invalid or expired token", 401);
    }
}