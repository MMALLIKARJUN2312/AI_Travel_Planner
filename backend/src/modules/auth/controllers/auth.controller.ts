import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { refreshCookieOptions } from "../constants/cookie-options.js";

export class AuthController {
    constructor (
        private readonly authService : AuthService
    ) {}

    register = async (req : Request, res : Response): Promise <void> => {
        const result = await this.authService.register(req.body);

        res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

        res.status(201).json({
            success : true,
            message : "Registration successful",
            data : {
                accessToken : result.accessToken
            }
        })
    }

    login = async (req : Request, res : Response): Promise <void> => {
        const result = await this.authService.login(req.body);

        res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

        res.status(200).json({
            success : true,
            message : "Login successful",
            data : {
                accessToken : result.accessToken
            }
        })
    }

    refresh = async (req : Request, res : Response): Promise <void> => {
        const refreshToken = req.cookies?.refreshToken;

        const result = await this.authService.refreshSession(refreshToken);

        res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

        res.status(200).json({
            success : true,
            message : "Session refreshed",
            data : {
                accessToken : result.accessToken
            }
        })
    }

    logout = async (req : Request, res : Response): Promise <void> => {
        const refreshToken = req.cookies?.refreshToken;

        await this.authService.logout(refreshToken);

        res.clearCookie("refreshToken", refreshCookieOptions);

        res.status(200).json({
            success : true,
            message : "Logout successful",
        })
    }
}