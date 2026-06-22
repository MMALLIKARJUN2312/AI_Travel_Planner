import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';
import { TokenPayload } from '../types/token-payload.interface.js';

export class JwtService {
    generateAccessToken(payload : TokenPayload): string {
        return jwt.sign(payload, env.JWT_ACCESS_SECRET,
        {
            expiresIn : env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"]
        })
    }

    generateRefreshToken(payload : TokenPayload): string {
        return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
            expiresIn : env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"]
        })
    }

    verifyAccessToken(token : string): TokenPayload {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
    }

    verifyRefreshToken(token : string): TokenPayload {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
    }
}