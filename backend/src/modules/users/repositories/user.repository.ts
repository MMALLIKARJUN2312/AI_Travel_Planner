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
            { returnDocument: "after" }
        ).exec();
    }

    async removeRefreshToken(userId: string, token: string) {
        return UserModel.findByIdAndUpdate(
            userId,
            { $pull: { refreshTokens: { token: token } } },
            { returnDocument: "after" }
        ).exec();
    }

    async replaceRefreshToken(
        userId: string,
        oldRefreshToken: string,
        newRefreshToken: string
    ) {
    const user = await UserModel.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const updatedTokens = user.refreshTokens.toObject().filter(
        (t: any) => t.token !== oldRefreshToken
    );

    updatedTokens.push({
        token: newRefreshToken
    });

    user.refreshTokens = updatedTokens as any;

    await user.save();
    return user;
}
}

export const userRepository = new UserRepository();