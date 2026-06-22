import { Response, NextFunction } from "express";
import { AppError } from "../core/errors/app-error.js";
import { AuthenticatedRequest } from "../types/authenticated-request.interface.js";

export const authorize = (...roles : string[]) => {
    return (
        req: AuthenticatedRequest,
        res : Response,
        next : NextFunction
    ) : void => {
        if (!req.user) {
            throw new AppError("Authentication Required", 401);
        }

        if (!roles.includes(req.user.role)) {
            throw new AppError("Forbidden", 403);
        }

        next();
    }
}