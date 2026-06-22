import { AppError } from "../../../core/errors/app-error.js";
import { logger } from "../../../core/logger/logger.js";
import { UserRepository } from "../../users/repositories/user.repository.js";
import { PasswordService } from "./password.service.js";
import { JwtService } from "./jwt.service.js";
import { UserRole } from "../../users/types/user-role.enum.js";

export interface AuthTokens {
    accessToken : string,
    refreshToken : string
}

export interface RegisterInput {
    name : string,
    email : string,
    password : string
} 

export interface LoginInput {
    email : string,
    password : string
}

export class AuthService {
    constructor(
        private readonly userRepository : UserRepository,
        private readonly passwordService : PasswordService,
        private readonly jwtService : JwtService
    ) {}

    async register (input : RegisterInput) : Promise<AuthTokens> {
        const existingUser = await this.userRepository.findByEmail(input.email);

        if (existingUser) {
            logger.warn("Registration failed", {email : input.email})
            throw new AppError("Unable to complete registration", 400);
        }

        const hashedPassword = await this.passwordService.hash(input.password);

        const user = await this.userRepository.create({
            name : input.name, 
            email : input.email,
            password : hashedPassword,
            role : UserRole.USER
        })

        const payload = {userId : user.id, role : user.role};
        const accessToken = this.jwtService.generateAccessToken(payload);
        const refreshToken = this.jwtService.generateRefreshToken(payload);

        await this.userRepository.addRefreshToken(user.id, refreshToken);

        logger.info("User Registered", {userId : user.id})

        return {accessToken, refreshToken}
    };

    async login(input: LoginInput): Promise<AuthTokens> {
        const user = await this.userRepository.findByEmailWithPassword(input.email);

        if (!user) {
            logger.warn("Failed login attempt", { email: input.email });
            throw new AppError("Invalid credentials", 401);
        }

        const isValid = await this.passwordService.compare(input.password, user.password);

        if (!isValid) {
            logger.warn("Failed login attempt", { email: input.email });
            throw new AppError("Invalid credentials", 401);
        }

        const payload = { userId: user.id, role: user.role };
        const accessToken = this.jwtService.generateAccessToken(payload);
        const refreshToken = this.jwtService.generateRefreshToken(payload);

        await this.userRepository.addRefreshToken(user.id, refreshToken);

        logger.info("User logged in", { userId: user.id });

        return { accessToken, refreshToken };
    }

    async refreshSession(refreshToken: string | undefined): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new AppError("Refresh token missing", 401);
    }

    const payload = this.jwtService.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findById(payload.userId);

    if (!user) {
      throw new AppError("Invalid session", 401);
    }

    const tokenExists = user.refreshTokens.some(
        (t: any) => t.token === refreshToken
    );

    if (!tokenExists) {
        throw new AppError("Invalid session", 401);
    }

    const newPayload = { userId: user.id, role: user.role };
    const newAccessToken = this.jwtService.generateAccessToken(newPayload);
    const newRefreshToken = this.jwtService.generateRefreshToken(newPayload);

    await this.userRepository.replaceRefreshToken(
      user.id,
      refreshToken,
      newRefreshToken
    );

    logger.info("Session refreshed", { userId: user.id });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      return; 
    }

    try {
      const payload = this.jwtService.verifyRefreshToken(refreshToken);
      await this.userRepository.removeRefreshToken(payload.userId, refreshToken);
      logger.info("User logged out", { userId: payload.userId });
    } catch (error) {
      logger.warn("Logout token validation failed");
    }
  }
}