import { AppError } from "../../../core/errors/app-error.js";
import { UserRepository } from "../repositories/user.repository.js";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
