import { PasswordService } from "../../modules/auth/services/password.service.js";

describe("PasswordService", () => {
  const passwordService = new PasswordService();

  it("hashes a password to a value different from the original", async () => {
    const hash = await passwordService.hash("Password123!");

    expect(hash).not.toBe("Password123!");
    expect(hash.length).toBeGreaterThan(0);
  });

  it("verifies a correct password against its hash", async () => {
    const hash = await passwordService.hash("Password123!");

    await expect(passwordService.compare("Password123!", hash)).resolves.toBe(true);
  });

  it("rejects an incorrect password against a hash", async () => {
    const hash = await passwordService.hash("Password123!");

    await expect(passwordService.compare("WrongPassword!", hash)).resolves.toBe(false);
  });

  it("produces a different hash for the same password on each call (unique salt)", async () => {
    const [hashOne, hashTwo] = await Promise.all([
      passwordService.hash("Password123!"),
      passwordService.hash("Password123!"),
    ]);

    expect(hashOne).not.toBe(hashTwo);
  });
});
