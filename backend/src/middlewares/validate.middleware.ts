import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { AppError } from "../core/errors/app-error.js";

export const validate = (schema : ZodType) => (
    req : Request,
    res : Response,
    next : NextFunction
): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errorMessages = result.error.issues
        .map((issue) => `(${issue.path.join(".")}) ${issue.message}`)
        .join(". ")

        return next(new AppError(`Validation failed, ${errorMessages}`, 400))
    }

    req.body = result.data;
    next();
}