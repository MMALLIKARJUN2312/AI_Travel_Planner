import { JwtService } from "../../modules/auth/services/jwt.service.js";
import { AppError } from "../../core/errors/app-error.js";

describe("JwtService", () => {
  const jwtService = new JwtService();
  const payload = { userId: "6a0000000000000000000000", role: "USER" };

  it("generates an access token that verifies back to the original payload", () => {
    const token = jwtService.generateAccessToken(payload);
    const decoded = jwtService.verifyAccessToken(token);

    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
  });

  it("generates a refresh token that verifies back to the original payload", () => {
    const token = jwtService.generateRefreshToken(payload);
    const decoded = jwtService.verifyRefreshToken(token);

    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
  });

  it("throws an AppError for a malformed access token", () => {
    expect(() => jwtService.verifyAccessToken("not-a-real-token")).toThrow(AppError);
  });

  it("throws an AppError when a refresh token is verified as an access token", () => {
    const refreshToken = jwtService.generateRefreshToken(payload);

    expect(() => jwtService.verifyAccessToken(refreshToken)).toThrow(AppError);
  });
});
