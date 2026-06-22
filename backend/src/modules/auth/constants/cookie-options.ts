import { CookieOptions } from "express";

export const refreshCookieOptions : CookieOptions = {
    httpOnly : true,
    secure : process.env.NODE_ENV === "production",
    sameSite : "strict",
    path : "/api/auth/refresh",
    maxAge : 7 * 24 * 60 * 60 * 1000,
}