import { UserRepository } from "../../users/repositories/user.repository.js";
import { PasswordService } from "./password.service.js";
import { JwtService } from "./jwt.service.js";

export class AuthService {
    constructor(
        private readonly userRepository : UserRepository,
        private readonly passwordService : PasswordService,
        private readonly jwtService : JwtService
    ) {}
}