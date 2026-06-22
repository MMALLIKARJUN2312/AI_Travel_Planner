import { UserModel } from "../models/user.model.js";
import { z } from "zod";
import { registerSchema } from "../../auth/schemas/register.schema.js";

type CreateUserDto = z.infer<typeof registerSchema>;

export class UserRepository {
    async findByEmail(email : string) {
        return UserModel.findOne({email : email.toLowerCase(),   
        })
        .select("+password")
        .exec();
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
}

export const userRepository = new UserRepository();