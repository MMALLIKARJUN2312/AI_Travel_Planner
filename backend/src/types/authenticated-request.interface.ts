import { Request } from "express";
import { TokenPayload } from "../modules/auth/types/token-payload.interface.js";

export interface AuthenticatedRequest extends Request {
    user : TokenPayload;
}