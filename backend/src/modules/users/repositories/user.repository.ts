import { UserModel } from "../models/user.model.js";
import { z } from "zod";
import { registerSchema } from "../../auth/schemas/register.schema.js";
import { UserRole } from "../types/user-role.enum.js";

type CreateUserDto = z.infer<typeof registerSchema> & {
    role ?: UserRole;
};

export class UserRepository {
    async findByEmail(email : string) {
        return UserModel.findOne({email : email.toLowerCase()}).exec();
    }

    async findById(id: string) {
        return UserModel.findById(id).exec();
    }

    async create(userDto : CreateUserDto) {
        return UserModel.create(userDto);
    }

    async save(user : any) {
        return user.save();
    }

    async findByEmailWithPassword(email : string) {
        return UserModel.findOne({email : email.toLowerCase()})
            .select("+password")
            .exec();
    }

    async addRefreshToken(userId: string, token: string) {
        return UserModel.findByIdAndUpdate(
            userId,
            { $push: { refreshTokens: { token } } }, 
            { new: true }
        ).exec();
    }

    async removeRefreshToken(userId: string, token: string) {
        return UserModel.findByIdAndUpdate(
            userId,
            { $pull: { refreshTokens: { token: token } } },
            { new: true }
        ).exec();
    }

    async replaceRefreshToken(userId: string, oldToken: string, newToken: string) {
        return UserModel.findByIdAndUpdate(
            userId,
            {
                $pull: { refreshTokens: { token: oldToken } },
                $push: { refreshTokens: { token: newToken } }
            },
            { new: true }
        ).exec();
    }
}

export const userRepository = new UserRepository();