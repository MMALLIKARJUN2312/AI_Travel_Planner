import { Request, Response, NextFunction } from "express";
import { AppError } from "../core/errors/app-error.js";

export const errorMiddleware = (
    error : Error,
    req : Request,
    res : Response,
    next : NextFunction
    ) : void => {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success : false,
                message : error.message
            })
            return;
        }
        res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }